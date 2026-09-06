import { ReportCategory, ReportStatus } from './types';

export const BRAND = {
  name: 'We The People 39120',
  tagline: "Y'all see it, we fix it",
  city: 'Natchez, Mississippi',
  zip: '39120',
  phone911Reminder: 'For emergencies, call 911.',
  agency: 'KlickifyAgency.com',
  agencyEmail: 'support@klickifyagency.com',
  agencyTagline: 'Digital Solutions for Mississippi',
  colors: { blue: '#1e3a8a', gold: '#d97706', green: '#16a34a', red: '#dc2626' },
} as const;

// Every reports column EXCEPT respond_token, which is the alderman's only
// credential in /api/v1/respond and must never reach a public client.
export const REPORT_PUBLIC_COLS = 'id,user_id,photo_url,category,description,lat,lng,ward_id,status,created_at,updated_at,anonymous,me_too_count,view_count,is_escalated,alderman_response,alderman_responded_at,reminder_10_sent,reminder_20_sent,escalated_at,ward_number';

export const NATCHEZ_CENTER: [number, number] = [31.5604, -91.4032];
export const NATCHEZ_ZOOM = 13;

export const CATEGORY_ICONS: Record<string, string> = {
  graffiti:          'M7 14c-1.66 0-3 1.34-3 3 0 1.31-1.16 2-2 2 .92 1.22 2.49 2 4 2 2.21 0 4-1.79 4-4 0-1.66-1.34-3-3-3zm13.71-9.37-1.34-1.34c-.39-.39-1.02-.39-1.41 0L9 12.25 11.75 15l8.96-8.96c.39-.39.39-1.02 0-1.41z',
  dumping:           'M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z',
  abandoned_vehicle: 'M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z',
  property_neglect:  'M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z',
  noise:             'M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z',
  street_issues:     'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z',
  vegetation:        'M17 8C8 10 5.9 16.17 3.82 21.34L5.71 22l1-2.3A4.49 4.49 0 0 0 8 20C19 20 22 3 22 3c-1 2-8 2-8 2 2-1 5 3 5 3-3-1-9.17 3.5-9.17 3.5A19.46 19.46 0 0 0 8 17a13 13 0 0 1 9-9z',
  animal:            'M4.5 11c.28 0 .5-.22.5-.5v-1c0-.28-.22-.5-.5-.5S4 9.22 4 9.5v1c0 .28.22.5.5.5zm15 1c-.28 0-.5.22-.5.5v1c0 .28.22.5.5.5s.5-.22.5-.5v-1c0-.28-.22-.5-.5-.5zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-5-9h10v2H7v-2z',
  safety_hazard:     'M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z',
  water_drainage:    'M12 2c-5.33 4.55-8 8.48-8 11.8 0 4.98 3.8 8.2 8 8.2s8-3.22 8-8.2c0-3.32-2.67-7.25-8-11.8z',
  public_safety:     'M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z',
};

export const CATEGORIES: Record<ReportCategory, { label: string; emoji: string; description: string }> = {
  graffiti:          { label: 'Graffiti / Vandalism',  emoji: '🎨', description: 'Tags, spray paint, property damage' },
  dumping:           { label: 'Illegal Dumping',        emoji: '🗑️', description: 'Trash, tires, appliances dumped' },
  abandoned_vehicle: { label: 'Abandoned Vehicle',      emoji: '🚗', description: 'Car or truck left abandoned' },
  property_neglect:  { label: 'Property Neglect',       emoji: '🏚️', description: 'High grass, abandoned buildings' },
  noise:             { label: 'Noise Complaint',        emoji: '🔊', description: 'Excessive noise, loud music' },
  street_issues:     { label: 'Street Issues',          emoji: '🚦', description: 'Potholes, broken lights, signs' },
  vegetation:        { label: 'Vegetation / Trees',     emoji: '🌳', description: 'Overgrown trees, blocking signs' },
  animal:            { label: 'Animal Issues',          emoji: '🐕', description: 'Stray animals, animal neglect' },
  safety_hazard:     { label: 'Safety Hazard',          emoji: '⚠️', description: 'Exposed wires, open holes, dangers' },
  water_drainage:    { label: 'Water / Drainage',       emoji: '💧', description: 'Flooding, broken pipes, sewage' },
  public_safety:     { label: 'Public Safety / Crime',  emoji: '🚨', description: 'Criminal activity, suspicious behavior, drug activity' },
};

export const STATUS_CONFIG: Record<ReportStatus, { label: string; color: string; bg: string }> = {
  pending:      { label: 'Pending',             color: '#fbbf24', bg: 'rgba(251,191,36,0.18)' },
  confirmed:    { label: 'Community Confirmed', color: '#22d3ee', bg: 'rgba(6,182,212,0.18)' },
  acknowledged: { label: 'Acknowledged',        color: '#a78bfa', bg: 'rgba(167,139,250,0.18)' },
  in_progress:  { label: 'In Progress',         color: '#38bdf8', bg: 'rgba(56,189,248,0.18)' },
  resolved:     { label: 'Resolved ✓',          color: '#34d399', bg: 'rgba(16,185,129,0.18)' },
  ignored:      { label: 'Ignored',             color: '#f87171', bg: 'rgba(248,113,113,0.18)' },
  closed:       { label: 'Closed',              color: '#a1a1aa', bg: 'rgba(161,161,170,0.18)' },
  overdue:      { label: 'Overdue',             color: '#fb923c', bg: 'rgba(251,146,60,0.18)' },
};

export const ALDERMEN_SEED = [
  { ward_number: 1, name: 'Valencia Hall',              email: null, phone: null },
  { ward_number: 2, name: 'Billie Joe Frazier',         email: null, phone: null },
  { ward_number: 3, name: 'Sarah Carter-Smith',         email: null, phone: null },
  { ward_number: 4, name: 'Felicia Bridgewater-Irving', email: null, phone: null },
  { ward_number: 5, name: 'Benjamin Davis',             email: null, phone: null },
  { ward_number: 6, name: 'Curtis Moroney',             email: null, phone: null },
] as const;

export const ALDERMEN: Record<number, { name: string; email: string; phone: string }> = {
  1: { name: 'Valencia Hall',              email: 'vhall@natchez.ms.us',    phone: '6014431265' },
  2: { name: 'Billie Joe Frazier',         email: 'bfrazier@natchez.ms.us', phone: '6014457500' },
  3: { name: 'Sarah Carter-Smith',         email: 'ssmith@natchez.ms.us',   phone: '6013341537' },
  4: { name: 'Felicia Bridgewater-Irving', email: 'firving@natchez.ms.us',  phone: '6014457500' },
  5: { name: 'Benjamin Davis',             email: 'bdavis@natchez.ms.us',   phone: '6014457500' },
  6: { name: 'Curtis Moroney',             email: 'cmoroney@natchez.ms.us', phone: '6014457500' },
};

export const MAYOR = {
  name:  'Dan M. Gibson',
  email: 'dgibson@natchez.ms.us',
  phone: '6014457500',
};

export const CITY_CONTACTS = {
  mayor: { name: 'Dan Gibson', phone: '601-445-7500', address: '124 S. Pearl St' },
  meetingSchedule: '2nd and 4th Tuesdays monthly (public)',
} as const;

export const ESCALATION_THRESHOLDS = {
  ME_TOO_ALDERMAN_NOTIFY: 5,
  DAYS_7: 7, DAYS_14: 14, DAYS_30: 30, DAYS_60: 60,
} as const;
