-- ============================================================
-- WE THE PEOPLE 39120 — INITIAL SCHEMA
-- Migration 001: All phases defined, Phase 1 tables active.
-- RULE: Additive only. Never DROP or RENAME columns.
-- ============================================================

-- Enable PostGIS for ward boundaries (Phase 2)
CREATE EXTENSION IF NOT EXISTS postgis;
-- Enable pg_cron for escalation jobs (Phase 2)
-- CREATE EXTENSION IF NOT EXISTS pg_cron; -- Uncomment when Phase 2 activates

-- ── ENUMS ─────────────────────────────────────────────────────

CREATE TYPE report_category AS ENUM (
  'graffiti', 'dumping', 'abandoned_vehicle', 'property_neglect',
  'noise', 'street_issues', 'vegetation', 'animal', 'safety_hazard', 'water_drainage'
);

CREATE TYPE report_status AS ENUM (
  'pending', 'confirmed', 'acknowledged', 'in_progress', 'resolved', 'ignored', 'closed'
);

CREATE TYPE escalation_level AS ENUM ('7day', '14day', '30day', '60day');

CREATE TYPE political_action_type AS ENUM (
  'viewed', 'acknowledged', 'assigned', 'resolved', 'ignored'
);

CREATE TYPE subscription_tier AS ENUM ('basic', 'pro', 'enterprise');

CREATE TYPE ticket_priority AS ENUM ('low', 'medium', 'high', 'critical');

-- ═══════════════════════════════════════════════════════════════
-- PHASE 1: CITIZEN INTERFACE
-- ═══════════════════════════════════════════════════════════════

-- Users (extends Supabase auth.users)
CREATE TABLE public.users (
  id           UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email        TEXT,
  phone        TEXT,
  profile_data JSONB DEFAULT '{}',
  score        INTEGER DEFAULT 0,
  badges       TEXT[] DEFAULT '{}',
  anonymous_alias TEXT,
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

-- Reports (core table)
CREATE TABLE public.reports (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID REFERENCES public.users(id) ON DELETE SET NULL,
  photo_url    TEXT,
  category     report_category NOT NULL,
  description  TEXT,
  lat          DECIMAL(10, 7) NOT NULL,
  lng          DECIMAL(10, 7) NOT NULL,
  -- Phase 2 fields (nullable until ward data is loaded)
  ward_id      UUID,   -- FK added in migration 002
  -- Status tracking
  status       report_status DEFAULT 'pending',
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  updated_at   TIMESTAMPTZ DEFAULT NOW(),
  anonymous    BOOLEAN DEFAULT TRUE,
  me_too_count INTEGER DEFAULT 0,
  view_count   INTEGER DEFAULT 0,
  is_escalated BOOLEAN DEFAULT FALSE
);

-- Me Too confirmations
CREATE TABLE public.confirmations (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  report_id  UUID NOT NULL REFERENCES public.reports(id) ON DELETE CASCADE,
  user_id    UUID REFERENCES public.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(report_id, user_id)
);

-- Comments
CREATE TABLE public.comments (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  report_id   UUID NOT NULL REFERENCES public.reports(id) ON DELETE CASCADE,
  user_id     UUID REFERENCES public.users(id) ON DELETE SET NULL,
  content     TEXT NOT NULL,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  is_official BOOLEAN DEFAULT FALSE
);

-- ═══════════════════════════════════════════════════════════════
-- PHASE 2: POLITICAL PRESSURE LAYER
-- (Tables created now, populated/activated in Phase 2)
-- ═══════════════════════════════════════════════════════════════

-- Wards with GeoJSON boundaries
CREATE TABLE public.wards (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ward_number           INTEGER UNIQUE NOT NULL CHECK (ward_number BETWEEN 1 AND 6),
  alderman_id           UUID,  -- FK added after aldermen table
  geometry              JSONB,  -- GeoJSON Polygon
  population_2020       INTEGER,
  boundaries_description TEXT
);

-- Aldermen
CREATE TABLE public.aldermen (
  id                     UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name                   TEXT NOT NULL,
  ward_id                UUID REFERENCES public.wards(id) ON DELETE SET NULL,
  email                  TEXT,
  phone                  TEXT,
  photo_url              TEXT,
  term_start             DATE,
  term_end               DATE,
  party_affiliation      TEXT,
  -- Performance metrics (auto-calculated in Phase 2)
  response_rate          DECIMAL(5,2) DEFAULT 0,
  avg_response_time_days DECIMAL(6,2) DEFAULT 0,
  total_resolved         INTEGER DEFAULT 0,
  total_ignored          INTEGER DEFAULT 0,
  public_profile_enabled BOOLEAN DEFAULT FALSE,
  social_media_handles   JSONB DEFAULT '{}',
  committee_assignments  TEXT[] DEFAULT '{}'
);

-- Add FK from wards to aldermen (after both tables exist)
ALTER TABLE public.wards ADD CONSTRAINT fk_ward_alderman
  FOREIGN KEY (alderman_id) REFERENCES public.aldermen(id) ON DELETE SET NULL;

-- Add FK from reports to wards (Phase 2 ready)
ALTER TABLE public.reports ADD CONSTRAINT fk_report_ward
  FOREIGN KEY (ward_id) REFERENCES public.wards(id) ON DELETE SET NULL;

-- Political actions log
CREATE TABLE public.political_actions (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  report_id    UUID NOT NULL REFERENCES public.reports(id) ON DELETE CASCADE,
  alderman_id  UUID NOT NULL REFERENCES public.aldermen(id) ON DELETE CASCADE,
  action_type  political_action_type NOT NULL,
  action_date  TIMESTAMPTZ DEFAULT NOW(),
  notes        TEXT,
  is_public    BOOLEAN DEFAULT TRUE
);

-- Escalation log (Phase 2 cron jobs will populate this)
CREATE TABLE public.escalation_log (
  id                   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  report_id            UUID NOT NULL REFERENCES public.reports(id) ON DELETE CASCADE,
  triggered_at         TIMESTAMPTZ DEFAULT NOW(),
  level                escalation_level NOT NULL,
  notification_sent_to TEXT[] DEFAULT '{}',
  auto_posted_social   BOOLEAN DEFAULT FALSE,
  is_resolved          BOOLEAN DEFAULT FALSE
);

-- ═══════════════════════════════════════════════════════════════
-- PHASE 3: MUNICIPAL SAAS
-- ═══════════════════════════════════════════════════════════════

CREATE TABLE public.city_departments (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name              TEXT NOT NULL,
  category_match    report_category[] DEFAULT '{}',
  head_name         TEXT,
  email             TEXT,
  auto_assign_rules JSONB DEFAULT '{}'
);

CREATE TABLE public.internal_tickets (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  report_id      UUID NOT NULL REFERENCES public.reports(id) ON DELETE CASCADE,
  department_id  UUID REFERENCES public.city_departments(id) ON DELETE SET NULL,
  assigned_to    TEXT,
  priority       ticket_priority DEFAULT 'medium',
  internal_notes TEXT,
  cost_estimate  DECIMAL(10,2),
  scheduled_date DATE,
  completed_at   TIMESTAMPTZ
);

-- ═══════════════════════════════════════════════════════════════
-- PHASE 4: POLITICIAN PRO
-- ═══════════════════════════════════════════════════════════════

CREATE TABLE public.politician_subscriptions (
  id                   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  alderman_id          UUID NOT NULL REFERENCES public.aldermen(id) ON DELETE CASCADE,
  subscription_tier    subscription_tier DEFAULT 'basic',
  payment_status       TEXT DEFAULT 'active',
  features_enabled     TEXT[] DEFAULT '{}',
  analytics_access_level TEXT DEFAULT 'basic'
);

CREATE TABLE public.campaign_promises (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  alderman_id  UUID NOT NULL REFERENCES public.aldermen(id) ON DELETE CASCADE,
  promise_text TEXT NOT NULL,
  category     TEXT NOT NULL,
  deadline     DATE,
  status       TEXT DEFAULT 'active' CHECK (status IN ('active','fulfilled','broken','expired')),
  evidence_url TEXT,
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.constituent_messages (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  from_user_id    UUID REFERENCES public.users(id) ON DELETE SET NULL,
  to_alderman_id  UUID NOT NULL REFERENCES public.aldermen(id) ON DELETE CASCADE,
  report_id       UUID REFERENCES public.reports(id) ON DELETE SET NULL,
  message         TEXT NOT NULL,
  is_public       BOOLEAN DEFAULT FALSE,
  sentiment_score DECIMAL(3,2),  -- -1.0 to 1.0
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ═══════════════════════════════════════════════════════════════
-- INDEXES (Performance)
-- ═══════════════════════════════════════════════════════════════

CREATE INDEX idx_reports_lat_lng       ON public.reports(lat, lng);
CREATE INDEX idx_reports_ward_id       ON public.reports(ward_id);
CREATE INDEX idx_reports_status        ON public.reports(status);
CREATE INDEX idx_reports_category      ON public.reports(category);
CREATE INDEX idx_reports_created_at    ON public.reports(created_at DESC);
CREATE INDEX idx_reports_me_too_count  ON public.reports(me_too_count DESC);
CREATE INDEX idx_confirmations_report  ON public.confirmations(report_id);
CREATE INDEX idx_comments_report       ON public.comments(report_id);
CREATE INDEX idx_political_actions_report ON public.political_actions(report_id);
CREATE INDEX idx_escalation_log_report ON public.escalation_log(report_id);

-- ═══════════════════════════════════════════════════════════════
-- TRIGGERS
-- ═══════════════════════════════════════════════════════════════

-- Auto-update updated_at on reports
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER reports_updated_at
  BEFORE UPDATE ON public.reports
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Auto-increment me_too_count when confirmation is inserted
CREATE OR REPLACE FUNCTION increment_me_too()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.reports
  SET me_too_count = me_too_count + 1
  WHERE id = NEW.report_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_confirmation_insert
  AFTER INSERT ON public.confirmations
  FOR EACH ROW EXECUTE FUNCTION increment_me_too();

-- ═══════════════════════════════════════════════════════════════
-- ROW LEVEL SECURITY (RLS)
-- ═══════════════════════════════════════════════════════════════

-- Reports: public read, authenticated write
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can read reports"     ON public.reports FOR SELECT USING (true);
CREATE POLICY "Authenticated can insert"    ON public.reports FOR INSERT WITH CHECK (auth.uid() IS NOT NULL OR anonymous = true);
CREATE POLICY "Owner can update own report" ON public.reports FOR UPDATE USING (auth.uid() = user_id);

-- Users: own data only
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users read own profile"   ON public.users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users update own profile" ON public.users FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users insert own profile" ON public.users FOR INSERT WITH CHECK (auth.uid() = id);

-- Confirmations: public read, one per user per report
ALTER TABLE public.confirmations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read confirmations"       ON public.confirmations FOR SELECT USING (true);
CREATE POLICY "Authenticated insert once"       ON public.confirmations FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Comments: public read, authenticated write
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read comments"  ON public.comments FOR SELECT USING (true);
CREATE POLICY "Auth users can comment" ON public.comments FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Wards & Aldermen: public read only
ALTER TABLE public.wards ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read wards" ON public.wards FOR SELECT USING (true);

ALTER TABLE public.aldermen ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read aldermen" ON public.aldermen FOR SELECT USING (true);

-- Political actions: public read only
ALTER TABLE public.political_actions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read actions" ON public.political_actions FOR SELECT USING (is_public = true);
