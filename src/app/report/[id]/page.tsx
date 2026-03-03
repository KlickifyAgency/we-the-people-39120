'use client';
import { useEffect, useState } from 'react';
import { createBrowserClient } from '@supabase/ssr';

const CATEGORY_LABELS: Record<string, string> = {
  graffiti: 'Graffiti / Vandalism',
  dumping: 'Illegal Dumping',
  abandoned_vehicle: 'Abandoned Vehicle',
  property_neglect: 'Property Neglect',
  noise: 'Noise Complaint',
  street_issues: 'Street / Pothole Issues',
  vegetation: 'Overgrown Vegetation',
  animal: 'Animal Issues',
  safety_hazard: 'Safety Hazard',
  water_drainage: 'Water / Drainage',
  public_safety: 'Public Safety / Crime',
};

function DaysCounter({ createdAt }: { createdAt: string }) {
  const created = new Date(createdAt);
  const now = new Date();
  const days = Math.floor((now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24));
  const remaining = 30 - days;
  const pct = Math.min((days / 30) * 100, 100);
  const color = days < 10 ? '#22c55e' : days < 20 ? '#f59e0b' : '#ef4444';

  return (
    <div style={{ background: '#0f0f1a', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: '20px 24px', marginBottom: 20 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <span style={{ fontSize: 13, fontWeight: 700, color: '#a4a4b8', textTransform: 'uppercase', letterSpacing: '0.08em' }}>30-Day Response Clock</span>
        <span style={{ fontSize: 13, fontWeight: 800, color }}>Day {days} of 30</span>
      </div>
      <div style={{ height: 8, background: 'rgba(255,255,255,0.06)', borderRadius: 100, overflow: 'hidden', marginBottom: 10 }}>
        <div style={{ height: '100%', width: `${pct}%`, background: color, borderRadius: 100, transition: 'width 0.5s ease' }} />
      </div>
      <p style={{ fontSize: 12, color: '#6b6b8a' }}>
        {remaining > 0
          ? `${remaining} days remaining before this is flagged as ignored`
          : 'This report has exceeded 30 days — flagged as ignored'}
      </p>
    </div>
  );
}

export default function ReportPage({ params }: { params: any }) {
  const [report, setReport] = useState<any>(null);
  const [response, setResponse] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const [reportId, setReportId] = useState<string>('');

  useEffect(() => {
    Promise.resolve(params).then(p => setReportId(p.id));
  }, []);

  useEffect(() => {
    if (!reportId) return;
    supabase.from('reports').select('*, ward:wards(ward_number)').eq('id', reportId).single()
      .then(({ data, error }) => {
        if (error) console.error('Report fetch error:', error);
        setReport(data);
      });
  }, [reportId]);

  async function handleRespond() {
    if (response.trim().length < 10) { setError('Please write at least 10 characters.'); return; }
    setSubmitting(true);
    const res = await fetch(`/api/v1/reports/${reportId}/respond`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ response }),
    });
    if (res.ok) { setSubmitted(true); setReport((r: any) => ({ ...r, alderman_response: response, alderman_responded_at: new Date().toISOString() })); }
    else setError('Failed to submit. Please try again.');
    setSubmitting(false);
  }

  if (!reportId || !report) return (
    <div style={{ minHeight: '100vh', background: '#0a0a14', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 12 }}>
      <div style={{ width: 40, height: 40, border: '3px solid rgba(168,85,247,0.3)', borderTop: '3px solid #a855f7', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
      <p style={{ color: '#6b6b8a', fontSize: 14 }}>Loading report...</p>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
  if (!report) return (
    <div style={{ minHeight: '100vh', background: '#0a0a14', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ color: '#6b6b8a' }}>Loading report...</p>
    </div>
  );

  const mapsUrl = `https://maps.google.com/?q=${report.lat},${report.lng}`;
  const days = Math.floor((new Date().getTime() - new Date(report.created_at).getTime()) / (1000 * 60 * 60 * 24));

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a14', color: '#e4e4f0', fontFamily: '-apple-system,BlinkMacSystemFont,sans-serif', padding: '32px 16px' }}>
      <div style={{ maxWidth: 600, margin: '0 auto' }}>

        <div style={{ marginBottom: 24 }}>
          <div style={{ display: 'inline-block', background: 'linear-gradient(135deg,#7c3aed,#a855f7)', borderRadius: 100, padding: '4px 14px', fontSize: 11, fontWeight: 700, color: 'white', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 12 }}>
            We The People 39120
          </div>
          <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 6 }}>Community Report</h1>
          <p style={{ fontSize: 13, color: '#6b6b8a' }}>#{reportId.slice(0, 8).toUpperCase()} · {CATEGORY_LABELS[report.category] ?? report.category}</p>
        </div>

        <DaysCounter createdAt={report.created_at} />

        <div style={{ background: '#16162a', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 16, overflow: 'hidden', marginBottom: 20 }}>
          {[
            ['Issue', CATEGORY_LABELS[report.category] ?? report.category],
            ['Location', `Ward ${report.ward_id ?? 'Unknown'}, Natchez MS 39120`],
            ['Filed', new Date(report.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })],
            ['Status', report.alderman_response ? '✅ Alderman Responded' : days >= 30 ? '🔴 Ignored — 30 Days Exceeded' : '⏳ Awaiting Response'],
          ].map(([label, value]) => (
            <div key={label} style={{ display: 'flex', padding: '14px 20px', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
              <span style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#6b6b8a', minWidth: 90 }}>{label}</span>
              <span style={{ fontSize: 14, color: '#e4e4f0', flex: 1 }}>{value}</span>
            </div>
          ))}
          {report.description && (
            <div style={{ display: 'flex', padding: '14px 20px', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
              <span style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#6b6b8a', minWidth: 90 }}>Message</span>
              <span style={{ fontSize: 14, color: '#a4a4b8', flex: 1, fontStyle: 'italic' }}>"{report.description}"</span>
            </div>
          )}
        </div>

        <a href={mapsUrl} target="_blank" rel="noreferrer" style={{ display: 'block', textAlign: 'center', background: 'linear-gradient(135deg,#7c3aed,#a855f7)', color: 'white', textDecoration: 'none', padding: '14px 24px', borderRadius: 12, fontWeight: 700, fontSize: 15, marginBottom: 24 }}>
          View Location on Google Maps
        </a>

        {report.alderman_response ? (
          <div style={{ background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.25)', borderRadius: 16, padding: '24px' }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#86efac', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>
              ✅ Official Alderman Response
            </div>
            <p style={{ fontSize: 15, color: '#e4e4f0', lineHeight: 1.7, marginBottom: 12 }}>"{report.alderman_response}"</p>
            <p style={{ fontSize: 12, color: '#6b6b8a' }}>
              Responded on {new Date(report.alderman_responded_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
        ) : (
          <div style={{ background: '#16162a', border: '1px solid rgba(168,85,247,0.2)', borderRadius: 16, padding: '24px' }}>
            <div style={{ fontSize: 15, fontWeight: 800, color: '#e4e4f0', marginBottom: 8 }}>Community Update</div>
            <p style={{ fontSize: 13, color: '#6b6b8a', marginBottom: 20, lineHeight: 1.7 }}>
              Have additional information about this issue? Add a community update to help your neighbors and the alderman better understand the situation.
            </p>
            {submitted ? (
              <div style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: 12, padding: 16, textAlign: 'center' }}>
                <p style={{ color: '#86efac', fontWeight: 700 }}>✅ Update submitted. Thank you for helping the community!</p>
              </div>
            ) : (
              <>
                <textarea
                  value={response}
                  onChange={e => { setResponse(e.target.value); setError(''); }}
                  placeholder="Add more details — how long has this been here? Is it getting worse? Any other context that helps..."
                  rows={4}
                  style={{ width: '100%', background: '#0f0f1a', border: '1px solid rgba(168,85,247,0.3)', borderRadius: 12, padding: '14px 16px', color: '#e4e4f0', fontSize: 14, resize: 'vertical', outline: 'none', marginBottom: 12, fontFamily: 'inherit' }}
                />
                {error && <p style={{ color: '#fca5a5', fontSize: 13, marginBottom: 12 }}>{error}</p>}
                <button
                  onClick={handleRespond}
                  disabled={submitting}
                  style={{ width: '100%', background: 'linear-gradient(135deg,#1A5EA8,#2D7A4F)', color: 'white', border: 'none', borderRadius: 12, padding: '14px', fontWeight: 800, fontSize: 15, cursor: submitting ? 'not-allowed' : 'pointer', opacity: submitting ? 0.7 : 1 }}
                >
                  {submitting ? 'Submitting...' : 'Submit Community Update'}
                </button>
              </>
            )}
          </div>
        )}

        <p style={{ textAlign: 'center', fontSize: 12, color: '#4a4a64', marginTop: 32 }}>
          We The People 39120 · Built by KlickifyAgency.com
        </p>
      </div>
    </div>
  );
}
