# Customer Requests

Web aplikacija, skirta klientų užklausoms registruoti ir administruoti.

## Projekto tikslas

Naudotojai gali prisijungti prie sistemos ir kurti konkretiems projektams skirtas pagalbos užklausas. Kiekvienas naudotojas turi matyti tik jam priklausančius duomenis. Apie svarbius įvykius siunčiami el. pašto pranešimai.

## Numatyta technologijų architektūra

- **Frontend:** React + Vite (JavaScript)
- **Autentifikacija ir duomenų bazė:** Supabase Auth, Supabase Database ir Row Level Security (RLS)
- **Versijų kontrolė:** GitHub
- **Diegimas:** Vercel
- **Automatizavimas ir el. paštas:** Supabase Database Webhook → Zapier → Gmail
- **Dokumentacija ir projekto valdymas:** Notion

## Pagrindinės funkcijos

- Naudotojo registracija ir prisijungimas.
- Projektų ir užklausų valdymas.
- Užklausos prioriteto pasirinkimas: **High** arba **Normal**.
- Prieigos prie duomenų ribojimas pagal naudotoją, naudojant Supabase RLS.
- Naujos užklausos įrašymo į duomenų bazę įvykis perduodamas Zapier.
- Aukšto prioriteto užklausos el. laiško temoje pažymimos „SKUBU“.

## Duomenų ir pranešimų srautas

1. Naudotojas veikia React aplikacijoje.
2. Aplikacija per supabase-js jungiasi prie Supabase naudodama viešą anon raktą.
3. Supabase duomenų bazėje sukūrus naują užklausos įrašą, Database Webhook perduoda įvykį Zapier.
4. Zapier patikrina įvykio tipą ir pagal prioritetą nukreipia į atitinkamą kelią.
5. Aukšto prioriteto atveju Gmail laiško tema pradedama „SKUBU: “ ir papildoma užklausos pavadinimu.

Webhook įvykį siunčia Supabase serveris. Zapier šiame sraute neturi tiesiogiai jungtis prie Supabase su duomenų bazės raktais.

## Projekto ribos

Į pradinę projekto apimtį neįtraukiama:
- mokėjimai;
- realaus laiko funkcionalumas;
- failų įkėlimas;
- Supabase Edge Functions;
- TypeScript;
- atskira mobilioji aplikacija.

## Duomenų modelio pastaba

Projekto apimties aprašyme lentelės vadinamos Projects ir Requests, o detalesniame duomenų modelio apraše naudojami pavadinimai lists ir items bei ryšio laukas list_id. Galutinius lentelių pavadinimus reikia patvirtinti prieš kuriant Supabase schemą.

## Darbo pradžia

Ši repositorija šiuo metu yra pradinė projekto dokumentacijos vieta. React + Vite aplikacijos kodas, Supabase schema ir diegimo konfigūracija bus pridėti vėlesniuose etapuose.

Kai aplikacijos kodas bus sukurtas, čia bus papildytos tikslios vietinio paleidimo, aplinkos kintamųjų ir diegimo instrukcijos.

## Projekto nuorodos

- GitHub: https://github.com/RaMa-tech994/Customer-requests
- Notion projekto planas: https://app.notion.com/p/415452a5d98881528f75ed1ae784b3d8
- Vercel: dar nesukonfigūruota
