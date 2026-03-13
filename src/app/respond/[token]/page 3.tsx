'use client';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { CheckCircle2, Loader2, ShieldCheck, AlertTriangle } from 'lucide-react';
const C = { bg:'#F7F9FC',white:'#FFFFFF',border:'#DDE3EC',blue:'#1A5EA8',blueSoft:'#EBF2FB',green:'#2D7A4F',greenSoft:'#E8F5EE',textMain:'#0F172A',textSub:'#475569',textMuted:'#94A3B8',danger:'#DC2626',dangerSoft:'#FEE2E2' };
const LABELS: Record<string,string> = { graffiti:'Graffiti / Vandalism',dumping:'Illegal Dumping',abandoned_vehicle:'Abandoned Vehicle',property_neglect:'Property Neglect',noise:'Noise Complaint',street_issues:'Street / Pothole Issues',vegetation:'Overgrown Vegetation',animal:'Animal Issues',safety_hazard:'Safety Hazard',water_drainage:'Water / Drainage Problem',public_safety:'Public Safety Concern' };
const ALDERMEN: Record<number,string> = {1:'Valencia Hall',2:'Billie Joe Frazier',3:'Sarah Carter-Smith',4:'Felicia Bridgewater-Irving',5:'Benjamin Davis',6:'Curtis Moroney'};
export default function RespondPage() {
  const params = useParams();
  const token = params?.token as string;
  const [report, setReport] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [invalid, setInvalid] = useState(false);
  const [response, setResponse] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  useEffect(() => {
    if (!token) return;
    fetch(`/api/v1/respond?token=${token}`)
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (!data) setInvalid(true);
        else { setReport(data); if (data.alderman_response) setSubmitted(true); }
        setLoading(false);
      })
      .catch(() => { setInvalid(true); setLoading(false); });
  }, [token]);
  const handleSubmit = async () => {
    if (!response.trim()) { setError('Please write a response before submitting.'); return; }
    setSubmitting(true);
    const res = await fetch('/api/v1/respond', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, response }),
    });
    if (!res.ok) { setError('Something went wrong. Please try again.'); setSubmitting(false); return; }
    setSubmitted(true); setSubmitting(false);
  };
  if (loading) return <div style={{minHeight:'100vh',background:C.bg,display:'flex',alignItems:'center',justifyContent:'center'}}><Loader2 size={40} color={C.blue} /></div>;
  if (invalid) return (
    <div style={{minHeight:'100vh',background:C.bg,display:'flex',alignItems:'center',justifyContent:'center',padding:24}}>
      <div style={{maxWidth:400,textAlign:'center'}}>
        <div style={{width:80,height:80,borderRadius:'50%',background:C.dangerSoft,display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 20px'}}><AlertTriangle size={40} color={C.danger} /></div>
        <h2 style={{fontSize:22,fontWeight:900,color:C.textMain,marginBottom:10}}>Invalid or Expired Link</h2>
        <p style={{fontSize:15,color:C.textSub,lineHeight:1.7}}>This response link is not valid. Contact <a href="mailto:support@klickifyagency.com" style={{color:C.blue}}>support@klickifyagency.com</a> if you need assistance.</p>
      </div>
    </div>
  );
  if (submitted) return (
    <div style={{minHeight:'100vh',background:C.bg,display:'flex',alignItems:'center',justifyContent:'center',padding:24}}>
      <div style={{maxWidth:440,textAlign:'center'}}>
        <div style={{width:88,height:88,borderRadius:'50%',background:C.green,display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 24px',boxShadow:'0 8px 32px rgba(45,122,79,0.3)'}}><CheckCircle2 size={48} color="#fff" /></div>
        <h2 style={{fontSize:24,fontWeight:900,color:C.textMain,marginBottom:12}}>Response Published!</h2>
        <p style={{fontSize:15,color:C.textSub,lineHeight:1.75}}>The official response from <strong>{ALDERMEN[report?.ward_number] ?? 'Alderman'}</strong> (Ward {report?.ward_number}) is now visible to all Natchez residents.</p>
        {report?.alderman_response && <div style={{marginTop:24,padding:'16px 20px',background:C.greenSoft,borderRadius:14,border:`1px solid ${C.green}`,textAlign:'left'}}><div style={{fontSize:11,fontWeight:800,color:C.green,textTransform:'uppercase',letterSpacing:'0.08em',marginBottom:8}}>Your Response</div><p style={{fontSize:14,color:C.textSub,lineHeight:1.7,fontStyle:'italic'}}>"{report.alderman_response}"</p></div>}
      </div>
    </div>
  );
  return (
    <div style={{minHeight:'100vh',background:C.bg,paddingBottom:60,fontFamily:'-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif'}}>
      <div style={{background:'linear-gradient(135deg,#1A5EA8,#2D7A4F)',padding:'36px 24px 28px',textAlign:'center'}}>
        <div style={{textAlign:'center',marginBottom:16}}>
          <span style={{fontSize:28,fontWeight:900,color:'#ffffff',fontFamily:'Georgia,serif'}}>We The People</span><br/>
          <span style={{fontSize:22,fontWeight:900,color:'#ffffff',letterSpacing:4,fontFamily:'Georgia,serif'}}>39120</span>
        </div>
        <div style={{display:'inline-flex',alignItems:'center',gap:8,background:'rgba(255,255,255,0.15)',borderRadius:100,padding:'6px 16px',marginBottom:12}}>
          <ShieldCheck size={16} color="white" />
          <span style={{color:'white',fontWeight:700,fontSize:13}}>Official Alderman Portal — Private</span>
        </div>
        <h1 style={{color:'white',fontSize:20,fontWeight:800,lineHeight:1.4}}>Official Response Portal<br/><span style={{fontSize:16,opacity:0.9}}>{ALDERMEN[report?.ward_number] ?? 'Alderman'} — Ward {report?.ward_number}</span></h1>
      </div>
      <div style={{maxWidth:560,margin:'0 auto',padding:'24px 20px'}}>
        <div style={{background:C.white,borderRadius:16,border:`1px solid ${C.border}`,overflow:'hidden',marginBottom:20}}>
          <div style={{padding:'12px 16px',background:C.blueSoft,borderBottom:`1px solid ${C.border}`}}><span style={{fontSize:11,fontWeight:800,color:C.blue,textTransform:'uppercase',letterSpacing:'0.08em'}}>Report Summary</span></div>
          {[['Issue',LABELS[report?.category]??report?.category],['Ward',`Ward ${report?.ward_number} — Natchez, MS`],['Filed',report?.created_at?new Date(report.created_at).toLocaleDateString('en-US',{year:'numeric',month:'long',day:'numeric'}):'-'],['Status',report?.status??'Pending']].map(([label,value])=>(
            <div key={label} style={{display:'flex',padding:'12px 16px',borderBottom:`1px solid ${C.border}`}}>
              <div style={{fontSize:11,fontWeight:800,color:C.textMuted,textTransform:'uppercase',letterSpacing:'0.06em',minWidth:80}}>{label}</div>
              <div style={{fontSize:14,fontWeight:600,color:C.textMain,flex:1}}>{value}</div>
            </div>
          ))}
          {report?.description&&<div style={{padding:'12px 16px'}}><div style={{fontSize:11,fontWeight:800,color:C.textMuted,textTransform:'uppercase',letterSpacing:'0.06em',marginBottom:6}}>Description</div><p style={{fontSize:14,color:C.textSub,lineHeight:1.7,fontStyle:'italic'}}>"{report.description}"</p></div>}
        </div>
        <div style={{background:'#FEF3C7',border:'1px solid #FCD34D',borderRadius:12,padding:'14px 16px',marginBottom:20,display:'flex',gap:10,alignItems:'flex-start'}}>
          <ShieldCheck size={18} color="#92400E" style={{flexShrink:0,marginTop:2}} />
          <p style={{fontSize:13,color:'#78350F',lineHeight:1.6}}><strong>This link is private and exclusive to you.</strong> Your response will be posted publicly. Do not share this link.</p>
        </div>
        <div style={{background:C.white,borderRadius:16,border:`1px solid ${C.border}`,padding:20,marginBottom:16}}>
          <div style={{fontSize:16,fontWeight:800,color:C.textMain,marginBottom:6}}>Your Official Response</div>
          <p style={{fontSize:13,color:C.textMuted,marginBottom:14,lineHeight:1.6}}>Be specific about what action you will take and a timeline when possible.</p>
          <textarea value={response} onChange={e=>{setResponse(e.target.value);setError('');}}
            placeholder="Example: Thank you for bringing this to my attention. I have contacted Public Works and scheduled an inspection for this week..."
            rows={6} style={{width:'100%',padding:'14px 16px',borderRadius:12,border:`1.5px solid ${error?C.danger:C.border}`,fontSize:15,lineHeight:1.65,resize:'none',outline:'none',color:C.textMain,fontFamily:'inherit',boxSizing:'border-box'}} />
          {error&&<p style={{fontSize:13,color:C.danger,marginTop:8}}>{error}</p>}
        </div>
        <button onClick={handleSubmit} disabled={submitting||!response.trim()}
          style={{width:'100%',height:58,borderRadius:16,fontWeight:800,fontSize:17,color:'white',background:C.green,border:'none',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',gap:8,boxShadow:'0 4px 20px rgba(45,122,79,0.3)',opacity:submitting||!response.trim()?0.5:1}}>
          {submitting?'Publishing…':'Publish Official Response'}
        </button>
      </div>
    </div>
  );
}
