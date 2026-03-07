'use client';
import { useEffect, useState } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import Link from 'next/link';
import { Bell } from 'lucide-react';

const ALDERMEN: Record<number, { name: string; initial: string; photo: string }> = {
  1: { name: 'Valencia Hall', initial: 'VH', photo: 'https://natchez.ms.us/ImageRepository/Document?documentId=1411' },
  2: { name: 'Billie Joe Frazier', initial: 'BF', photo: 'https://natchez.ms.us/ImageRepository/Document?documentId=1406' },
  3: { name: 'Sarah Carter-Smith', initial: 'SC', photo: 'https://natchez.ms.us/ImageRepository/Document?documentId=1410' },
  4: { name: 'Felicia Bridgewater-Irving', initial: 'FB', photo: 'https://natchez.ms.us/ImageRepository/Document?documentId=1408' },
  5: { name: 'Benjamin Davis', initial: 'BD', photo: 'https://natchez.ms.us/ImageRepository/Document?documentId=1405' },
  6: { name: 'Curtis Moroney', initial: 'CM', photo: 'https://natchez.ms.us/ImageRepository/Document?documentId=1407' },
};

const LABELS: Record<string,string> = {
  graffiti:'Graffiti', dumping:'Illegal Dumping', abandoned_vehicle:'Abandoned Vehicle',
  property_neglect:'Property Neglect', noise:'Noise', street_issues:'Street Issues',
  vegetation:'Vegetation', animal:'Animal', safety_hazard:'Safety Hazard',
  water_drainage:'Water/Drainage', public_safety:'Public Safety',
};

const STATUS_COLOR: Record<string,string> = {
  pending:'#d97706', confirmed:'#2563eb', in_progress:'#7c3aed',
  resolved:'#16a34a', ignored:'#dc2626',
};

export default function NotificationsPage() {
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<Record<number,boolean>>({1:true,2:true,3:true,4:true,5:true,6:true});

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    supabase.from('reports')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50)
      .then(({ data }) => { setReports(data ?? []); setLoading(false); });
  }, []);

  const timeAgo = (ts: string) => {
    const d = Math.floor((Date.now() - new Date(ts).getTime()) / 1000);
    if (d < 60) return 'just now';
    if (d < 3600) return `${Math.floor(d/60)}m ago`;
    if (d < 86400) return `${Math.floor(d/3600)}h ago`;
    return `${Math.floor(d/86400)}d ago`;
  };

  // Group by ward
  const byWard: Record<number, any[]> = {1:[],2:[],3:[],4:[],5:[],6:[]};
  const noWard: any[] = [];
  for (const r of reports) {
    if (r.ward_number && byWard[r.ward_number]) byWard[r.ward_number].push(r);
    else noWard.push(r);
  }

  return (
    <div style={{minHeight:'100vh',paddingBottom:96,background:'var(--color-bg)'}}>
      {/* Header */}
      <div style={{position:'sticky',top:0,zIndex:50,padding:'48px 16px 12px',display:'flex',alignItems:'center',gap:12,background:'rgba(255,255,255,0.95)',backdropFilter:'blur(20px)',borderBottom:'1px solid var(--color-border)'}}>
        <Link href="/" style={{color:'var(--color-accent)',display:'flex'}}>
          <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22"><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/></svg>
        </Link>
        <h1 style={{fontSize:18,fontWeight:800,color:'var(--color-text)',margin:0}}>Community Activity</h1>
        <div style={{marginLeft:'auto',display:'flex',alignItems:'center',gap:6,padding:'3px 10px',borderRadius:99,background:'#f0fdf4',border:'1px solid #bbf7d0'}}>
          <div style={{width:7,height:7,borderRadius:'50%',background:'#16a34a',animation:'pulse 2s infinite'}}/>
          <span style={{fontSize:10,fontWeight:700,color:'#16a34a',letterSpacing:'0.05em'}}>LIVE</span>
        </div>
        <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.4}}`}</style>
      </div>

      {loading ? (
        <div style={{display:'flex',justifyContent:'center',paddingTop:80}}>
          <div style={{width:36,height:36,border:'3px solid rgba(26,94,168,0.2)',borderTop:'3px solid #1A5EA8',borderRadius:'50%',animation:'spin 1s linear infinite'}}/>
          <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
        </div>
      ) : reports.length === 0 ? (
        <div style={{display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',paddingTop:80,gap:12}}>
          <Bell size={40} color="#9ca3af"/>
          <p style={{color:'#6b7280',fontSize:14}}>No reports yet</p>
        </div>
      ) : (
        <div style={{paddingBottom:8}}>
          <div style={{padding:'10px 16px 4px',fontSize:11,color:'var(--color-text-muted)',fontWeight:600,letterSpacing:'0.05em',textTransform:'uppercase'}}>
            {reports.length} report{reports.length!==1?'s':''} across all wards
          </div>

          {([1,2,3,4,5,6] as const).map(ward => {
            const wardReports = byWard[ward];
            if (wardReports.length === 0) return null;
            const alderman = ALDERMEN[ward];
            const resolved = wardReports.filter(r => r.status === 'resolved').length;
            const ignored = wardReports.filter(r => r.status === 'ignored').length;
            const pending = wardReports.filter(r => r.status !== 'resolved' && r.status !== 'ignored').length;
            const resolvedPct = Math.round((resolved / wardReports.length) * 100);
            const isOpen = expanded[ward] !== false;

            return (
              <div key={ward} style={{marginBottom:2}}>
                {/* Ward Header */}
                <button
                  onClick={() => setExpanded(e => ({...e, [ward]: !isOpen}))}
                  style={{width:'100%',display:'flex',alignItems:'center',gap:12,padding:'12px 16px',background:'var(--color-surface)',border:'none',borderBottom:'1px solid var(--color-border)',borderTop:'1px solid var(--color-border)',cursor:'pointer',textAlign:'left'}}>
                  {/* Photo */}
                  <div style={{width:46,height:46,borderRadius:'50%',overflow:'hidden',flexShrink:0,background:'linear-gradient(135deg,#1A5EA8,#2D7A4F)',display:'flex',alignItems:'center',justifyContent:'center',border:'2px solid #e5e7eb'}}>
                    <img src={alderman.photo} alt={alderman.name} style={{width:'100%',height:'100%',objectFit:'cover'}}
                      onError={(e)=>{(e.target as HTMLImageElement).style.display='none';}} />
                  </div>
                  {/* Info */}
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{display:'flex',alignItems:'center',gap:6,marginBottom:2}}>
                      <span style={{fontWeight:800,fontSize:14,color:'var(--color-text)'}}>Ward {ward}</span>
                      <span style={{fontSize:11,color:'#6b7280',background:'#f3f4f6',padding:'1px 8px',borderRadius:99,fontWeight:600}}>{wardReports.length} report{wardReports.length!==1?'s':''}</span>
                    </div>
                    <div style={{fontSize:12,color:'#6b7280',marginBottom:4}}>{alderman.name}</div>
                    <div style={{display:'flex',gap:8,flexWrap:'wrap'}}>
                      <span style={{fontSize:11,color:'#16a34a',fontWeight:600}}>✓ {resolved} resolved ({resolvedPct}%)</span>
                      {ignored > 0 && <span style={{fontSize:11,color:'#dc2626',fontWeight:600}}>✗ {ignored} ignored</span>}
                      {pending > 0 && <span style={{fontSize:11,color:'#d97706',fontWeight:600}}>⏳ {pending} pending</span>}
                    </div>
                  </div>
                  {/* Chevron */}
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2.5" style={{flexShrink:0,transform:isOpen?'rotate(180deg)':'rotate(0deg)',transition:'transform 0.2s'}}>
                    <polyline points="6 9 12 15 18 9"/>
                  </svg>
                </button>

                {/* Report cards */}
                {isOpen && (
                  <div style={{padding:'8px 12px',display:'flex',flexDirection:'column',gap:8,background:'#fafafa'}}>
                    {wardReports.map(r => (
                      <Link key={r.id} href={`/report/${r.id}`}
                        style={{display:'flex',gap:12,padding:'12px 14px',borderRadius:14,background:'#fff',border:'1px solid #e5e7eb',textDecoration:'none',boxShadow:'0 1px 3px rgba(0,0,0,0.06)'}}>
                        {/* Photo or icon */}
                        <div style={{width:52,height:52,borderRadius:10,overflow:'hidden',flexShrink:0,background:'#f3f4f6',display:'flex',alignItems:'center',justifyContent:'center'}}>
                          {r.photo_url
                            ? <img src={r.photo_url} alt="" style={{width:'100%',height:'100%',objectFit:'cover'}}/>
                            : <span style={{fontSize:22}}>📍</span>}
                        </div>
                        <div style={{flex:1,minWidth:0}}>
                          <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',gap:4,marginBottom:3}}>
                            <span style={{fontSize:12,fontWeight:700,color:'#1A5EA8'}}>{LABELS[r.category] ?? r.category}</span>
                            <span style={{fontSize:10,color:'#9ca3af',flexShrink:0}}>{timeAgo(r.created_at)}</span>
                          </div>
                          <p style={{fontSize:13,fontWeight:600,color:'var(--color-text)',margin:'0 0 4px',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{r.description || 'No description'}</p>
                          <span style={{fontSize:11,fontWeight:600,color:STATUS_COLOR[r.status]??'#6b7280',background:`${STATUS_COLOR[r.status]??'#6b7280'}15`,padding:'2px 8px',borderRadius:99,textTransform:'capitalize'}}>{r.status}</span>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          })}

          {/* Unassigned */}
          {noWard.length > 0 && (
            <div style={{marginTop:2}}>
              <div style={{padding:'12px 16px',background:'var(--color-surface)',borderTop:'1px solid var(--color-border)',borderBottom:'1px solid var(--color-border)',fontSize:13,fontWeight:700,color:'#6b7280'}}>
                Unassigned ({noWard.length})
              </div>
              <div style={{padding:'8px 12px',display:'flex',flexDirection:'column',gap:8,background:'#fafafa'}}>
                {noWard.map(r => (
                  <Link key={r.id} href={`/report/${r.id}`}
                    style={{display:'flex',gap:12,padding:'12px 14px',borderRadius:14,background:'#fff',border:'1px solid #e5e7eb',textDecoration:'none'}}>
                    <div style={{width:52,height:52,borderRadius:10,overflow:'hidden',flexShrink:0,background:'#f3f4f6',display:'flex',alignItems:'center',justifyContent:'center'}}>
                      {r.photo_url ? <img src={r.photo_url} alt="" style={{width:'100%',height:'100%',objectFit:'cover'}}/> : <span style={{fontSize:22}}>📍</span>}
                    </div>
                    <div style={{flex:1,minWidth:0}}>
                      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',gap:4,marginBottom:3}}>
                        <span style={{fontSize:12,fontWeight:700,color:'#1A5EA8'}}>{LABELS[r.category] ?? r.category}</span>
                        <span style={{fontSize:10,color:'#9ca3af'}}>{timeAgo(r.created_at)}</span>
                      </div>
                      <p style={{fontSize:13,fontWeight:600,color:'var(--color-text)',margin:'0 0 4px',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{r.description || 'No description'}</p>
                      <span style={{fontSize:11,fontWeight:600,color:STATUS_COLOR[r.status]??'#6b7280',padding:'2px 8px',borderRadius:99,textTransform:'capitalize',background:`${STATUS_COLOR[r.status]??'#6b7280'}15`}}>{r.status}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
