# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What This Is

**bolgevarsel.no** — a Norwegian SaaS that sends daily sea/wave forecasts via SMS and email, tailored to coastal locations along the Norwegian coast. Built by Stå på Pinne AS.

All UI text, routes, and variable names are in Norwegian. Maintain this convention.

## Commands

```bash
npm run dev          # Local dev server at http://localhost:3000
npm run build        # Production build (ESLint and TS errors are ignored in builds — see next.config.js)
```

No test runner or linter script is configured in package.json.

## Architecture

**Next.js App Router** (TypeScript) deployed on **Vercel**. No separate backend — all server logic lives in API routes.

### Key Layers

- **Auth**: Passwordless magic link flow. `/api/auth/send-magic-link` sends a token via email (Resend), `/api/auth/verify` validates it and sets a `bv_session` cookie. No auth library — hand-rolled token table (`bv_magic_tokens`).
- **Admin auth**: Separate system using `ADMIN_SECRET` cookie checked in `src/middleware.ts`. Only protects `/admin/*` routes.
- **Payments**: Stripe Checkout with 7-day free trial. Webhook at `/api/webhook` handles `checkout.session.completed` to activate subscriptions. Stripe API is called directly via `fetch` (no Stripe SDK at runtime — see `src/lib/stripe.ts`).
- **Database**: Supabase (PostgreSQL) accessed via `@supabase/supabase-js` admin client (`src/lib/supabase.ts`). Four tables: `bv_subscribers`, `bv_locations`, `bv_recipients`, `bv_magic_tokens`.
- **Weather data**: met.no Locationforecast 2.0 (proxied server-side via `/api/varsel` for TOS compliance) + Open-Meteo Marine API (called client-side) + BarentsWatch Waveforecast API (`src/lib/barentswatch.ts`, proxied via `/api/barentswatch`). BarentsWatch requires OAuth2 client_credentials and is preferred for wave data on the Norwegian coast, with Open-Meteo as fallback.
- **SMS**: 46elks API. **Email**: Resend API.
- **Geocoding**: Nominatim (OpenStreetMap) via `/api/steder`.
- **Cron/Edge Functions**: A Supabase Edge Function (`bolgevarsel`) runs via pg_cron every 30 min (04:00-12:00 Norwegian time). It fetches weather, computes danger scores, and sends SMS/email to subscribers.

### Plan System

`src/lib/plans.ts` is the single source of truth for subscription tiers (Kyst/Familie/Pro). Plan limits (locations, recipients, SMS access) are defined here. Stripe Price IDs are hardcoded in this file.

### Danger Score Algorithm

Used in both the dashboard and the Edge Function. Scale 0-5 based on wave height and wind speed:
- Score 0: waves < 1.0m, wind < 8 m/s
- Score 4+: triggers critical SMS to ALL recipients regardless of `sms_daily` setting
- Score 5: waves > 4.0m or wind > 25 m/s (life-threatening)

The scoring logic is duplicated in `DashboardKlient.tsx` and the Supabase Edge Function.

### Styling

Inline styles and CSS Modules (`.module.css`). No Tailwind or component library. Design uses `DM Sans` (body) and `Fraunces` (headings). Color palette centered on `#0a2a3d` (dark navy), `#1a6080` (teal), `#e8f4f8` (light blue bg).

### Client Components

Heavy client components with `'use client'`:
- `DashboardKlient.tsx` — public wave checker with live data, SVG charts, danger scale
- `MinSideClient.tsx` — subscriber dashboard (locations, recipients, reports, account management)
- `LokasjonPanel.tsx` — live sea data per location with expandable detail
- `LeggTilLokasjon.tsx` — location picker with Nominatim search + Leaflet map pin
- `RapportTab.tsx` — on-demand sea report with activity-profile-specific tips

### Path Alias

`@/*` maps to `./src/*` (configured in tsconfig.json).

## External API Constraints

- **met.no**: Must set `User-Agent: Bolgevarsel/1.0 bolgevarsel.no kontakt@bolgevarsel.no`. Coordinates truncated to 4 decimals. Watch for 203 status (deprecated endpoint).
- **Nominatim**: Respect rate limits. Returns array directly, not `{steder:[]}`.

## Environment Variables

Required env vars (manage via `vercel env` or `.env.local`):
`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`, `RESEND_API_KEY`, `ELKS_USERNAME`, `ELKS_PASSWORD`, `NEXT_PUBLIC_SITE_URL`, `ADMIN_SECRET`, `BARENTSWATCH_CLIENT_ID`, `BARENTSWATCH_CLIENT_SECRET`

## Deploy

Auto-deploy via Vercel on push to `main`. No CI/CD pipeline beyond Vercel's built-in.
