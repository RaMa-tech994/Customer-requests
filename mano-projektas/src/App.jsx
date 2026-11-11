import { useCallback, useEffect, useMemo, useState } from 'react'
import Auth from './Auth.jsx'
import { supabase } from './lib/supabase.js'
import './App.css'

function rowDate(row) {
  return row['created-at'] ?? row.created_at ?? row.createdAt ?? null
}

function displayDate(value) {
  if (!value) return '—'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '—'
  return new Intl.DateTimeFormat('lt-LT', { year: 'numeric', month: 'short', day: 'numeric' }).format(date)
}

function App() {
  const [session, setSession] = useState(undefined)
  const [projects, setProjects] = useState([])
  const [requests, setRequests] = useState([])
  const [isAdmin, setIsAdmin] = useState(false)
  const [selectedProject, setSelectedProject] = useState('all')
  const [query, setQuery] = useState('')
  const [showRequestForm, setShowRequestForm] = useState(false)
  const [showProjectForm, setShowProjectForm] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [notice, setNotice] = useState('')
  const [dataError, setDataError] = useState('')
  const [requestForm, setRequestForm] = useState({ title: '', projectId: '', priority: 'Normal' })
  const [projectName, setProjectName] = useState('')

  useEffect(() => {
    let active = true
    supabase.auth.getSession().then(({ data, error }) => {
      if (!active) return
      if (error) console.error('Nepavyko patikrinti Supabase sesijos:', error.message)
      setSession(data.session ?? null)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      if (active) setSession(nextSession)
    })
    return () => {
      active = false
      subscription.unsubscribe()
    }
  }, [])

  const loadWorkspace = useCallback(async () => {
    if (!session?.user?.id) return
    setLoading(true)
    setDataError('')
    const [projectsResult, requestsResult, roleResult] = await Promise.all([
      supabase.from('projects').select('*'),
      supabase.from('requests').select('*').eq('user_id', session.user.id),
      supabase.from('user_roles').select('role').eq('user_id', session.user.id).maybeSingle(),
    ])
    if (projectsResult.error || requestsResult.error) {
      const error = projectsResult.error || requestsResult.error
      setDataError(`Nepavyko gauti duomenų iš Supabase: ${error.message}`)
      setLoading(false)
      return
    }
    const nextProjects = (projectsResult.data ?? []).sort((a, b) => new Date(rowDate(b) ?? 0) - new Date(rowDate(a) ?? 0))
    const nextRequests = (requestsResult.data ?? []).sort((a, b) => new Date(rowDate(b) ?? 0) - new Date(rowDate(a) ?? 0))
    setProjects(nextProjects)
    setRequests(nextRequests)
    setIsAdmin(!roleResult.error && roleResult.data?.role === 'admin')
    if (roleResult.error) setDataError(`Nepavyko patikrinti administratoriaus teisių: ${roleResult.error.message}`)
    setLoading(false)
  }, [session?.user?.id])

  useEffect(() => {
    if (session?.user?.id) loadWorkspace()
    else {
      setProjects([])
      setRequests([])
      setLoading(false)
    }
  }, [loadWorkspace, session?.user?.id])

  const visibleRequests = useMemo(() => requests.filter((request) => {
    const matchesProject = selectedProject === 'all' || request.project_id === selectedProject
    const term = query.trim().toLocaleLowerCase('lt')
    const projectNameForRequest = projects.find((project) => project.id === request.project_id)?.name ?? ''
    const matchesSearch = !term || `${request.title ?? ''} ${projectNameForRequest} ${request.id}`.toLocaleLowerCase('lt').includes(term)
    return matchesProject && matchesSearch
  }), [projects, query, requests, selectedProject])

  if (session === undefined) return <main className="auth-loading">Jungiama prie paskyros…</main>
  if (!session) return <Auth />

  async function submitRequest(event) {
    event.preventDefault()
    const projectId = requestForm.projectId || projects[0]?.id
    if (!projectId) {
      setDataError('Pirmiausia sukurkite projektą.')
      return
    }
    setSaving(true)
    setDataError('')
    const { error } = await supabase.from('requests').insert({
      user_id: session.user.id,
      project_id: projectId,
      title: requestForm.title.trim(),
      priority: requestForm.priority.toLowerCase(),
    })
    setSaving(false)
    if (error) {
      setDataError(`Nepavyko sukurti užklausos: ${error.message}`)
      return
    }
    setRequestForm({ title: '', projectId: '', priority: 'Normal' })
    setShowRequestForm(false)
    setNotice('Užklausa išsaugota Supabase.')
    loadWorkspace()
    window.setTimeout(() => setNotice(''), 4500)
  }

  async function submitProject(event) {
    event.preventDefault()
    if (!isAdmin) {
      setShowProjectForm(false)
      setDataError('Projektus kurti gali tik administratorius.')
      return
    }
    setSaving(true)
    setDataError('')
    const { error } = await supabase.from('projects').insert({
      user_id: session.user.id,
      name: projectName.trim(),
    })
    setSaving(false)
    if (error) {
      setDataError(`Nepavyko sukurti projekto: ${error.message}`)
      return
    }
    setProjectName('')
    setShowProjectForm(false)
    setNotice('Projektas išsaugotas Supabase.')
    loadWorkspace()
    window.setTimeout(() => setNotice(''), 4500)
  }

  const highPriorityCount = requests.filter((request) => String(request.priority).toLowerCase() === 'high').length
  const normalPriorityCount = requests.filter((request) => String(request.priority).toLowerCase() !== 'high').length

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <a className="brand" href="#top" aria-label="Pagalba — pradžia"><span className="brand-mark">P</span><span>pagalba<span className="brand-dot">.</span></span></a>
        <div className="workspace-label">DARBO ERDVĖ</div>
        <button className="nav-item active"><span className="nav-icon">▦</span>Užklausos<span className="nav-count">{requests.length}</span></button>
        {isAdmin && <button className="nav-item" onClick={() => setShowProjectForm(true)}><span className="nav-icon">▧</span>Naujas projektas</button>}
        <div className="sidebar-bottom"><div className="avatar">{session.user.email?.slice(0, 2).toUpperCase() || 'NA'}</div><div><strong>{session.user.email}</strong><small>Prisijungęs naudotojas</small></div></div>
      </aside>

      <main className="main-content" id="top">
        <header className="topbar"><div className="breadcrumb">Darbo erdvė <span>/</span> <strong>Užklausos</strong></div><div className="topbar-right"><span className="user-email">{session.user.email}</span><button className="sign-out-button" onClick={() => supabase.auth.signOut()}>Atsijungti</button></div></header>
        <section className="page-content">
          <div className="page-heading"><div><div className="eyebrow">KLIENTŲ APTARNAVIMAS</div><h1>Užklausos</h1></div><button className="primary-button" onClick={() => { if (projects.length === 0) setDataError('Projektų dar nėra. Paprašykite administratoriaus sukurti projektą.'); else setShowRequestForm(true) }} disabled={loading}><span>＋</span> Nauja užklausa</button></div>

          {dataError && <div className="data-error" role="alert">{dataError}<button onClick={() => setDataError('')} aria-label="Uždaryti pranešimą">×</button></div>}

          <div className="stats-grid">
            <article className="stat-card"><div className="stat-top"><span>Visos užklausos</span><span className="stat-icon lavender">▤</span></div><strong>{requests.length}</strong><small>Jūsų projektuose</small></article>
            <article className="stat-card"><div className="stat-top"><span>Projektai</span><span className="stat-icon blue">▧</span></div><strong>{projects.length}</strong><small>Jūsų darbo erdvėje</small></article>
            <article className="stat-card"><div className="stat-top"><span>Aukšto prioriteto</span><span className="stat-icon rose">↗</span></div><strong>{highPriorityCount}</strong><small>Pažymėtos High</small></article>
            <article className="stat-card"><div className="stat-top"><span>Įprasto prioriteto</span><span className="stat-icon amber">◷</span></div><strong>{normalPriorityCount}</strong><small>Pažymėtos Normal</small></article>
          </div>

          <section className="requests-panel">
            <div className="panel-heading"><div><h2>Mano užklausos</h2></div>{isAdmin && <button className="export-button" onClick={() => setShowProjectForm(true)}>＋ <span>Naujas projektas</span></button>}</div>
            <div className="table-toolbar"><label className="search-box"><span>⌕</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Ieškoti užklausų..." /></label><label className="project-filter"><span>Projektas:</span><select value={selectedProject} onChange={(event) => setSelectedProject(event.target.value)}><option value="all">Visi projektai</option>{projects.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select><b>⌄</b></label></div>
            <div className="table-scroll"><table><thead><tr><th>UŽKLAUSA</th><th>PROJEKTAS</th><th>DATA</th><th>PRIORITETAS</th></tr></thead><tbody>
              {loading && <tr><td className="empty-state" colSpan="4">Kraunami duomenys…</td></tr>}
              {!loading && visibleRequests.map((item) => {
                const linkedProject = projects.find((project) => project.id === item.project_id)
                const high = String(item.priority).toLowerCase() === 'high'
                return <tr key={item.id}><td><div className="request-title">{item.title}</div><div className="request-id">{String(item.id).slice(0, 8).toUpperCase()}</div></td><td><span className="project-cell"><i />{linkedProject?.name ?? 'Projektas nerastas'}</span></td><td className="date-cell">{displayDate(rowDate(item))}</td><td><span className={`priority ${high ? 'high' : 'normal'}`}><i />{high ? 'Aukšta' : 'Įprasta'}</span></td></tr>
              })}
              {!loading && visibleRequests.length === 0 && <tr><td className="empty-state" colSpan="4">{projects.length === 0 ? 'Dar neturite projektų. Sukurkite projektą, tada galėsite pridėti užklausų.' : 'Užklausų nerasta. Pabandykite pakeisti paiešką arba projektą.'}</td></tr>}
            </tbody></table></div>
            <div className="table-footer"><span>Rodoma <strong>{visibleRequests.length ? 1 : 0}–{visibleRequests.length}</strong> iš <strong>{visibleRequests.length}</strong> užklausų</span><button className="refresh-button" onClick={loadWorkspace} disabled={loading}>Atnaujinti</button></div>
          </section>
        </section>
      </main>

      {notice && <div className="toast" role="status">✓ {notice}</div>}
      {showRequestForm && <div className="modal-backdrop" onClick={(event) => { if (event.target === event.currentTarget) setShowRequestForm(false) }}><section className="modal" role="dialog" aria-modal="true" aria-labelledby="request-modal-title"><div className="modal-heading"><div><div className="eyebrow">NAUJA UŽKLAUSA</div><h2 id="request-modal-title">Užregistruokite užklausą</h2></div><button className="close-button" onClick={() => setShowRequestForm(false)} aria-label="Uždaryti">×</button></div><form onSubmit={submitRequest}><label>Užklausos pavadinimas<input required autoFocus value={requestForm.title} onChange={(event) => setRequestForm({ ...requestForm, title: event.target.value })} placeholder="Trumpai aprašykite problemą" /></label><label>Projektas<select required value={requestForm.projectId || projects[0]?.id || ''} onChange={(event) => setRequestForm({ ...requestForm, projectId: event.target.value })}>{projects.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></label><label>Prioritetas<select value={requestForm.priority} onChange={(event) => setRequestForm({ ...requestForm, priority: event.target.value })}><option value="Normal">Normal</option><option value="High">High</option></select></label><div className="modal-actions"><button type="button" className="cancel-button" onClick={() => setShowRequestForm(false)}>Atšaukti</button><button type="submit" className="primary-button" disabled={saving}>{saving ? 'Saugoma…' : 'Sukurti užklausą'}</button></div></form></section></div>}
      {showProjectForm && <div className="modal-backdrop" onClick={(event) => { if (event.target === event.currentTarget) setShowProjectForm(false) }}><section className="modal" role="dialog" aria-modal="true" aria-labelledby="project-modal-title"><div className="modal-heading"><div><div className="eyebrow">NAUJAS PROJEKTAS</div><h2 id="project-modal-title">Sukurkite projektą</h2></div><button className="close-button" onClick={() => setShowProjectForm(false)} aria-label="Uždaryti">×</button></div><form onSubmit={submitProject}><label>Projekto pavadinimas<input required autoFocus value={projectName} onChange={(event) => setProjectName(event.target.value)} placeholder="Pvz., Klientų portalas" /></label><div className="modal-actions"><button type="button" className="cancel-button" onClick={() => setShowProjectForm(false)}>Atšaukti</button><button type="submit" className="primary-button" disabled={saving}>{saving ? 'Saugoma…' : 'Sukurti projektą'}</button></div></form></section></div>}
    </div>
  )
}

export default App
