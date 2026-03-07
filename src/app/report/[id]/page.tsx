'use client';
import { useEffect, useState } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { ThumbsUp, MapPin, CheckCircle2, Loader2 } from 'lucide-react';

const C = { bg:'#F7F9FC',white:'#FFFFFF',border:'#DDE3EC',blue:'#1A5EA8',blueSoft:'#EBF2FB',green:'#2D7A4F',greenSoft:'#E8F5EE',amber:'#B45309',textMain:'#0F172A',textSub:'#475569',textMuted:'#94A3B8',danger:'#DC2626' };
const LABELS: Record<string,string> = { graffiti:'Graffiti / Vandalism',dumping:'Illegal Dumping',abandoned_vehicle:'Abandoned Vehicle',property_neglect:'Property Neglect',noise:'Noise Complaint',street_issues:'Street / Pothole Issues',vegetation:'Overgrown Vegetation',animal:'Animal Issues',safety_hazard:'Safety Hazard',water_drainage:'Water / Drainage',public_safety:'Public Safety / Crime' };

const ALDERMEN: Record<number, { name: string; initial: string; photo: string }> = {
  1: { name: 'Valencia Hall', initial: 'VH', photo: 'https://natchez.ms.us/ImageRepository/Document?documentId=1411' },
  2: { name: 'Billie Joe Frazier', initial: 'BF', photo: 'https://natchez.ms.us/ImageRepository/Document?documentId=1406' },
  3: { name: 'Sarah Carter-Smith', initial: 'SC', photo: 'https://natchez.ms.us/ImageRepository/Document?documentId=1410' },
  4: { name: 'Felicia Bridgewater-Irving', initial: 'FB', photo: 'https://natchez.ms.us/ImageRepository/Document?documentId=1408' },
  5: { name: 'Benjamin Davis', initial: 'BD', photo: 'https://natchez.ms.us/ImageRepository/Document?documentId=1405' },
  6: { name: 'Curtis Moroney', initial: 'CM', photo: 'https://natchez.ms.us/ImageRepository/Document?documentId=1407' },
};

function DaysCounter({ createdAt }: { createdAt: string }) {
  const days = Math.floor((Date.now() - new Date(createdAt).getTime()) / 86400000);
  const remaining = 30 - days;
  const pct = Math.min((days / 30) * 100, 100);
  const color = days < 10 ? C.green : days < 20 ? C.amber : C.danger;
  return (
    <div style={{background:C.white,border:`1px solid ${C.border}`,borderRadius:16,padding:'18px 20px',marginBottom:16}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:10}}>
        <span style={{fontSize:12,fontWeight:700,color:C.textMuted,textTransform:'uppercase',letterSpacing:'0.08em'}}>30-Day Response Clock</span>
        <span style={{fontSize:13,fontWeight:800,color}}>{days < 30 ? `Day ${days} of 30` : 'Overdue'}</span>
      </div>
      <div style={{height:8,background:C.border,borderRadius:100,overflow:'hidden',marginBottom:8}}>
        <div style={{height:'100%',width:`${pct}%`,background:color,borderRadius:100,transition:'width 0.5s ease'}} />
      </div>
      <p style={{fontSize:12,color:C.textMuted}}>{remaining > 0 ? `${remaining} days remaining before flagged as Pending Resolution` : 'Exceeded 30 days — flagged as Pending Resolution'}</p>
    </div>
  );
}

export default function ReportPage({ params }: { params: any }) {
  const [report, setReport] = useState<any>(null);
  const [reportId, setReportId] = useState('');
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [metooCount, setMetooCount] = useState(0);
  const [metooLoading, setMetooLoading] = useState(false);
  const [metooPressed, setMetooPressed] = useState(false);

  const supabase = createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

  useEffect(() => {
    Promise.resolve(params).then(p => {
      setReportId(p.id);
      const key = `metoo_${p.id}`;
      if (typeof window !== 'undefined' && localStorage.getItem(key) === '1') {
        setMetooPressed(true);
      }
    });
  }, []);

  useEffect(() => {
    if (!reportId) return;
    supabase.from('reports').select('*, ward:wards(ward_number)').eq('id', reportId).single()
      .then(({ data }) => { setReport(data); setMetooCount(data?.me_too_count ?? 0); });
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

  const handleComment = async () => {
    if (comment.trim().length < 5) { setError('Please write at least 5 characters.'); return; }
    setSubmitting(true);
    await supabase.from('reports').update({ community_comment: comment }).eq('id', reportId);
    setSubmitted(true); setSubmitting(false);
  };

  if (!report) return (
    <div style={{minHeight:'100vh',background:C.bg,display:'flex',alignItems:'center',justifyContent:'center',flexDirection:'column',gap:12}}>
      <Loader2 size={36} color={C.blue} className="animate-spin" />
      <p style={{color:C.textMuted,fontSize:14}}>Loading report...</p>
    </div>
  );

  const days = Math.floor((Date.now() - new Date(report.created_at).getTime()) / 86400000);
  const mapsUrl = `https://maps.google.com/?q=${report.lat},${report.lng}`;

  return (
    <div style={{minHeight:'100vh',background:C.bg,fontFamily:'-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif',paddingBottom:100}}>
      <div style={{background:`linear-gradient(135deg,${C.blue},${C.green})`,padding:'44px 20px 24px',textAlign:'center'}}>
        <div style={{display:'inline-block',background:'rgba(255,255,255,0.2)',borderRadius:100,padding:'4px 14px',fontSize:11,fontWeight:700,color:'white',letterSpacing:'0.08em',textTransform:'uppercase',marginBottom:10}}>Community Report</div>
        <h1 style={{fontSize:22,fontWeight:900,color:'white',marginBottom:4}}>{LABELS[report.category] ?? report.category}</h1>
        <p style={{fontSize:13,color:'rgba(255,255,255,0.8)'}}>#{reportId.slice(0,8).toUpperCase()} · Natchez, MS 39120</p>
      </div>

      <div style={{maxWidth:560,margin:'0 auto',padding:'20px 16px'}}>

        {/* Alderman Card */}
        {(() => {
          const wardNum = report.ward_number ?? report.ward?.ward_number;
          const alderman = wardNum ? ALDERMEN[Number(wardNum)] : null;
          if (!alderman) return null;
          return (
            <div style={{background:'#fff',border:'1px solid #e5e7eb',borderRadius:16,padding:'14px 16px',marginBottom:16,display:'flex',alignItems:'center',gap:14,boxShadow:'0 2px 8px rgba(26,94,168,0.08)'}}>
              <div style={{width:56,height:56,borderRadius:'50%',overflow:'hidden',flexShrink:0,background:'linear-gradient(135deg,#1A5EA8,#2D7A4F)',border:'2px solid #e5e7eb',display:'flex',alignItems:'center',justifyContent:'center'}}>
                <img src={alderman.photo} alt={alderman.name} style={{width:'100%',height:'100%',objectFit:'cover'}} onError={(e)=>{(e.target as HTMLImageElement).style.display='none';}} />
              </div>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontSize:10,fontWeight:700,color:'#1A5EA8',textTransform:'uppercase',letterSpacing:'0.08em',marginBottom:2}}>Ward {wardNum} Alderman</div>
                <div style={{fontSize:15,fontWeight:800,color:'#0F172A',marginBottom:2}}>{alderman.name}</div>
                <div style={{fontSize:12,color:'#6b7280'}}>Responsible for responding within 30 days</div>
              </div>
              <div style={{flexShrink:0,background:'#EBF2FB',borderRadius:10,padding:'6px 10px',textAlign:'center'}}>
                <div style={{fontSize:18,fontWeight:900,color:'#1A5EA8'}}>{Math.floor((Date.now() - new Date(report.created_at).getTime()) / 86400000)}</div>
                <div style={{fontSize:9,fontWeight:700,color:'#1A5EA8',textTransform:'uppercase'}}>days</div>
              </div>
            </div>
          );
        })()}


        {report.photo_url && (
          <div style={{borderRadius:16,overflow:'hidden',marginBottom:16,border:`1px solid ${C.border}`}}>
            <img src={report.photo_url} alt="Report photo" style={{width:'100%',maxHeight:280,objectFit:'cover',display:'block'}} />
          </div>
        )}

        <div style={{background:C.white,border:`2px solid ${metooPressed ? C.blue : C.border}`,borderRadius:16,padding:'16px 20px',marginBottom:16,display:'flex',alignItems:'center',justifyContent:'space-between',gap:12}}>
          <div>
            <div style={{fontSize:15,fontWeight:800,color:C.textMain,marginBottom:2}}>
              {metooCount > 0 ? `${metooCount} neighbor${metooCount !== 1 ? 's' : ''} agree${metooCount === 1 ? 's' : ''}` : 'Be the first to support this report'}
            </div>
            <div style={{fontSize:13,color:C.textMuted}}>Tap to add your voice — more support means more pressure</div>
          </div>
          <button onClick={handleMetoo} disabled={metooPressed}
            style={{display:'flex',flexDirection:'column',alignItems:'center',gap:4,background:metooPressed ? C.blue : C.blueSoft,border:'none',borderRadius:14,padding:'12px 16px',cursor:metooPressed ? 'default' : 'pointer',transition:'all 0.2s',flexShrink:0}}>
            <ThumbsUp size={22} color={metooPressed ? 'white' : C.blue} />
            <span style={{fontSize:11,fontWeight:800,color:metooPressed ? 'white' : C.blue}}>Me Too!</span>
          </button>
        </div>

        <DaysCounter createdAt={report.created_at} />

        <div style={{background:C.white,border:`1px solid ${C.border}`,borderRadius:16,overflow:'hidden',marginBottom:16}}>
          {[
            ['Issue', LABELS[report.category] ?? report.category],
            ['Ward', `Ward ${report.ward_number ?? report.ward?.ward_number ?? 'Unknown'} — Natchez, MS`],
            ['Filed', new Date(report.created_at).toLocaleDateString('en-US',{year:'numeric',month:'long',day:'numeric'})],
            ['Support', `${metooCount} neighbor${metooCount !== 1 ? 's' : ''} supporting`],
            ['Status', report.alderman_response ? '✅ Alderman Responded' : days >= 30 ? '🔴 Pending Resolution' : '⏳ Awaiting Response'],
          ].map(([label, value]) => (
            <div key={label} style={{display:'flex',padding:'13px 16px',borderBottom:`1px solid ${C.border}`}}>
              <span style={{fontSize:11,fontWeight:800,textTransform:'uppercase',letterSpacing:'0.06em',color:C.textMuted,minWidth:80}}>{label}</span>
              <span style={{fontSize:14,color:C.textMain,flex:1,fontWeight:600}}>{value}</span>
            </div>
          ))}
          {report.description && (
            <div style={{padding:'13px 16px'}}>
              <span style={{fontSize:11,fontWeight:800,textTransform:'uppercase',letterSpacing:'0.06em',color:C.textMuted,display:'block',marginBottom:6}}>Description</span>
              <span style={{fontSize:14,color:C.textSub,fontStyle:'italic'}}>"{report.description}"</span>
            </div>
          )}
        </div>

        <a href={mapsUrl} target="_blank" rel="noreferrer"
          style={{display:'flex',alignItems:'center',justifyContent:'center',gap:8,background:C.blue,color:'white',textDecoration:'none',height:52,borderRadius:14,fontWeight:700,fontSize:15,marginBottom:16,boxShadow:'0 4px 16px rgba(26,94,168,0.3)'}}>
          <MapPin size={18} /> View Location on Google Maps
        </a>

        {report.alderman_response ? (
          <div style={{background:C.greenSoft,border:`1px solid ${C.green}`,borderRadius:16,padding:20,marginBottom:16}}>
            <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:12}}>
              <CheckCircle2 size={20} color={C.green} />
              <span style={{fontSize:13,fontWeight:800,color:C.green,textTransform:'uppercase',letterSpacing:'0.06em'}}>Official Alderman Response</span>
            </div>
            <p style={{fontSize:15,color:C.textMain,lineHeight:1.75,marginBottom:10}}>"{report.alderman_response}"</p>
            <p style={{fontSize:12,color:C.textMuted}}>Responded on {new Date(report.alderman_responded_at).toLocaleDateString('en-US',{year:'numeric',month:'long',day:'numeric'})}</p>
          </div>
        ) : (
          <div style={{background:C.white,border:`1px solid ${C.border}`,borderRadius:16,padding:20,marginBottom:16}}>
            <div style={{fontSize:15,fontWeight:800,color:C.textMain,marginBottom:6}}>Community Update</div>
            <p style={{fontSize:13,color:C.textMuted,marginBottom:14,lineHeight:1.6}}>Have additional info about this issue? Help your neighbors and the alderman.</p>
            {submitted ? (
              <div style={{background:C.greenSoft,border:`1px solid ${C.green}`,borderRadius:12,padding:16,textAlign:'center'}}>
                <p style={{color:C.green,fontWeight:700}}>✅ Update submitted. Thank you!</p>
              </div>
            ) : (
              <>
                <textarea value={comment} onChange={e => { setComment(e.target.value); setError(''); }}
                  placeholder="How long has this been here? Is it getting worse? Any other context..."
                  rows={4}
                  style={{width:'100%',padding:'14px 16px',borderRadius:12,border:`1.5px solid ${error ? C.danger : C.border}`,fontSize:14,lineHeight:1.65,resize:'none',outline:'none',color:C.textMain,fontFamily:'inherit',boxSizing:'border-box',background:C.bg}} />
                {error && <p style={{fontSize:13,color:C.danger,marginTop:6}}>{error}</p>}
                <button onClick={handleComment} disabled={submitting}
                  style={{width:'100%',height:48,marginTop:10,borderRadius:12,fontWeight:700,fontSize:15,color:'white',background:C.blue,border:'none',cursor:'pointer',opacity:submitting?0.7:1}}>
                  {submitting ? 'Submitting...' : 'Submit Community Update'}
                </button>
              </>
            )}
          </div>
        )}

        <p style={{textAlign:'center',fontSize:12,color:C.textMuted,marginTop:8}}>We The People 39120 · Built by KlickifyAgency.com</p>
      </div>
    </div>
  );
}
