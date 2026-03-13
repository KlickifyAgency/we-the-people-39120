# We The People 39120
### "Y'all see it, we fix it" — The People's Court of Natchez

A mobile-first civic reporting platform for Natchez, Mississippi (ZIP 39120).
Built with LEGO-modular architecture: flip a feature flag to unlock the next phase.

Powered by [KlickifyAgency.com](https://klickifyagency.com) — Digital Solutions for Mississippi

---

## Phase Roadmap

| Phase | Status | Description |
|-------|--------|-------------|
| 1 — Citizen Interface | **ACTIVE** | Public reporting, map feed, Me Too |
| 2 — Political Pressure | READY (disabled) | Ward detection, Alderman scorecards, shame system |
| 3 — Municipal SaaS | PLANNED | City dashboard, internal ticketing |
| 4 — Politician Pro | PLANNED | Campaign tools, promises tracker, analytics |
| 5 — White Label | FUTURE | Other Mississippi cities |

---

## Quick Start

### 1. Prerequisites
- Node.js 18+
- npm
- Supabase account (free tier works)

### 2. Install
```bash
npm install
```

### 3. Set up environment
```bash
cp .env.local.example .env.local
# Fill in your Supabase URL and anon key
```

### 4. Set up Supabase

**a. Create project** at [supabase.com](https://supabase.com)

**b. Run migration — in Supabase SQL Editor:**
```
supabase/migrations/001_initial_schema.sql
```

**c. Create storage bucket:**
```
Bucket name: report-photos
Public: true
File size limit: 10MB
Allowed MIME types: image/jpeg, image/png, image/webp, image/heic
```

**d. Seed Aldermen (optional for Phase 1):**
```
supabase/seed/aldermen.sql
```

### 5. Run
```bash
npm run dev
# Open http://localhost:3000
```

---

## Project Structure

```
src/
├── app/
│   ├── page.tsx               Map feed (default / home)
│   ├── report/page.tsx        Camera-first report form
│   ├── feed/page.tsx          List view
│   ├── profile/page.tsx       User profile
│   ├── (political)/           Phase 2 — Political layer (ready)
│   ├── (municipal)/           Phase 3 — City admin (planned)
│   ├── (campaign)/            Phase 4 — Politician Pro (planned)
│   └── api/v1/
│       ├── reports/           GET (feed) + POST (submit)
│       ├── reports/[id]/      GET single report
│       ├── reports/[id]/metoo POST Me Too
│       └── wards/             GET ward list (Phase 2 data)
├── components/
│   ├── citizen/               CameraCapture, CategoryPicker, ReportForm,
│   │                          MapView, PublicFeed, ReportCard, MeTooButton
│   ├── layout/                BottomNav, Header, FloatingActionButton
│   └── shared/                StatusBadge, EmergencyBanner
├── hooks/                     useReports, useLocation, useMeToo, useDraftReport
└── lib/
    ├── features.ts            FEATURE FLAGS — all phase toggles
    ├── types.ts               TypeScript types (all 5 phases)
    ├── constants.ts           Brand, categories, status config
    ├── supabase.ts            Supabase client
    ├── geo.ts                 Ward point-in-polygon (Turf.js)
    └── utils.ts               timeAgo, generateAnonymousAlias, cn()
```

---

## Feature Flags

All flags in `src/lib/features.ts`. Never delete — only set to `true`.

```typescript
// Activate Phase 2 (Political Pressure):
PHASE_2_POLITICAL: true,
AUTO_WARD_DETECTION: true,      // Requires ward GeoJSON in Supabase
ALDERMAN_SCORECARDS: true,
PUBLIC_SHAME: true,
ALDERMAN_NOTIFICATIONS: true,
ME_TOO_ALDERMAN_NOTIFY: true,   // Notify alderman at 5 Me Toos

// Activate Phase 3 (Municipal SaaS):
PHASE_3_MUNICIPAL: true,
MUNICIPAL_DASHBOARD: true,
INTERNAL_TICKETING: true,
```

---

## Tech Stack

| Layer | Tech |
|-------|------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript strict |
| Styling | Tailwind CSS |
| Animations | Framer Motion |
| Icons | Lucide React |
| Database | Supabase (PostgreSQL + PostGIS) |
| Auth | Supabase Auth |
| Storage | Supabase Storage |
| Maps | React-Leaflet + OpenStreetMap |
| Geo | Turf.js (point-in-polygon) |
| Data | TanStack Query |
| Hosting | Vercel |

---

## Natchez Context

- **Government:** Mayor Dan Gibson + 6 Aldermen
- **Meetings:** 2nd and 4th Tuesdays monthly (public)
- **Population:** ~14,500

| Ward | Alderman | Status |
|------|----------|--------|
| 1 | Valencia Hall | Confirmed (reelected 2024) |
| 2 | TBD | Research needed |
| 3 | TBD | Research needed |
| 4 | TBD | Research needed |
| 5 | Ben Davis | Confirmed |
| 6 | TBD | Research needed |

---

## Phase 2 Activation — Step by Step

1. **Get ward boundaries**
   - Download from: `natchez.ms.us/DocumentCenter/View/1290`
   - Convert PDF → GeoJSON using [Mapshaper](https://mapshaper.org) or QGIS
   - Upload GeoJSON to `wards.geometry` column in Supabase

2. **Add Alderman contacts**
   - Update `aldermen` table: email, phone, photo_url
   - Set `public_profile_enabled = true` for each

3. **Flip feature flags** in `src/lib/features.ts`
   ```typescript
   PHASE_2_POLITICAL: true,
   AUTO_WARD_DETECTION: true,
   ALDERMAN_NOTIFICATIONS: true,
   ```

4. **Set up escalation cron** (Supabase pg_cron or Vercel Cron)
   - Check reports with no action at: 7d, 14d, 30d, 60d
   - Update `escalation_log` table
   - Enable `ESCALATION_EMAILS` flag when emails are ready

5. **Add SendGrid key** to environment:
   ```
   SENDGRID_API_KEY=your-key
   ```

---

## Production Stack

| Layer | Platform | Plan | Cost |
|-------|----------|------|------|
| Frontend + API | **Vercel** | Hobby (Free) | $0 |
| Database + Auth + Storage | **Supabase** | Free Tier | $0 |
| Cron Jobs + Backups + Email | **Hostinger VPS KVM 2** | Existing | $0 extra |

**Phase 1–2 total: $0/month** — Full guide in `docs/DEPLOYMENT.md`

### Why This Stack
- **Vercel** — Next.js App Router needs Vercel for Server Components + Edge Functions
- **Supabase** — PostGIS for ward boundary detection; relational data for political layer
- **Hostinger VPS** — Phase 2 cron escalation jobs, daily backups, Alderman email notifications

### Cost Projection

| Stage | Users | Cost/mo | Revenue/mo |
|-------|-------|---------|------------|
| Phase 1–2 | 0–500 | $0 | $0 |
| Phase 3–4 | 500–5,000 | $20–45 | $1,400–3,500 |
| Phase 5 | 5,000+ | $100–200 | $5,000+ |

## Deployment

```bash
npm run deploy     # Build + push to Vercel production
```

Required env vars in Vercel dashboard:
```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
```

Full step-by-step: `docs/DEPLOYMENT.md`

---

## Brand

| Element | Value |
|---------|-------|
| Name | We The People 39120 |
| Tagline | "Y'all see it, we fix it" |
| Mississippi Blue | `#1e3a8a` — primary |
| Natchez Gold | `#d97706` — accent |
| Kudzu Green | `#16a34a` — resolved |
| Red Dirt | `#dc2626` — ignored/urgent |

---

## Monetization (Future Phases)

1. **Municipal SaaS** — $500–2,000/mo to City of Natchez
2. **Politician Pro** — $200–500/mo per Alderman
3. **White Label** — Setup + monthly for other MS cities

---

*Built by [KlickifyAgency.com](https://klickifyagency.com) — Digital Solutions for Mississippi*
*Want We The People in your city? hello@klickifyagency.com*
