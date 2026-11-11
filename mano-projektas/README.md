Customer Requests

Web aplikacija, skirta klientų užklausoms registruoti ir administruoti.
Projekto tikslas

Naudotojai gali prisijungti prie sistemos ir kurti konkretiems projektams skirtas pagalbos užklausas. Kiekvienas naudotojas turi matyti tik jam priklausančius duomenis. Apie svarbius įvykius siunčiami el. pašto pranešimai.
Numatyta technologijų architektūra

    Frontend: React + Vite (JavaScript)
    Autentifikacija ir duomenų bazė: Supabase Auth, Supabase Database ir Row Level Security (RLS)
    Versijų kontrolė: GitHub
    Diegimas: Vercel
    Automatizavimas ir el. paštas: Supabase Database Webhook → Zapier → Gmail
    Dokumentacija ir projekto valdymas: Notion

Pagrindinės funkcijos

    Naudotojo registracija ir prisijungimas.
    Projektų ir užklausų valdymas.
    Užklausos prioriteto pasirinkimas: High arba Normal.
    Prieigos prie duomenų ribojimas pagal naudotoją, naudojant Supabase RLS.
    Naujos užklausos įrašymo į duomenų bazę įvykis perduodamas Zapier.
    Aukšto prioriteto užklausos el. laiško temoje pažymimos „SKUBU“.

Duomenų ir pranešimų srautas

    Naudotojas veikia React aplikacijoje.
    Aplikacija per supabase-js jungiasi prie Supabase naudodama viešą anon raktą.
    Supabase duomenų bazėje sukūrus naują užklausos įrašą, Database Webhook perduoda įvykį Zapier.
    Zapier patikrina įvykio tipą ir pagal prioritetą nukreipia į atitinkamą kelią.
    Aukšto prioriteto atveju Gmail laiško tema pradedama „SKUBU: “ ir papildoma užklausos pavadinimu.

Webhook įvykį siunčia Supabase serveris. Zapier šiame sraute neturi tiesiogiai jungtis prie Supabase su duomenų bazės raktais.

# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and Oxlint's TypeScript related rules in your project.
