# Phase 2 Activation Guide — Political Pressure Layer

This guide activates the political pressure features of We The People 39120.
All the code, database schema, and API routes are already built.
You're flipping switches, not refactoring.

---

## What Phase 2 Adds

- **Auto-ward detection** — every report is automatically assigned to a ward (and Alderman)
- **Alderman profile pages** — public scorecards with response rates
- **"Ignored" escalation** — reports get flagged after 7/14/30/60 days of no action
- **Alderman email notifications** — notified when reports in their ward hit 5 Me Toos
- **Public shame cards** — shareable images for ignored reports
- **Ward overlay on map** — colored boundaries showing each Alderman's territory

---

## Prerequisites

- Phase 1 running in production with active users
- Supabase project set up
- SendGrid account (for Alderman emails)
- Ward GeoJSON boundaries ready

---

## Step 1: Get Ward Boundaries

Download the official Natchez ward map:
```
https://natchez.ms.us/DocumentCenter/View/1290/Natchez-Ward-Map
```

Convert PDF to GeoJSON:
1. Open [Mapshaper.org](https://mapshaper.org)
2. Upload the PDF or a screenshot
3. Trace ward boundaries manually, or use QGIS for precision
4. Export as GeoJSON (WGS84 / EPSG:4326)
5. Each feature should have a `ward_number` property (1-6)

---

## Step 2: Upload Ward GeoJSON to Supabase

```sql
-- Update each ward with its GeoJSON geometry
UPDATE public.wards
SET geometry = '{"type":"Polygon","coordinates":[[[-91.42, 31.56], ...]]}' -- your GeoJSON
WHERE ward_number = 1;

-- Repeat for wards 2-6
```

Verify with:
```sql
SELECT ward_number, geometry IS NOT NULL as has_boundary
FROM public.wards
ORDER BY ward_number;
```

---

## Step 3: Add Alderman Contact Info

Research and update all 6 Aldermen:
```sql
UPDATE public.aldermen
SET
  email = 'valencia.hall@natchez.ms.us',
  phone = '601-xxx-xxxx',
  photo_url = 'https://...',
  public_profile_enabled = true
WHERE name = 'Valencia Hall';

-- Repeat for all 6 aldermen
```

---

## Step 4: Enable Auto-Ward Detection

In `src/lib/features.ts`:
```typescript
PHASE_2_POLITICAL: true,
AUTO_WARD_DETECTION: true,
```

This activates the Turf.js point-in-polygon logic in `src/lib/geo.ts`.
New reports will automatically populate `ward_id` and notify the alderman.

---

## Step 5: Set Up Escalation Cron Jobs

Create the cron route at `src/app/api/cron/escalation/route.ts`:

```typescript
// This route checks for un-actioned reports and logs escalations
// Schedule via Vercel Cron (vercel.json):
// { "crons": [{ "path": "/api/cron/escalation", "schedule": "0 9 * * *" }] }
```

Add to `vercel.json`:
```json
{
  "crons": [
    {
      "path": "/api/cron/escalation",
      "schedule": "0 9 * * *"
    }
  ]
}
```

---

## Step 6: Configure Alderman Notifications

Add to `.env.local` (and Vercel dashboard):
```
SENDGRID_API_KEY=SG.xxxxxxx
ALDERMAN_NOTIFICATION_FROM=noreply@we-the-people-39120.com
```

Enable the flag:
```typescript
ALDERMAN_NOTIFICATIONS: true,
ME_TOO_ALDERMAN_NOTIFY: true,   // Notify at 5 Me Toos
ESCALATION_EMAILS: true,         // Send 7/14/30/60 day emails
```

---

## Step 7: Enable Shame Cards (Optional)

For "Alderman [Name] hasn't fixed this in 30 days" shareable cards:
```typescript
PUBLIC_SHAME: true,
SOCIAL_SHARE_SHAME: true,
```

Generate cards using `@vercel/og` (OG Image Generation):
- Create `src/app/api/og/report/[id]/route.tsx`
- Template: photo + category + alderman name + days ignored
- Sharp, branded, shareable to Facebook/Instagram

---

## Step 8: Enable Ward Overlay on Map

```typescript
WARD_OVERLAY_MAP: true,
```

In `MapView.tsx`, this will render ward boundary polygons from `/api/v1/wards`
using React-Leaflet's `<GeoJSON>` component.
Color by Alderman performance score.

---

## Verification Checklist

- [ ] All 6 ward geometries populated in Supabase
- [ ] All 6 aldermen have email addresses
- [ ] Submit a test report — verify `ward_id` is auto-populated
- [ ] Trigger a 5 Me Too notification manually: `UPDATE reports SET me_too_count = 5 WHERE id = 'test-id'`
- [ ] Verify escalation cron fires (check `escalation_log` table)
- [ ] Verify Alderman receives email notification
- [ ] Map shows ward boundaries correctly
- [ ] Alderman profile pages render at `/aldermen/[id]`

---

## Database Views (Add in Supabase)

```sql
-- Alderman scorecard view
CREATE VIEW alderman_scorecards AS
SELECT
  a.id,
  a.name,
  a.ward_id,
  w.ward_number,
  COUNT(r.id) AS total_reports,
  COUNT(r.id) FILTER (WHERE r.status = 'resolved') AS resolved,
  COUNT(r.id) FILTER (WHERE r.status = 'ignored') AS ignored,
  ROUND(
    COUNT(r.id) FILTER (WHERE r.status = 'resolved')::DECIMAL /
    NULLIF(COUNT(r.id), 0) * 100, 1
  ) AS resolution_rate
FROM public.aldermen a
LEFT JOIN public.wards w ON w.alderman_id = a.id
LEFT JOIN public.reports r ON r.ward_id = w.id
GROUP BY a.id, a.name, a.ward_id, w.ward_number;
```

---

*Phase 2 estimated activation time: 4-8 hours once GeoJSON is ready.*
*Phase 3 (Municipal SaaS) guide: Coming when city contract is signed.*
