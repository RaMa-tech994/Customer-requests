# Customer Requests frontend

Šio aplanko React + Vite aplikacija naudoja Supabase Auth prisijungimui ir Supabase duomenų bazę projektams bei užklausoms.

## Paleidimas

PowerShell terminale:

```powershell
npm install
Copy-Item .env.example .env.local
npm.cmd run dev
```

Prieš paleisdami, įrašykite savo Supabase URL ir publishable raktą į `.env.local`. Išsamūs Supabase, RLS ir administratoriaus vaidmens nustatymai aprašyti [pagrindiniame README](../README.md).

## Komandos

- `npm run dev` — paleidžia vietinį kūrimo serverį.
- `npm run build` — sukuria produkcinę versiją aplanke `dist`.
- `npm run lint` — patikrina kodą su Oxlint.
- `npm run preview` — peržiūri produkcinę versiją vietoje.
