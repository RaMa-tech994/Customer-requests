import { useState } from 'react'
import { supabase } from './lib/supabase'
import './Auth.css'

function Auth() {
  const [mode, setMode] = useState('sign-in')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setMessage('')
    setLoading(true)

    try {
      if (mode === 'sign-up') {
        const { data, error: authError } = await supabase.auth.signUp({ email, password })
        if (authError) throw authError
        if (!data.session) {
          setMessage('Patikrinkite el. paštą ir patvirtinkite paskyrą, tada galėsite prisijungti.')
        } else {
          setMessage('Paskyra sukurta. Galite tęsti.')
        }
      } else {
        const { error: authError } = await supabase.auth.signInWithPassword({ email, password })
        if (authError) throw authError
      }
    } catch (authError) {
      setError(authError.message || 'Nepavyko prisijungti. Bandykite dar kartą.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-card">
        <a className="auth-brand" href="#top"><span className="brand-mark">P</span><span>pagalba<span className="brand-dot">.</span></span></a>
        <div className="eyebrow">KLIENTŲ APTARNAVIMAS</div>
        <h1>{mode === 'sign-in' ? 'Sveiki sugrįžę' : 'Sukurkite paskyrą'}</h1>
        <p className="auth-intro">{mode === 'sign-in' ? 'Prisijunkite, kad galėtumėte valdyti savo užklausas.' : 'Registruokitės, kad galėtumėte pradėti naudotis sistema.'}</p>

        <form className="auth-form" onSubmit={handleSubmit}>
          <label>El. pašto adresas
            <input type="email" autoComplete="email" required value={email} onChange={(event) => setEmail(event.target.value)} placeholder="vardas@pastas.lt" />
          </label>
          <label>Slaptažodis
            <input type="password" autoComplete={mode === 'sign-in' ? 'current-password' : 'new-password'} minLength={6} required value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Bent 6 simboliai" />
          </label>
          {error && <p className="auth-message error" role="alert">{error}</p>}
          {message && <p className="auth-message success" role="status">{message}</p>}
          <button className="primary-button auth-submit" type="submit" disabled={loading}>{loading ? 'Palaukite…' : mode === 'sign-in' ? 'Prisijungti' : 'Sukurti paskyrą'}</button>
        </form>

        <p className="auth-switch">{mode === 'sign-in' ? 'Neturite paskyros?' : 'Jau turite paskyrą?'}{' '}
          <button type="button" onClick={() => { setMode(mode === 'sign-in' ? 'sign-up' : 'sign-in'); setError(''); setMessage('') }}>{mode === 'sign-in' ? 'Registruotis' : 'Prisijungti'}</button>
        </p>
      </section>
    </main>
  )
}

export default Auth
