# Customer Requests

React + Vite aplikacija klientų užklausoms registruoti ir administruoti. Duomenys ir naudotojų paskyros saugomi Supabase.

## Funkcijos

- Registracija ir prisijungimas el. paštu bei slaptažodžiu.
- Projektų kūrimas administratoriaus paskyra.
- Visi prisijungę naudotojai gali matyti projektus ir jiems kurti užklausas.
- Naudotojai mato tik savo užklausas; prieigą riboja Supabase RLS.
- Užklausos prioritetas: `High` arba `Normal`.

## Technologijos

- Frontend: React, Vite ir JavaScript.
- Autentifikacija ir duomenų bazė: Supabase Auth, PostgreSQL ir RLS.
- Lint: Oxlint.
- Diegimas: Vercel (dar nesukonfigūruota).
- El. pašto automatizavimas: numatytas Supabase Database Webhook → Zapier → Gmail srautas; ši integracija dar neaprašyta aplikacijos konfigūracijoje.

## Supabase duomenų modelis

| Lentelė | Stulpeliai | Paskirtis |
| --- | --- | --- |
| `projects` | `id` (uuid), `user_id` (uuid), `name` (text), `created_at` (timestamptz) | Projektas. `user_id` nurodo sukūrusį naudotoją. |
| `requests` | `id` (uuid), `project_id` (uuid), `user_id` (uuid), `title` (text), `priority` (text), `created_at` (timestamptz) | Užklausa, susieta su projektu ir ją pateikusiu naudotoju. |
| `user_roles` | `user_id` (uuid), `role` (`admin` arba `user`), `created_at` (timestamptz) | Naudotojo vaidmuo. |

RLS taisyklės leidžia prisijungusiems naudotojams skaityti projektus, bet juos kurti gali tik `admin` vaidmenį turintys naudotojai. Užklausos skaitomos ir kuriamos pagal prisijungusio naudotojo `user_id`. Aplikacija datos lauką perskaito iš `created_at` arba `created-at`; įrašant naują eilutę datą turėtų užpildyti duomenų bazės numatytoji reikšmė.

Admin vaidmuo saugomas `public.user_roles` lentelėje. Priskirti administratorių jau egzistuojančiai Supabase Auth paskyrai galima SQL Editor:

```sql
insert into public.user_roles (user_id, role)
select id, 'admin'
from auth.users
where lower(email) = lower('ADMIN_PASKYROS_EL_PASTAS')
on conflict (user_id)
do update set role = excluded.role;
```

Vaidmenį priskirkite tik patikimai paskyrai. `service_role` / secret rakto nedėkite į frontend aplikaciją.

## Paleidimas vietoje

Reikalingas Node.js ir npm. Komandas vykdykite projekto aplanke `mano-projektas`:

```powershell
cd .\mano-projektas
npm install
Copy-Item .env.example .env.local
```

Užpildykite `.env.local` reikšmėmis iš savo Supabase projekto **Connect** lango arba **Project Settings → API Keys**:

```env
VITE_SUPABASE_URL=https://jusu-projekto-id.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_jusu_raktas
```

`VITE_SUPABASE_ANON_KEY` palaikomas senesniam anon raktui, tačiau naujam projektui naudokite publishable raktą. `.env.local` yra ignoruojamas Git.

Paleiskite kūrimo serverį:

```powershell
npm.cmd run dev
```

Kitose terminalo aplinkose galima naudoti `npm run dev`. Atidarykite Vite parodytą `Local` adresą; jei prievadas `5173` užimtas, Vite gali naudoti, pavyzdžiui, `5174`.

Supabase **Authentication → Sign In / Providers → Email** skiltyje turi būti įjungtas el. pašto prisijungimo būdas. Jei norite, kad registruojantis nereikėtų patvirtinti el. pašto, išjunkite **Confirm email**. Vietinius adresus pridėkite prie Auth URL konfigūracijos, jei Supabase jų prašo.

## Patikros komandos

```powershell
npm.cmd run build
npm.cmd run lint
```

## Projekto nuorodos

- GitHub: https://github.com/RaMa-tech994/Customer-requests
- Notion projekto planas: https://app.notion.com/p/415452a5d98881528f75ed1ae784b3d8
