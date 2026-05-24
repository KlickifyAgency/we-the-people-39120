'use client';
import { useEffect, useState } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { MapPin, CheckCircle2, Loader2, Share2, ThumbsUp, Clock } from 'lucide-react';

const LABELS: Record<string, string> = {
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

const ALDERMEN: Record<number, { name: string; initial: string; photo: string }> = {
  1: { name: 'Valencia Hall',            initial: 'VH', photo: 'https://natchez.ms.us/ImageRepository/Document?documentId=1411' },
  2: { name: 'Billie Joe Frazier',       initial: 'BF', photo: 'https://natchez.ms.us/ImageRepository/Document?documentId=1406' },
  3: { name: 'Sarah Carter-Smith',       initial: 'SC', photo: 'https://natchez.ms.us/ImageRepository/Document?documentId=1410' },
  4: { name: 'Felicia Bridgewater-Irving', initial: 'FB', photo: 'https://natchez.ms.us/ImageRepository/Document?documentId=1408' },
  5: { name: 'Benjamin Davis',           initial: 'BD', photo: 'https://natchez.ms.us/ImageRepository/Document?documentId=1405' },
  6: { name: 'Curtis Moroney',           initial: 'CM', photo: 'https://natchez.ms.us/ImageRepository/Document?documentId=1407' },
};

function DaysCounter({ createdAt }: { createdAt: string }) {
  const days = Math.floor((Date.now() - new Date(createdAt).getTime()) / 86400000);
  const remaining = 30 - days;
  const pct = Math.min((days / 30) * 100, 100);
  const color = days < 10 ? 'var(--green)' : days < 20 ? 'var(--amber)' : 'var(--red)';

  return (
    <div style={{ background: 'var(--amber-soft)', border: '1px solid var(--amber)', borderRadius: 16, padding: '16px 20px', marginBottom: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <Clock size={15} color="var(--amber)" />
          <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--amber)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            30-Day Response Clock
          </span>
        </div>
        <span style={{ fontSize: '0.85rem', fontWeight: 800, color }}>{days < 30 ? `Day ${days} of 30` : 'OVERDUE'}</span>
      </div>
      <div style={{ height: 8, background: 'rgba(0,0,0,0.1)', borderRadius: 100, overflow: 'hidden', marginBottom: 8 }}>
        <div style={{ height: '100%', width: `${pct}%`, background: color, borderRadius: 100, transition: 'width 0.5s ease' }} />
      </div>
      <p style={{ fontSize: '0.8rem', color: 'var(--amber)', fontWeight: 600 }}>
        {remaining > 0
          ? `${remaining} days left for alderman to respond`
          : 'Exceeded 30 days — no response from alderman'}
      </p>
    </div>
  );
}

export default function ReportPage({ params }: { params: any }) {
  const [report, setReport]               = useState<any>(null);
  const [reportId, setReportId]           = useState('');
  const [comment, setComment]             = useState('');
  const [commentPhoto, setCommentPhoto]   = useState<File | null>(null);
  const [commentPhotoPreview, setCommentPhotoPreview] = useState<string | null>(null);
  const [submitting, setSubmitting]       = useState(false);
  const [submitted, setSubmitted]         = useState(false);
  const [error, setError]                 = useState('');
  const [metooCount, setMetooCount]       = useState(0);
  const [comments, setComments]           = useState<any[]>([]);
  const [metooLoading, setMetooLoading]   = useState(false);
  const [metooPressed, setMetooPressed]   = useState(false);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );

  useEffect(() => {
    Promise.resolve(params).then(p => {
      setReportId(p.id);
      if (typeof window !== 'undefined' && localStorage.getItem(`metoo_${p.id}`) === '1') {
        setMetooPressed(true);
      }
    });
  }, []);

  useEffect(() => {
    if (!reportId) return;
    supabase.from('reports').select('*, ward:wards(ward_number)').eq('id', reportId).single()
      .then(({ data }) => { setReport(data); setMetooCount(data?.me_too_count ?? 0); });
    fetch(`/api/v1/comments?report_id=${reportId}`).then(r => r.json()).then(data => setComments(Array.isArray(data) ? data : []));
    void supabase.rpc('increment_view_count', { report_id: reportId });
  }, [reportId]);

  const handleMetoo = async () => {
    if (metooLoading || metooPressed) return;
    setMetooLoading(true);
    setMetooCount(c => c + 1);
    setMetooPressed(true);
    localStorage.setItem(`metoo_${reportId}`, '1');
    await fetch(`/api/v1/reports/${reportId}/metoo`, { method: 'POST' });
    setMetooLoading(false);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${LABELS[report?.category] ?? 'Issue'} — We The People 39120`,
        text: `Help us fix this in Natchez, MS. ${metooCount} neighbors already agree.`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard?.writeText(window.location.href);
    }
  };

  const handleComment = async () => {
    if (comment.trim().length < 5) { setError('Please write at least 5 characters.'); return; }
    setSubmitting(true);
    const fd = new FormData();
    fd.append('report_id', reportId);
    fd.append('content', comment);
    if (commentPhoto) fd.append('photo', commentPhoto);
    const res = await fetch('/api/v1/comments', { method: 'POST', body: fd });
    const newComment = await res.json();
    if (!res.ok) { setError('Failed to submit. Please try again.'); setSubmitting(false); return; }
    setComments(c => [...c, newComment]);
    setSubmitted(true);
    setSubmitting(false);
  };

  if (!report) return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 12 }}>
      <Loader2 size={36} color="var(--blue)" className="animate-spin" />
      <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Loading report...</p>
    </div>
  );

  const days = Math.floor((Date.now() - new Date(report.created_at).getTime()) / 86400000);
  const mapsUrl = `https://maps.google.com/?q=${report.lat},${report.lng}`;
  const wardNum = report.ward_number ?? report.ward?.ward_number;
  const alderman = wardNum ? ALDERMEN[Number(wardNum)] : null;

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', paddingBottom: 100 }}>

      {/* Hero header */}
      <div style={{
        background: 'linear-gradient(160deg, #0F172A 0%, #1D4ED8 100%)',
        padding: '48px 20px 28px',
        textAlign: 'center',
        position: 'relative',
      }}>
        <div style={{
          display: 'inline-block', background: 'rgba(255,255,255,0.15)',
          borderRadius: 100, padding: '4px 16px',
          fontSize: '0.7rem', fontWeight: 700, color: 'rgba(255,255,255,0.85)',
          letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 12,
        }}>
          Community Report
        </div>
        <h1 style={{
          fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 900,
          color: '#FFFFFF', marginBottom: 6, lineHeight: 1.2,
        }}>
          {LABELS[report.category] ?? report.category}
        </h1>
        <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.6)' }}>
          #{reportId.slice(0, 8).toUpperCase()} · Natchez, MS 39120
        </p>

        {/* Share button */}
        <button onClick={handleShare} style={{
          position: 'absolute', top: 16, right: 16,
          background: 'rgba(255,255,255,0.15)', border: 'none',
          borderRadius: 12, padding: '8px 12px', cursor: 'pointer',
          display: 'flex', alignItems: 'center', gap: 6,
          color: 'white', fontSize: '0.75rem', fontWeight: 700,
        }}>
          <Share2 size={15} /> Share
        </button>
      </div>

      <div style={{ maxWidth: 560, margin: '0 auto', padding: '20px 16px' }}>

        {/* Alderman accountability card */}
        {alderman && (
          <div style={{
            background: 'var(--surface)', border: '1px solid var(--border)',
            borderRadius: 16, padding: '16px', marginBottom: 16,
            display: 'flex', alignItems: 'center', gap: 14,
            boxShadow: 'var(--shadow-card)',
          }}>
            <div style={{
              width: 56, height: 56, borderRadius: '50%', overflow: 'hidden',
              flexShrink: 0, background: 'var(--gradient)',
              border: '2px solid var(--border)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <img
                src={alderman.photo}
                alt={alderman.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
              />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--blue)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 2 }}>
                Ward {wardNum} Alderman
              </div>
              <div style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text)', fontFamily: 'var(--font-display)', marginBottom: 2 }}>
                {alderman.name}
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Must respond within 30 days</div>
            </div>
            <div style={{
              flexShrink: 0, background: 'var(--blue-soft)',
              borderRadius: 12, padding: '8px 12px', textAlign: 'center',
              border: '1px solid var(--blue-mid-soft)',
            }}>
              <div style={{ fontSize: '1.4rem', fontWeight: 900, color: days >= 30 ? 'var(--red)' : 'var(--blue)', fontFamily: 'var(--font-display)' }}>{days}</div>
              <div style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--blue)', textTransform: 'uppercase' }}>days</div>
            </div>
          </div>
        )}

        {/* Photo */}
        {report.photo_url && (
          <div style={{ borderRadius: 16, overflow: 'hidden', marginBottom: 16, border: '1px solid var(--border)' }}>
            <img src={report.photo_url} alt="Report photo" style={{ width: '100%', maxHeight: 280, objectFit: 'cover', display: 'block' }} />
          </div>
        )}

        {/* Me Too */}
        <div style={{
          background: 'var(--surface)',
          border: `2px solid ${metooPressed ? 'var(--blue)' : 'var(--border)'}`,
          borderRadius: 16, padding: '16px 20px', marginBottom: 16,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
          boxShadow: 'var(--shadow-card)',
        }}>
          <div>
            <div style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text)', fontFamily: 'var(--font-display)', marginBottom: 4 }}>
              {metooCount > 0
                ? `${metooCount} neighbor${metooCount !== 1 ? 's' : ''} agree${metooCount === 1 ? 's' : ''}`
                : 'Be the first to support this'}
            </div>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>More support = more pressure on alderman</div>
          </div>
          <button
            onClick={handleMetoo}
            disabled={metooPressed}
            style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
              background: metooPressed ? 'var(--blue)' : 'var(--blue-soft)',
              border: 'none', borderRadius: 14, padding: '12px 18px',
              cursor: metooPressed ? 'default' : 'pointer',
              transition: 'all 0.2s', flexShrink: 0,
            }}
          >
            <ThumbsUp size={22} color={metooPressed ? 'white' : 'var(--blue)'} />
            <span style={{ fontSize: '0.7rem', fontWeight: 800, color: metooPressed ? 'white' : 'var(--blue)' }}>Me Too!</span>
          </button>
        </div>

        {/* 30-day clock */}
        <DaysCounter createdAt={report.created_at} />

        {/* Details table */}
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16, overflow: 'hidden', marginBottom: 16, boxShadow: 'var(--shadow-card)' }}>
          {[
            ['Issue',   LABELS[report.category] ?? report.category],
            ['Ward',    `Ward ${wardNum ?? 'Unknown'} — Natchez, MS`],
            ['Filed',   new Date(report.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })],
            ['Support', `${metooCount} neighbor${metooCount !== 1 ? 's' : ''} supporting`],
            ['Status',  report.alderman_response ? '✅ Alderman Responded' : days >= 30 ? '🔴 Overdue' : '⏳ Awaiting Response'],
          ].map(([label, value], i, arr) => (
            <div key={label} style={{ display: 'flex', padding: '14px 18px', borderBottom: i < arr.length - 1 ? '1px solid var(--border)' : 'none' }}>
              <span style={{ fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.07em', color: 'var(--text-muted)', minWidth: 72 }}>{label}</span>
              <span style={{ fontSize: '0.9rem', color: 'var(--text)', flex: 1, fontWeight: 600 }}>{value}</span>
            </div>
          ))}
          {report.description && (
            <div style={{ padding: '14px 18px' }}>
              <span style={{ fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.07em', color: 'var(--text-muted)', display: 'block', marginBottom: 8 }}>Description</span>
              <span style={{ fontSize: '0.9rem', color: 'var(--text-sub)', fontStyle: 'italic', lineHeight: 1.7 }}>"{report.description}"</span>
            </div>
          )}
        </div>

        {/* Google Maps */}
        <a href={mapsUrl} target="_blank" rel="noreferrer" style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          background: 'var(--blue)', color: 'white', textDecoration: 'none',
          height: 56, borderRadius: 14, fontWeight: 700, fontSize: '0.95rem',
          marginBottom: 16, boxShadow: 'var(--shadow-accent)',
          fontFamily: 'var(--font-display)',
        }}>
          <MapPin size={18} /> View on Google Maps
        </a>

        {/* Alderman response */}
        {report.alderman_response && (
          <div style={{
            background: 'var(--green-soft)', border: '1px solid var(--green)',
            borderRadius: 16, padding: 20, marginBottom: 16,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <CheckCircle2 size={20} color="var(--green)" />
              <span style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--green)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
                Official Alderman Response
              </span>
            </div>
            <p style={{ fontSize: '1rem', color: 'var(--text)', lineHeight: 1.75, marginBottom: 10 }}>
              "{report.alderman_response}"
            </p>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Responded on {new Date(report.alderman_responded_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
        )}

        {/* Community Updates list */}
        {comments.length > 0 && (
          <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16, overflow: 'hidden', marginBottom: 16, boxShadow: 'var(--shadow-card)' }}>
            <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--text)', fontFamily: 'var(--font-display)' }}>💬 Community Updates</span>
              <span style={{ fontSize: '0.7rem', color: 'var(--blue)', background: 'var(--blue-soft)', padding: '2px 10px', borderRadius: 99, fontWeight: 700 }}>{comments.length}</span>
            </div>
            {comments.map((c, i) => (
              <div key={c.id} style={{ padding: '14px 18px', borderBottom: i < comments.length - 1 ? '1px solid var(--border)' : 'none' }}>
                {c.photo_url && (
                  <img src={c.photo_url} style={{ width: '100%', maxHeight: 180, objectFit: 'cover', borderRadius: 10, marginBottom: 10, display: 'block' }} alt="Update photo" />
                )}
                <p style={{ fontSize: '0.9rem', color: 'var(--text-sub)', margin: '0 0 6px', lineHeight: 1.65 }}>"{c.content}"</p>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: 0 }}>
                  {new Date(c.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Add community update */}
        {!report.alderman_response && (
          <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16, padding: 20, marginBottom: 16, boxShadow: 'var(--shadow-card)' }}>
            <div style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text)', fontFamily: 'var(--font-display)', marginBottom: 6 }}>
              Add a Community Update
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: 16, lineHeight: 1.6 }}>
              Have more info about this issue? Help your neighbors and the alderman.
            </p>

            {submitted ? (
              <div style={{ background: 'var(--green-soft)', border: '1px solid var(--green)', borderRadius: 12, padding: 16, textAlign: 'center' }}>
                <p style={{ color: 'var(--green)', fontWeight: 700, fontSize: '0.95rem' }}>✅ Update submitted. Thank you!</p>
              </div>
            ) : (
              <>
                {commentPhotoPreview && (
                  <div style={{ borderRadius: 10, overflow: 'hidden', marginBottom: 10, position: 'relative' }}>
                    <img src={commentPhotoPreview} style={{ width: '100%', maxHeight: 160, objectFit: 'cover', display: 'block' }} alt="Preview" />
                    <button
                      onClick={() => { setCommentPhoto(null); setCommentPhotoPreview(null); }}
                      style={{ position: 'absolute', top: 6, right: 6, background: 'rgba(0,0,0,0.55)', color: '#fff', border: 'none', borderRadius: '50%', width: 28, height: 28, cursor: 'pointer', fontSize: 16 }}
                    >×</button>
                  </div>
                )}
                <textarea
                  value={comment}
                  onChange={e => { setComment(e.target.value); setError(''); }}
                  placeholder="How long has this been here? Is it getting worse? Any other context..."
                  rows={4}
                  style={{
                    width: '100%', padding: '14px 16px', borderRadius: 12,
                    border: `1.5px solid ${error ? 'var(--red)' : 'var(--border)'}`,
                    fontSize: '0.9rem', lineHeight: 1.65, resize: 'none', outline: 'none',
                    color: 'var(--text)', fontFamily: 'var(--font-body)',
                    boxSizing: 'border-box', background: 'var(--bg)',
                  }}
                />
                {error && <p style={{ fontSize: '0.82rem', color: 'var(--red)', marginTop: 6 }}>{error}</p>}
                <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
                  {/* Photo upload */}
                  <label style={{
                    flex: '0 0 auto', height: 54, width: 54, borderRadius: 12,
                    background: 'var(--blue-soft)', border: '1px solid var(--blue)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                  }}>
                    <input
                      type="file"
                      accept="image/*"
                      style={{ display: 'none' }}
                      onChange={e => {
                        const f = e.target.files?.[0];
                        if (!f) return;
                        const img = new window.Image();
                        img.onload = () => {
                          const MAX = 1200;
                          let w = img.width, h = img.height;
                          if (w > MAX || h > MAX) { if (w > h) { h = Math.round(h * MAX / w); w = MAX; } else { w = Math.round(w * MAX / h); h = MAX; } }
                          const c = document.createElement('canvas');
                          c.width = w; c.height = h;
                          c.getContext('2d')!.drawImage(img, 0, 0, w, h);
                          c.toBlob(blob => {
                            if (!blob) return;
                            const compressed = new File([blob], 'photo.jpg', { type: 'image/jpeg' });
                            setCommentPhoto(compressed);
                            setCommentPhotoPreview(URL.createObjectURL(compressed));
                          }, 'image/jpeg', 0.75);
                        };
                        img.src = URL.createObjectURL(f);
                      }}
                    />
                    <svg viewBox="0 0 24 24" fill="none" stroke="var(--blue)" strokeWidth="2" width="22" height="22">
                      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                      <circle cx="12" cy="13" r="4" />
                    </svg>
                  </label>

                  <button
                    onClick={handleComment}
                    disabled={submitting}
                    style={{
                      flex: 1, height: 54, borderRadius: 12, fontWeight: 800, fontSize: '0.95rem',
                      color: 'white', background: 'var(--blue)', border: 'none', cursor: 'pointer',
                      opacity: submitting ? 0.7 : 1, fontFamily: 'var(--font-display)',
                      boxShadow: 'var(--shadow-accent)',
                    }}
                  >
                    {submitting ? 'Submitting...' : 'Submit Update'}
                  </button>
                </div>
              </>
            )}
          </div>
        )}

        <p style={{ textAlign: 'center', fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 8 }}>
          We The People 39120 · Built by KlickifyAgency.com
        </p>
      </div>
    </div>
  );
}
