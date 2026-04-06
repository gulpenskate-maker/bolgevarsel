# bølgevarsel.no

Daglig sjøvarsel på SMS og e-post — skreddersydd for kystlokasjoner langs norskekysten.

---

## Stack

| Lag | Teknologi |
|---|---|
| Frontend | Next.js 14 (App Router), TypeScript, React |
| Backend | Next.js API Routes (serverless) |
| Database | Supabase (PostgreSQL) |
| Auth | Magic link via e-post (ingen passord) |
| Betaling | Stripe Checkout + Webhooks |
| SMS | 46elks |
| E-post | Resend |
| Værvarsler | met.no Locationforecast 2.0 + Open-Meteo Marine API |
| Geocoding | Nominatim (OpenStreetMap) |
| Kart | Leaflet.js |
| Cron | Supabase pg_cron + Edge Functions |
| Hosting | Vercel |

---

## Prosjektstruktur

```
src/
├── app/
│   ├── api/
│   │   ├── auth/
│   │   │   ├── send-magic-link/   # Sender innloggingslenke på e-post
│   │   │   ├── verify/            # Validerer token, setter cookie
│   │   │   └── logout/            # Sletter session-cookie
│   │   ├── create-checkout/       # Oppretter Stripe Checkout-session
│   │   ├── webhook/               # Stripe webhook (betaling → aktivering)
│   │   ├── varsel/                # Proxy til met.no (TOS-compliant)
│   │   ├── steder/                # Geocoding via Nominatim
│   │   ├── min-side/
│   │   │   ├── route.ts           # Hent abonnent + lokasjoner + mottakere
│   │   │   ├── session/           # Sjekk innlogget status via cookie
│   │   │   ├── location/          # Legg til lokasjon
│   │   │   ├── location/delete/   # Slett lokasjon
│   │   │   ├── recipient/         # Legg til mottaker
│   │   │   ├── recipient/update/  # Oppdater mottaker (sms_daily, navn, osv.)
│   │   │   ├── recipient/delete/  # Slett mottaker
│   │   │   ├── import-csv/        # Masseimport av mottakere fra CSV
│   │   │   ├── rapport/           # On-demand sjørapport (GET)
│   │   │   ├── rapport-email/     # Send rapport til e-post (POST)
│   │   │   ├── send-time/         # Oppdater leveringstidspunkt
│   │   │   ├── frys/              # Frys/reaktiver abonnement
│   │   │   └── slett-konto/       # Slett konto + kanseller Stripe
│   │   ├── admin/                 # Admin-panel (krever ADMIN_SECRET cookie)
│   │   └── camera-proxy/          # Proxy for sjøkamera
│   ├── min-side/                  # Dashboard (tabs: Lokasjoner/Mottakere/Rapport/Konto)
│   ├── registrer/                 # Registreringsskjema
│   ├── varsel/                    # Offentlig bølgevarsel-sjekker
│   ├── hjelp/                     # Hjelpesenter
│   └── (landing, personvern, osv.)
├── components/
│   ├── Nav.tsx                    # Navigasjon med SVG-logo
│   ├── Hero.tsx                   # Landingside hero med live sjødata
│   ├── LokasjonPanel.tsx          # Live sjødata per lokasjon (klikk for detaljer)
│   ├── LeggTilLokasjon.tsx        # Modal: søk etter sted ELLER plasser pin på kart
│   ├── RapportTab.tsx             # On-demand sjørapport med profilspesifikke tips
│   ├── Pricing.tsx
│   ├── Footer.tsx
│   └── ...
└── lib/
    ├── supabase.ts                # Supabase admin-klient
    ├── stripe.ts                  # Stripe-hjelper
    └── plans.ts                   # Plandefinisjoner (kyst/familie/pro)
```

---

## Supabase-tabeller

```sql
bv_subscribers     -- Abonnenter (email, plan, status, stripe_ids, send_time)
bv_locations       -- Kystlokasjoner tilknyttet abonnent (name, lat, lon)
bv_recipients      -- Mottakere av varsler (phone, email, sms_daily, sms_enabled, profile, send_time)
bv_magic_tokens    -- Innloggingstokens (brukes en gang, utløper etter 1 time)
```

### Viktige kolonner på bv_recipients

| Kolonne | Type | Default | Beskrivelse |
|---|---|---|---|
| `sms_enabled` | boolean | true | Alltid true — kritisk farevarsel sendes alltid |
| `sms_daily` | boolean | false | Daglig SMS-rapport (av som standard, kostnad for oss) |
| `email` | text | null | E-post for detaljert HTML-rapport |
| `send_time` | text | null | Overstyrer abonnentens send_time (f.eks. "06:00") |
| `profile` | text | null | Aktivitetsprofil (surfer/seiler/fisker/kajakk/osv.) |

---

## SMS-logikk

- **Kritisk farevarsel** (score ≥ 4): Sendes alltid til alle aktive mottakere, uansett `sms_daily`
- **Daglig rapport**: Sendes kun til mottakere der `sms_daily = true`
- Default for nye mottakere: `sms_daily = false` (brukeren skrur på selv)

---

## Aktivitetsprofiler

Tilgjengelige profiler med skreddersydd vurdering:
`surfer` · `kitesurfer` · `windsurfer` · `seiler` · `fisker` · `familie` · `baatforer` · `kajakk` · `fridykker`

Profilen påvirker:
- Score-algoritmen (hva som er "bra" varierer per aktivitet)
- SMS-teksten
- E-postrapporten (timesvarsel, tips, utstyrsanbefaling)
- Rapport-taben på Min side

---

## met.no TOS-compliance

- Alle kall til `api.met.no` går via `/api/varsel` (server-side proxy)
- `User-Agent: Bolgevarsel/1.0 bolgevarsel.no kontakt@bolgevarsel.no` settes alltid
- Koordinater trunceres til 4 desimaler
- 203-status logges (deprecated endpoint-advarsel)
- Open-Meteo kalles direkte fra klient (tillatt per deres vilkår)

---

## Edge Function: `bolgevarsel`

Kjøres via pg_cron hvert halvtime (UTC `0,30 2-10 * * *` = 04:00–12:00 norsk tid).

**Flyt:**
1. Beregn norsk tid-slot
2. Hent alle aktive abonnenter med lokasjoner og mottakere
3. Filtrer mottakere for dette slot
4. Hent vær per lokasjon (cache per koordinat)
5. Send SMS til mottakere (`sms_daily=true` ELLER kritisk)
6. Send e-post til abonnent (daglig)
7. Send e-post til mottakere med e-postadresse

**Versjon:** v19

---

## Planer

| Plan | Pris | Stripe Price ID |
|---|---|---|
| Kyst | 49 kr/mnd | `price_...` (se `.env`) |
| Familie | 179 kr/mnd | `price_...` |
| Pro | 299 kr/mnd | `price_...` |

---

## Miljøvariabler

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Stripe
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=

# E-post (Resend)
RESEND_API_KEY=

# SMS (46elks)
ELKS_USERNAME=
ELKS_PASSWORD=

# App
NEXT_PUBLIC_SITE_URL=https://bolgevarsel.no
ADMIN_SECRET=  # For admin-panel
```

---

## Logo og assets

| Fil | Bruk |
|---|---|
| `public/logo.svg` | Horisontal logo (lys bakgrunn) |
| `public/logo-dark.svg` | Horisontal logo (mørk bakgrunn) |
| `public/favicon.svg` | Favicon (bølgeikon i mørk boks) |

Logostil: SVG-inline bølgesymbol + **bølgevarsel**<span style="color:#1a6080">.no</span>

---

## TODO / Pending

- [ ] Stripe webhook konfigurert i Vercel (STRIPE_WEBHOOK_SECRET)
- [ ] Lara AI: Stripe webhook + quota-system + verifiser bilderedigering
- [ ] Seats/oppgradering for eksisterende abonnenter
- [ ] Nominatim finner ikke alle lokale stedsnavn (workaround: pin på kart)

---

## Utvikling

```bash
npm run dev        # Start lokalt på http://localhost:3000
npm run build      # Bygg for produksjon
npm run lint       # ESLint-sjekk
```

Deploy skjer automatisk via Vercel ved push til `main`.

---

*Bygget av Stå på Pinne AS · hei@bolgevarsel.no*
