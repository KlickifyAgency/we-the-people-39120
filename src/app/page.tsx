'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const FB_PAGE = 'https://www.facebook.com/profile.php?id=61588640650718';

const ALDERMEN = [
  { ward: 'Ward 1', name: 'Valencia Hall',              phone: '601-443-1265', initial: 'VH', photo: 'https://natchez.ms.us/ImageRepository/Document?documentId=1411' },
  { ward: 'Ward 2', name: 'Billie Joe Frazier',         phone: '601-445-7500', initial: 'BF', photo: 'https://natchez.ms.us/ImageRepository/Document?documentId=1406' },
  { ward: 'Ward 3', name: 'Sarah Carter-Smith',         phone: '601-334-1537', initial: 'SC', photo: 'https://natchez.ms.us/ImageRepository/Document?documentId=1410' },
  { ward: 'Ward 4', name: 'Felicia Bridgewater-Irving', phone: '601-445-7500', initial: 'FB', photo: 'https://natchez.ms.us/ImageRepository/Document?documentId=1408' },
  { ward: 'Ward 5', name: 'Benjamin Davis',             phone: '601-445-7500', initial: 'BD', photo: 'https://natchez.ms.us/ImageRepository/Document?documentId=1405' },
  { ward: 'Ward 6', name: 'Curtis Moroney',             phone: '601-445-7500', initial: 'CM', photo: 'https://natchez.ms.us/ImageRepository/Document?documentId=1407' },
  { ward: 'Mayor',  name: 'Dan M. Gibson',              phone: '601-445-7500', initial: 'DG', photo: '' },
];

const STATUS_LABEL: Record<string, string> = {
  pending: 'Pending', resolved: 'Resolved', in_progress: 'In Progress',
  community: 'Community Fix', ignored: 'Ignored', overdue: 'Overdue',
};
const STATUS_COLOR: Record<string, { bg: string; color: string }> = {
  pending:     { bg: '#FEF3C7', color: '#92400E' },
  resolved:    { bg: '#ECFDF5', color: '#065F46' },
  in_progress: { bg: '#EFF6FF', color: '#1E40AF' },
  community:   { bg: '#EDE9FE', color: '#4C1D95' },
  ignored:     { bg: '#FEF2F2', color: '#991B1B' },
  overdue:     { bg: '#FFF7ED', color: '#9A3412' },
};
const CAT_EMOJI: Record<string, string> = {
  graffiti:'🎨', dumping:'🗑️', abandoned_vehicle:'🚗', property_neglect:'🏚️',
  noise:'📢', street_issues:'🚧', vegetation:'🌿', animal:'🐾',
  safety_hazard:'⚠️', water_drainage:'💧', public_safety:'🚨',
};
const CAT_LABEL: Record<string, string> = {
  graffiti:'Graffiti', dumping:'Illegal Dumping', abandoned_vehicle:'Abandoned Vehicle',
  property_neglect:'Property Neglect', noise:'Noise Complaint', street_issues:'Street Issues',
  vegetation:'Overgrown Vegetation', animal:'Animal Issue', safety_hazard:'Safety Hazard',
  water_drainage:'Water / Drainage', public_safety:'Public Safety',
};

function timeAgoSimple(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const d = Math.floor(diff / 86400000);
  if (d === 0) return 'Today';
  if (d === 1) return 'Yesterday';
  if (d < 30) return `${d} days ago`;
  const m = Math.floor(d / 30);
  return `${m} month${m > 1 ? 's' : ''} ago`;
}

function RecentReports() {
  const router = useRouter();
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/v1/reports?timeRange=all')
      .then(r => r.json())
      .then((data: any[]) => {
        if (Array.isArray(data)) setReports(data.slice(0, 8));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div style={{ margin: '0 20px 28px', textAlign: 'center', padding: '32px 0', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
      Loading reports...
    </div>
  );

  if (reports.length === 0) return null;

  return (
    <div style={{ margin: '0 0 28px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 20px', marginBottom: 12 }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 800, color: 'var(--navy)', margin: 0 }}>
          Recent Reports
        </h2>
        <Link href="/feed" style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--blue)', textDecoration: 'none' }}>
          View All →
        </Link>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, padding: '0 16px' }}>
        {reports.map(r => {
          const s = r.status ?? 'pending';
          const sc = STATUS_COLOR[s] ?? STATUS_COLOR.pending;
          const days = Math.floor((Date.now() - new Date(r.created_at).getTime()) / 86400000);
          return (
            <button
              key={r.id}
              onClick={() => router.push(`/report/${r.id}`)}
              style={{
                display: 'flex', alignItems: 'center', gap: 14,
                background: 'var(--surface)', borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--border)', padding: '14px 16px',
                boxShadow: 'var(--shadow-card)', cursor: 'pointer',
                textAlign: 'left', width: '100%',
              }}
            >
              {/* Photo or emoji */}
              {r.photo_url ? (
                <img src={r.photo_url} alt="" style={{ width: 64, height: 64, borderRadius: 12, objectFit: 'cover', flexShrink: 0 }} />
              ) : (
                <div style={{
                  width: 64, height: 64, borderRadius: 12, flexShrink: 0,
                  background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.8rem',
                }}>
                  {CAT_EMOJI[r.category] ?? '📍'}
                </div>
              )}

              {/* Info */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.95rem', color: 'var(--text)', marginBottom: 4, lineHeight: 1.2 }}>
                  {CAT_LABEL[r.category] ?? r.category}
                </div>
                {r.description && (
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: 6, lineHeight: 1.4, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical' }}>
                    {r.description}
                  </div>
                )}
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '0.7rem', padding: '2px 10px', borderRadius: 99, fontWeight: 700, background: sc.bg, color: sc.color }}>
                    {STATUS_LABEL[s] ?? s}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    Ward {r.ward_number ?? '?'} · {timeAgoSimple(r.created_at)}
                    {days >= 1 && <span style={{ color: days >= 30 ? 'var(--red)' : days >= 20 ? 'var(--amber)' : 'var(--text-muted)', marginLeft: 4 }}>Day {days}</span>}
                  </span>
                </div>
              </div>
              <svg viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2" width="16" height="16" style={{ flexShrink: 0 }}>
                <polyline points="9 18 15 12 9 6"/>
              </svg>
            </button>
          );
        })}
      </div>
    </div>
  );
}

const HOW = [
  { n: '1', icon: '📸', title: 'Take a Photo', desc: 'Point your phone at the problem and snap a picture.' },
  { n: '2', icon: '📍', title: 'Confirm Location', desc: 'Your phone finds exactly where the problem is — automatically.' },
  { n: '3', icon: '✅', title: 'Submit — Done', desc: 'Your report goes public and the alderman gets an email immediately.' },
];

function StatsStrip() {
  const [stats, setStats] = useState<{ total: number; resolved: number } | null>(null);

  useEffect(() => {
    fetch('/api/v1/reports?timeRange=all')
      .then(r => r.json())
      .then((data: any[]) => {
        if (!Array.isArray(data)) return;
        setStats({
          total:    data.length,
          resolved: data.filter(r => r.status === 'resolved' || r.status === 'community_resolved').length,
        });
      })
      .catch(() => {});
  }, []);

  if (!stats) return null;

  return (
    <div style={{
      display: 'grid', gridTemplateColumns: '1fr 1fr',
      gap: 10, margin: '0 20px 24px',
    }}>
      <StatCard value={stats.total} label="Problems Reported" color="var(--blue)" bg="var(--blue-soft)" />
      <StatCard value={stats.resolved} label="Fixed by the City" color="var(--green)" bg="var(--green-soft)" />
    </div>
  );
}

function StatCard({ value, label, color, bg }: { value: number; label: string; color: string; bg: string }) {
  return (
    <div style={{
      background: bg, borderRadius: 'var(--radius-lg)',
      padding: '18px 16px', textAlign: 'center',
      border: `1.5px solid ${color}22`,
    }}>
      <div style={{ fontSize: '2.2rem', fontWeight: 900, color, fontFamily: 'var(--font-display)', lineHeight: 1 }}>
        {value}
      </div>
      <div style={{ fontSize: '0.75rem', fontWeight: 700, color, marginTop: 6, textTransform: 'uppercase', letterSpacing: '0.06em', lineHeight: 1.3 }}>
        {label}
      </div>
    </div>
  );
}

export default function HomePage() {
  return (
    <main style={{
      minHeight: '100vh',
      background: 'var(--bg)',
      paddingBottom: 120,
      fontFamily: 'var(--font-body)',
    }}>

      {/* ── HERO ──────────────────────────────── */}
      <div style={{
        background: 'linear-gradient(160deg, #0F172A 0%, #1D4ED8 100%)',
        padding: '44px 24px 36px',
        textAlign: 'center',
      }}>
        {/* Logo */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
          <img
            src="/logo-dark.svg"
            alt="We The People 39120"
            style={{ height: 72, objectFit: 'contain' }}
            onError={e => { (e.target as HTMLImageElement).src = '/logo-wtp.png'; }}
          />
        </div>

        <h1 style={{
          fontSize: '2.2rem', fontWeight: 900,
          color: '#FFFFFF', lineHeight: 1.15,
          marginBottom: 12, fontFamily: 'var(--font-display)',
        }}>
          See a Problem<br/>
          <span style={{ color: '#D97706' }}>in Natchez?</span>
        </h1>

        <p style={{
          fontSize: '1.1rem', color: 'rgba(255,255,255,0.85)',
          lineHeight: 1.65, marginBottom: 28, maxWidth: 340, margin: '0 auto 28px',
        }}>
          Report it here. Your alderman gets an email right away.
          The community sees it on Facebook. No name required.
        </p>

        <Link href="/report" style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12,
          background: '#D97706', color: '#0F172A',
          fontWeight: 900, fontSize: '1.2rem',
          height: 72, borderRadius: 20,
          textDecoration: 'none',
          boxShadow: '0 8px 32px rgba(217,119,6,0.50)',
          margin: '0 4px',
        }}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="26" height="26">
            <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
            <circle cx="12" cy="13" r="4"/>
          </svg>
          Report a Problem — Free & Anonymous
        </Link>

        <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)', marginTop: 14 }}>
          Takes 30 seconds · No sign-up needed · 100% anonymous
        </p>
      </div>

      {/* ── IMPACT STATS ──────────────────────── */}
      <div style={{ marginTop: 24 }}>
        <p style={{
          textAlign: 'center', fontSize: '0.78rem', fontWeight: 700,
          color: 'var(--text-muted)', textTransform: 'uppercase',
          letterSpacing: '0.08em', marginBottom: 12,
        }}>
          Natchez — Real Results
        </p>
        <StatsStrip />
      </div>

      {/* ── RECENT REPORTS ────────────────────── */}
      <RecentReports />

      {/* ── HOW IT WORKS ──────────────────────── */}
      <div style={{ margin: '0 20px 28px' }}>
        <h2 style={{
          fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 800,
          color: 'var(--navy)', marginBottom: 6,
        }}>
          How It Works
        </h2>
        <p style={{ fontSize: '1rem', color: 'var(--text-muted)', marginBottom: 18 }}>
          Three easy steps. No passwords. No forms.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {HOW.map((s) => (
            <div key={s.n} style={{
              display: 'flex', alignItems: 'center', gap: 16,
              background: 'var(--surface)', borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--border)', padding: '18px 16px',
              boxShadow: 'var(--shadow-sm)',
            }}>
              <div style={{
                width: 56, height: 56, borderRadius: 16, flexShrink: 0,
                background: 'var(--blue-soft)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '1.8rem',
              }}>{s.icon}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.05rem', color: 'var(--navy)', marginBottom: 3 }}>
                  {s.title}
                </div>
                <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                  {s.desc}
                </div>
              </div>
              <div style={{
                width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
                background: 'var(--blue)', display: 'flex', alignItems: 'center',
                justifyContent: 'center', fontSize: '0.9rem', fontWeight: 900, color: 'white',
              }}>{s.n}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── 30-DAY CLOCK EXPLAINER ────────────── */}
      <div style={{
        margin: '0 20px 28px',
        background: '#FFFBEB',
        border: '2px solid #D97706',
        borderRadius: 'var(--radius-xl)',
        padding: '22px 20px',
      }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
          <div style={{
            width: 52, height: 52, borderRadius: 14, flexShrink: 0,
            background: '#D97706', display: 'flex', alignItems: 'center',
            justifyContent: 'center', fontSize: '1.6rem',
          }}>⏱️</div>
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.1rem', color: '#92400E', marginBottom: 8 }}>
              The 30-Day Rule
            </div>
            <p style={{ fontSize: '0.95rem', color: '#78350F', lineHeight: 1.65, margin: 0 }}>
              Every report starts a public 30-day clock. Your alderman has 30 days to respond.
              Every day of silence is visible to the whole community — on this app and on Facebook.
            </p>
          </div>
        </div>
      </div>

      {/* ── FACEBOOK CTA ──────────────────────── */}
      <div style={{
        margin: '0 20px 28px',
        background: '#EBF5FF',
        border: '1.5px solid #1877F2',
        borderRadius: 'var(--radius-xl)',
        padding: '22px 20px',
        textAlign: 'center',
      }}>
        <div style={{ fontSize: '1.7rem', marginBottom: 10 }}>📲</div>
        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.15rem', color: '#0F172A', marginBottom: 8 }}>
          Follow us on Facebook
        </div>
        <p style={{ fontSize: '0.95rem', color: '#374151', lineHeight: 1.65, marginBottom: 18 }}>
          Every new report is posted automatically to our Facebook page.
          <strong> Follow us to see what's happening in your neighborhood</strong> — without creating any account here.
        </p>
        <a href={FB_PAGE} target="_blank" rel="noopener noreferrer" style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12,
          background: '#1877F2', color: '#FFFFFF',
          fontWeight: 800, fontSize: '1.05rem',
          height: 60, borderRadius: 'var(--radius-lg)',
          textDecoration: 'none',
          boxShadow: '0 4px 20px rgba(24,119,242,0.35)',
        }}>
          <svg viewBox="0 0 24 24" fill="white" width="24" height="24">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
          </svg>
          We The People 39120 — Follow on Facebook
        </a>
      </div>

      {/* ── YOUR REPRESENTATIVES ───────────────── */}
      <div style={{ margin: '0 20px 28px' }}>
        <h2 style={{
          fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 800,
          color: 'var(--navy)', marginBottom: 6,
        }}>
          Your Representatives
        </h2>
        <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)', marginBottom: 16, lineHeight: 1.6 }}>
          These are the elected officials responsible for your neighborhood. Each one has a 30-day window to respond to reports in their ward.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {ALDERMEN.map(a => (
            <div key={a.ward} style={{
              display: 'flex', alignItems: 'center', gap: 14,
              background: 'var(--surface)', borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--border)', padding: '14px 16px',
              boxShadow: 'var(--shadow-sm)',
            }}>
              {/* Avatar */}
              <div style={{
                width: 52, height: 52, borderRadius: '50%', flexShrink: 0,
                background: 'linear-gradient(135deg, #0F172A, #1D4ED8)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                overflow: 'hidden', border: '2px solid var(--border)',
              }}>
                {a.photo ? (
                  <img src={a.photo} alt={a.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                ) : (
                  <span style={{ fontSize: '1.1rem', fontWeight: 800, color: 'white' }}>{a.initial}</span>
                )}
              </div>
              {/* Info */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--blue)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 3 }}>
                  {a.ward}
                </div>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1rem', color: 'var(--navy)', marginBottom: 1 }}>
                  {a.name}
                </div>
              </div>
              {/* Call button */}
              <a href={`tel:${a.phone.replace(/-/g, '')}`} style={{
                flexShrink: 0,
                display: 'flex', alignItems: 'center', gap: 6,
                background: 'var(--green-soft)', color: 'var(--green)',
                fontWeight: 700, fontSize: '0.85rem',
                padding: '10px 14px', borderRadius: 12,
                textDecoration: 'none', border: '1px solid #A7F3D0',
              }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.41 2 2 0 0 1 3.6 1.22h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.82a16 16 0 0 0 6.29 6.29l.96-.96a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
                </svg>
                Call
              </a>
            </div>
          ))}
        </div>
      </div>

      {/* ── BOARD MEETINGS ─────────────────────── */}
      <div style={{
        margin: '0 20px 28px',
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-xl)',
        padding: '20px',
        display: 'flex', gap: 14, alignItems: 'flex-start',
        boxShadow: 'var(--shadow-sm)',
      }}>
        <div style={{
          width: 50, height: 50, borderRadius: 14, flexShrink: 0,
          background: 'var(--blue-soft)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem',
        }}>📅</div>
        <div>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.05rem', color: 'var(--navy)', marginBottom: 6 }}>
            Public Board Meetings
          </div>
          <p style={{ fontSize: '0.95rem', color: 'var(--text-sub)', lineHeight: 1.65, margin: 0 }}>
            The City Board meets the <strong>2nd and 4th Tuesday</strong> of every month at <strong>6:00 PM</strong>.
            City Hall — 215 Main Street, Natchez, MS 39120. Open to the public.
          </p>
        </div>
      </div>

      {/* ── MISSION ────────────────────────────── */}
      <div style={{
        margin: '0 20px 28px',
        background: 'linear-gradient(160deg, #0F172A 0%, #1D4ED8 100%)',
        borderRadius: 'var(--radius-xl)',
        padding: '28px 24px',
      }}>
        <div style={{ textAlign: 'center', marginBottom: 20 }}>
          <img src="/logo-dark.svg" alt="We The People 39120" style={{ height: 48, objectFit: 'contain', marginBottom: 16 }}
            onError={e => { (e.target as HTMLImageElement).src = '/logo-wtp.png'; }} />
          <blockquote style={{
            fontSize: '1.2rem', fontWeight: 800,
            color: '#D97706', fontFamily: 'var(--font-display)',
            margin: '0 0 16px', lineHeight: 1.3,
          }}>
            "Y'all See It. We Report It.<br/>We Fix It."
          </blockquote>
          <p style={{ fontSize: '0.95rem', color: 'rgba(255,255,255,0.80)', lineHeight: 1.7, margin: 0 }}>
            We The People 39120 connects the citizens of Natchez directly with their elected officials.
            Anonymous. Free. Yours.
          </p>
        </div>
        <Link href="/report" style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
          background: '#D97706', color: '#0F172A',
          fontWeight: 900, fontSize: '1.1rem',
          height: 66, borderRadius: 'var(--radius-lg)',
          textDecoration: 'none',
          boxShadow: '0 6px 28px rgba(217,119,6,0.45)',
        }}>
          Join Your Community — Report Now
        </Link>
      </div>

      {/* ── FOOTER ─────────────────────────────── */}
      <div style={{ margin: '0 20px', textAlign: 'center', paddingBottom: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 20, marginBottom: 12 }}>
          <Link href="/feed" style={{ fontSize: '0.9rem', color: 'var(--blue)', fontWeight: 700, textDecoration: 'none' }}>Public Map</Link>
          <Link href="/report" style={{ fontSize: '0.9rem', color: 'var(--blue)', fontWeight: 700, textDecoration: 'none' }}>Report Now</Link>
          <a href={FB_PAGE} target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.9rem', color: '#1877F2', fontWeight: 700, textDecoration: 'none' }}>Facebook</a>
        </div>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.6, margin: '0 0 6px' }}>
          Anonymous reporting always available. We never share your information.
        </p>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>
          Built for Natchez by{' '}
          <a href="https://klickifyagency.com" style={{ color: 'var(--blue)', fontWeight: 600 }}>KlickifyAgency.com</a>
          {' · '}
          <a href="mailto:info@klickifyagency.com" style={{ color: 'var(--blue)' }}>Want this in your city?</a>
        </p>
      </div>

    </main>
  );
}
