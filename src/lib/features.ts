// ============================================================
// WE THE PEOPLE 39120 — FEATURE FLAGS
// LEGO-modular architecture: flip a flag to enable a phase.
// Never delete a flag — only set to true when phase is live.
// ============================================================

export const FEATURES = {
  // ── PHASE 1: Citizen Interface (ALWAYS ON) ────────────────
  PHASE_1_CITIZEN: true,
  ANONYMOUS_ALIASES: true,
  HIGH_CONTRAST_MODE: true,
  VOICE_TO_TEXT: true,

  // ── PHASE 2: Political Pressure Layer (OFF until ready) ───
  PHASE_2_POLITICAL: false,
  AUTO_WARD_DETECTION: false,       // Turf.js point-in-polygon
  ALDERMAN_SCORECARDS: false,       // Public performance grades
  PUBLIC_SHAME: false,              // "Ignored for 30 days" badge
  ALDERMAN_NOTIFICATIONS: false,    // Email alderman at 5 Me Toos
  SOCIAL_SHARE_SHAME: false,        // Auto-generate shame share cards
  WARD_OVERLAY_MAP: false,          // Show ward boundaries on map

  // ── PHASE 3: Municipal SaaS (OFF until contracted) ────────
  PHASE_3_MUNICIPAL: false,
  MUNICIPAL_DASHBOARD: false,
  INTERNAL_TICKETING: false,
  DEPARTMENT_ROUTING: false,

  // ── PHASE 4: Politician Pro (OFF until subscriptions ready)
  PHASE_4_CAMPAIGN: false,
  POLITICIAN_SUBSCRIPTIONS: false,
  PROMISE_TRACKER: false,
  CONSTITUENT_MESSAGING: false,

  // ── PHASE 5: White Label (OFF until multi-city) ───────────
  PHASE_5_WHITE_LABEL: false,

  // ── Sub-features (toggle independently of phases) ─────────
  ME_TOO_ALDERMAN_NOTIFY: false,    // Requires PHASE_2_POLITICAL
  ESCALATION_EMAILS: false,         // Requires PHASE_2_POLITICAL
} as const;

export type FeatureKey = keyof typeof FEATURES;

export function isEnabled(feature: FeatureKey): boolean {
  return FEATURES[feature];
}
