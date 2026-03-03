// ============================================================
// WE THE PEOPLE 39120 — GLOBAL TYPES
// Schema covers all 5 phases. Phase 1 fields are required;
// Phase 2+ fields are nullable until their phase activates.
// ============================================================

export type ReportCategory =
  | 'graffiti'
  | 'dumping'
  | 'abandoned_vehicle'
  | 'property_neglect'
  | 'noise'
  | 'street_issues'
  | 'vegetation'
  | 'animal'
  | 'safety_hazard'
  | 'water_drainage'
  | 'public_safety';

export type ReportStatus =
  | 'pending'       // Submitted, awaiting community confirmation
  | 'confirmed'     // Community confirmed via Me Too
  | 'acknowledged'  // Alderman/City acknowledged
  | 'in_progress'   // Being actively worked on
  | 'resolved'      // Fixed — Kudzu Green
  | 'ignored'       // Passed threshold with no action — Red Dirt
  | 'closed'
  | 'overdue';       // Closed for other reasons

export type EscalationLevel = '7day' | '14day' | '30day' | '60day';

export type PoliticalActionType =
  | 'viewed'
  | 'acknowledged'
  | 'assigned'
  | 'resolved'
  | 'ignored';

// ── PHASE 1 TYPES ─────────────────────────────────────────────

export interface Report {
  id: string;
  user_id: string | null;
  photo_url: string | null;
  category: ReportCategory;
  description: string | null;
  lat: number;
  lng: number;
  ward_id: string | null;       // Phase 2: auto-populated
  status: ReportStatus;
  created_at: string;
  updated_at: string;
  anonymous: boolean;
  me_too_count: number;
  view_count: number;
  is_escalated: boolean;
}

export interface UserProfile {
  id: string;
  email: string | null;
  phone: string | null;
  profile_data: Record<string, unknown> | null;
  score: number;
  badges: string[];
  anonymous_alias: string | null;
  created_at: string;
}

export interface Confirmation {
  id: string;
  report_id: string;
  user_id: string;
  created_at: string;
}

export interface Comment {
  id: string;
  report_id: string;
  user_id: string;
  content: string;
  created_at: string;
  is_official: boolean;
}

// ── PHASE 2 TYPES ─────────────────────────────────────────────

export interface Ward {
  id: string;
  ward_number: number;
  alderman_id: string | null;
  geometry: GeoJSON.Polygon | null;
  population_2020: number | null;
  boundaries_description: string | null;
}

export interface Alderman {
  id: string;
  name: string;
  ward_id: string;
  email: string | null;
  phone: string | null;
  photo_url: string | null;
  term_start: string | null;
  term_end: string | null;
  party_affiliation: string | null;
  response_rate: number;
  avg_response_time_days: number;
  total_resolved: number;
  total_ignored: number;
  public_profile_enabled: boolean;
  social_media_handles: Record<string, string> | null;
  committee_assignments: string[] | null;
}

export interface PoliticalAction {
  id: string;
  report_id: string;
  alderman_id: string;
  action_type: PoliticalActionType;
  action_date: string;
  notes: string | null;
  is_public: boolean;
}

export interface EscalationLog {
  id: string;
  report_id: string;
  triggered_at: string;
  level: EscalationLevel;
  notification_sent_to: string[] | null;
  auto_posted_social: boolean;
  is_resolved: boolean;
}

// ── PHASE 3 TYPES ─────────────────────────────────────────────

export interface CityDepartment {
  id: string;
  name: string;
  category_match: ReportCategory[];
  head_name: string | null;
  email: string | null;
  auto_assign_rules: Record<string, unknown> | null;
}

export interface InternalTicket {
  id: string;
  report_id: string;
  department_id: string;
  assigned_to: string | null;
  priority: 'low' | 'medium' | 'high' | 'critical';
  internal_notes: string | null;
  cost_estimate: number | null;
  scheduled_date: string | null;
  completed_at: string | null;
}

// ── PHASE 4 TYPES ─────────────────────────────────────────────

export interface PoliticianSubscription {
  id: string;
  alderman_id: string;
  subscription_tier: 'basic' | 'pro' | 'enterprise';
  payment_status: 'active' | 'past_due' | 'canceled';
  features_enabled: string[];
  analytics_access_level: 'basic' | 'full';
}

export interface CampaignPromise {
  id: string;
  alderman_id: string;
  promise_text: string;
  category: ReportCategory | 'general';
  deadline: string | null;
  status: 'active' | 'fulfilled' | 'broken' | 'expired';
  evidence_url: string | null;
  created_at: string;
}

export interface ConstituentMessage {
  id: string;
  from_user_id: string;
  to_alderman_id: string;
  report_id: string | null;
  message: string;
  is_public: boolean;
  sentiment_score: number | null; // -1 to 1
}

// ── COMPOSITE / UI TYPES ───────────────────────────────────────

export interface ReportWithDetails extends Report {
  user?: Pick<UserProfile, 'id' | 'anonymous_alias'> | null;
  ward?: Pick<Ward, 'ward_number'> | null;
  alderman?: Pick<Alderman, 'name'> | null;
  user_confirmed?: boolean; // Has current user pressed Me Too?
}

export interface FeedFilters {
  category: ReportCategory | 'all';
  status: ReportStatus | 'all';
  timeRange: '24h' | '7d' | '30d' | 'all';
  ward: number | 'all';
}
