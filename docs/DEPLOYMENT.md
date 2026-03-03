# We The People 39120 — Deployment Guide

Production stack: **Vercel** (frontend) + **Supabase** (database) + **Hostinger VPS** (cron jobs)
Phase 1–2 cost: **$0/month**

---

## Overview

```
Internet
    │
    ▼
[Vercel CDN]           Next.js App Router + API Routes
    │                  we-the-people-39120.vercel.app (or custom domain)
    ▼
[Supabase]             PostgreSQL + PostGIS + Auth + Storage
    │
    ▼
[Hostinger VPS]        Cron jobs (Phase 2) — NOT primary hosting
                       Node.js + PM2 process manager
```

---

## STEP 1 — Supabase Setup

### 1.1 Create Project

1. Go to [supabase.com](https://supabase.com) → New Project
2. Name: `we-the-people-39120`
3. Region: `US East (N. Virginia)` — closest to Natchez, MS
4. Password: Save securely (you'll need it for VPS backups)

### 1.2 Run Schema Migration

1. Open **SQL Editor** in Supabase dashboard
2. Paste and run the entire contents of:
   ```
   supabase/migrations/001_initial_schema.sql
   ```
3. Verify success — you should see all tables created:
   ```sql
   SELECT table_name FROM information_schema.tables
   WHERE table_schema = 'public'
   ORDER BY table_name;
   ```
   Expected: `aldermen`, `campaign_promises`, `city_departments`, `comments`,
   `confirmations`, `constituent_messages`, `escalation_log`, `internal_tickets`,
   `political_actions`, `politician_subscriptions`, `reports`, `users`, `wards`

### 1.3 Create Storage Bucket

1. Supabase dashboard → **Storage** → **New Bucket**
2. Settings:
   ```
   Name:              report-photos
   Public:            ✅ Yes
   File size limit:   10485760  (10MB)
   ```
3. Add storage policy — in SQL Editor:
   ```sql
   CREATE POLICY "Anyone can upload report photos"
   ON storage.objects FOR INSERT
   WITH CHECK (bucket_id = 'report-photos');

   CREATE POLICY "Public can view report photos"
   ON storage.objects FOR SELECT
   USING (bucket_id = 'report-photos');
   ```

### 1.4 Seed Initial Data

Run in SQL Editor (in this order):

```sql
-- 1. Ward structure
-- Paste contents of: supabase/seed/aldermen.sql

-- 2. Ward boundaries (Phase 2 — optional for Phase 1)
-- Paste contents of: scripts/seed-wards.sql
-- (Only works once you have the real GeoJSON from Natchez city)
```

### 1.5 Collect Your Keys

Go to **Project Settings → API**:

```
Project URL:      https://xxxxxxxxxxxx.supabase.co
Anon Key:         eyJhbGciO... (safe for browser)
Service Role Key: eyJhbGciO... (NEVER expose to browser)
```

---

## STEP 2 — Vercel Deployment

### 2.1 Push to GitHub

```bash
cd we-the-people-39120

# Initialize git (if not done)
git init
git add .
git commit -m "feat: initial We The People 39120 — Phase 1"

# Create repo on GitHub then:
git remote add origin https://github.com/KlickifyAgency/we-the-people-39120.git
git push -u origin main
```

### 2.2 Import to Vercel

1. Go to [vercel.com](https://vercel.com) → **Add New Project**
2. Import from GitHub: `KlickifyAgency/we-the-people-39120`
3. Framework: **Next.js** (auto-detected)
4. Root Directory: leave blank (project root)
5. Do NOT deploy yet — add env vars first

### 2.3 Add Environment Variables

In Vercel project → **Settings → Environment Variables**:

| Variable | Value | Environments |
|----------|-------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://xxx.supabase.co` | All |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJhbGciO...` | All |
| `SUPABASE_SERVICE_ROLE_KEY` | `eyJhbGciO...` | Production, Preview |
| `NEXT_PUBLIC_APP_URL` | `https://we-the-people-39120.vercel.app` | Production |

> **Security:** `SUPABASE_SERVICE_ROLE_KEY` has full database access. Never prefix with `NEXT_PUBLIC_`.

### 2.4 Deploy

```bash
# From your local terminal:
npm run deploy
# or in Vercel dashboard: click Deploy
```

### 2.5 Add Custom Domain (Optional)

1. Vercel → **Settings → Domains**
2. Add: `we-the-people-39120.com` or `we-the-people.natchez.ms.us`
3. Update DNS at your registrar (CNAME → `cname.vercel-dns.com`)
4. Update `NEXT_PUBLIC_APP_URL` env var to match

### 2.6 Verify Deployment

Check these URLs:
```
https://your-domain.vercel.app/           → Map feed loads
https://your-domain.vercel.app/api/v1/reports → Returns JSON array
https://your-domain.vercel.app/report    → Report form opens
```

---

## STEP 3 — Hostinger VPS Setup (Phase 2 Cron Jobs)

> **Phase 1:** Skip this step. The VPS is only needed for Phase 2 escalation automation.

### 3.1 Connect to VPS

```bash
ssh root@your-hostinger-vps-ip
```

### 3.2 Install Node.js 18+

```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt-get install -y nodejs
node --version  # Should show v18.x.x
npm install -g pm2
```

### 3.3 Create Escalation Script

```bash
mkdir -p /opt/we-the-people-39120
cat > /opt/we-the-people-39120/escalation-check.js << 'EOF'
const https = require('https');

const APP_URL = process.env.BLUFFWATCH_URL;
const CRON_SECRET = process.env.CRON_SECRET;

const options = {
  hostname: new URL(APP_URL).hostname,
  path: '/api/cron/escalation',
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${CRON_SECRET}`
  }
};

const req = https.request(options, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    console.log(`[${new Date().toISOString()}] Escalation check: ${res.statusCode}`, data);
  });
});

req.on('error', (e) => {
  console.error(`[${new Date().toISOString()}] Escalation error:`, e.message);
});

req.end();
EOF
```

### 3.4 Create Environment File

```bash
cat > /opt/we-the-people-39120/.env << 'EOF'
BLUFFWATCH_URL=https://your-domain.vercel.app
CRON_SECRET=generate-a-secure-random-string-here
EOF
chmod 600 /opt/we-the-people-39120/.env
```

### 3.5 Schedule Daily Cron (9am Central Time)

```bash
crontab -e

# Add this line (9am CST = 15:00 UTC):
0 15 * * * /usr/bin/node /opt/we-the-people-39120/escalation-check.js >> /var/log/we-the-people-39120-escalation.log 2>&1
```

### 3.6 Set Up Daily Database Backup

```bash
apt-get install -y postgresql-client

cat > /opt/we-the-people-39120/backup.sh << 'EOF'
#!/bin/bash
DATE=$(date +%Y%m%d)
BACKUP_DIR="/opt/we-the-people-39120/backups"
mkdir -p "$BACKUP_DIR"

# Supabase connection string from project settings
pg_dump "postgresql://postgres:YOUR_DB_PASSWORD@db.xxx.supabase.co:5432/postgres" \
  --no-owner \
  --compress=9 \
  > "$BACKUP_DIR/we-the-people-39120-$DATE.sql.gz"

# Keep only last 30 days
find "$BACKUP_DIR" -name "*.sql.gz" -mtime +30 -delete

echo "[$(date)] Backup completed: we-the-people-39120-$DATE.sql.gz"
EOF

chmod +x /opt/we-the-people-39120/backup.sh

# Schedule daily at 2am
echo "0 2 * * * /opt/we-the-people-39120/backup.sh >> /var/log/we-the-people-39120-backup.log 2>&1" | crontab -
```

---

## STEP 4 — Post-Deployment Verification

### Functional Checklist

```
□ Homepage loads map with Natchez center
□ "+" FAB opens report wizard
□ Camera capture opens device camera on mobile
□ Category picker shows all 10 categories
□ GPS location detects correctly
□ Report submits and appears in feed
□ Me Too button increments count
□ Filter panel works (category, status, time)
□ List/Map toggle works
□ Emergency banner shows on all pages
□ App installs as PWA on iPhone (Share → Add to Home Screen)
□ App installs as PWA on Android (Chrome → Add to Home Screen)
```

### Performance Checklist

```
□ Lighthouse Mobile score ≥ 90
□ First Contentful Paint < 2s on mobile
□ Map loads without errors
□ No console errors in production
```

### Lighthouse Test

```bash
# Install Lighthouse CLI
npm install -g lighthouse

# Run audit
lighthouse https://your-domain.vercel.app \
  --preset=perf \
  --output=html \
  --output-path=lighthouse-report.html
```

---

## Environment Variables Reference

| Variable | Required | Used In | Description |
|----------|----------|---------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | ✅ | Client + Server | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ✅ | Client + Server | Public anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | Phase 2 | Server only | Full DB access (cron, admin) |
| `NEXT_PUBLIC_APP_URL` | ✅ | Client | Production URL |
| `SENDGRID_API_KEY` | Phase 2 | Server only | Alderman email notifications |
| `CRON_SECRET` | Phase 2 | Server only | Protects /api/cron/* routes |
| `STRIPE_SECRET_KEY` | Phase 4 | Server only | Politician Pro subscriptions |

---

## Rollback Procedure

```bash
# Vercel — roll back to previous deployment
vercel rollback

# Or in Vercel dashboard:
# Deployments → find previous → "..." → Promote to Production
```

---

## Phase 2 Upgrade

When ready to activate political pressure features:

1. Add Alderman emails in Supabase `aldermen` table
2. Add `SENDGRID_API_KEY` to Vercel env vars
3. Generate and add `CRON_SECRET` to both Vercel and VPS `.env`
4. Flip flags in `src/lib/features.ts`
5. Deploy: `npm run deploy`
6. Activate VPS cron job (Step 3.5)

See `docs/PHASE_2_ACTIVATION.md` for the complete guide.

---

*We The People 39120 — Built by KlickifyAgency.com*
