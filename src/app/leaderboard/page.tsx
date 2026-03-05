'use client';
import { useEffect, useState } from 'react';
import { createBrowserClient } from '@supabase/ssr';
const C = {bg:'#F7F9FC',white:'#FFFFFF',border:'#DDE3EC',blue:'#1A5EA8',blueSoft:'#EBF2FB',green:'#2D7A4F',greenSoft:'#E8F5EE',textMain:'#0F172A',textSub:'#475569',textMuted:'#94A3B8'};

const Gold = () => <svg viewBox="0 0 24 24" width="22" height="22" fill="none"><circle cx="12" cy="12" r="10" fill="#F59E0B" stroke="#D97706" strokeWidth="1.5"/><text x="12" y="17" textAnchor="middle" fontSize="13" fontWeight="900" fill="white">1</text></svg>;
const Silver = () => <svg viewBox="0 0 24 24" width="22" height="22" fill="none"><circle cx="12" cy="12" r="10" fill="#94A3B8" stroke="#64748B" strokeWidth="1.5"/><text x="12" y="17" textAnchor="middle" fontSize="13" fontWeight="900" fill="white">2</text></svg>;
const Bronze = () => <svg viewBox="0 0 24 24" width="22" height="22" fill="none"><circle cx="12" cy="12" r="10" fill="#B45309" stroke="#92400E" strokeWidth="1.5"/><text x="12" y="17" textAnchor="middle" fontSize="13" fontWeight="900" fill="white">3</text></svg>;
const TrophyIcon = () => <svg viewBox="0 0 24 24" width="40" height="40" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9H3.5a2.5 2.5 0 0 0 0 5H6"/><path d="M18 9h2.5a2.5 2.5 0 0 1 0 5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></svg>;
const StarIcon = () => <svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="#94A3B8" strokeWidth="1.5"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>;
const ShieldIcon = () => <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="#2D7A4F" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>;
const FlagIcon = () => <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="#6366F1" strokeWidth="2"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/></svg>;
const ClipboardIcon = () => <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="#1A5EA8" strokeWidth="2"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1" ry="1"/></svg>;
const HeroIcon = () => <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="#DC2626" strokeWidth="2"><path d="M12 2a5 5 0 1 0 0 10A5 5 0 0 0 12 2z"/><path d="M12 14c-7 0-7 4-7 4v2h14v-2s0-4-7-4z"/></svg>;

const BADGES: Record<string,{icon:JSX.Element,label:string,color:string}> = {
  first_report:{icon:<FlagIcon/>,label:'First Report',color:'#6366F1'},
  five_reports:{icon:<ClipboardIcon/>,label:'5 Reports',color:'#1A5EA8'},
  ten_reports:{icon:<ClipboardIcon/>,label:'10 Reports',color:'#2D7A4F'},
  civic_hero:{icon:<HeroIcon/>,label:'Civic Hero',color:'#DC2626'},
  ward_champion:{icon:<ShieldIcon/>,label:'Ward Champion',color:'#B45309'},
};

export default function LeaderboardPage() {
  const [leaders, setLeaders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
  useEffect(() => {
    async function load() {
      const { data: profiles } = await supabase.from('profiles').select('id,full_name,points,badges,ward_number').order('points',{ascending:false}).limit(20);
      const { data: reports } = await supabase.from('reports').select('user_id').not('user_id','is',null);
      const counts: Record<string,number> = {};
      reports?.forEach(r => { counts[r.user_id]=(counts[r.user_id]??0)+1; });
      setLeaders((profiles??[]).map(p=>({...p,report_count:counts[p.id]??0})));
      setLoading(false);
    }
    load();
  },[]);

  const MedalIcon = ({rank}:{rank:number}) => rank===0?<Gold/>:rank===1?<Silver/>:<Bronze/>;

  return (
    <div style={{minHeight:'100vh',background:C.bg,paddingBottom:100,fontFamily:'-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif'}}>
      <div style={{background:'linear-gradient(135deg,#1A5EA8,#2D7A4F)',padding:'40px 20px 50px',textAlign:'center'}}>
        <div style={{display:'flex',justifyContent:'center',marginBottom:12}}><TrophyIcon/></div>
        <h1 style={{color:'white',fontSize:26,fontWeight:900,margin:0}}>Community Leaderboard</h1>
        <p style={{color:'rgba(255,255,255,0.8)',fontSize:14,marginTop:6}}>Natchez's most active civic champions</p>
      </div>
      <div style={{maxWidth:560,margin:'-20px auto 0',padding:'0 16px'}}>
        {loading ? (
          <div style={{textAlign:'center',padding:60,color:C.textMuted,fontSize:16}}>Loading...</div>
        ) : leaders.length === 0 ? (
          <div style={{textAlign:'center',padding:60}}>
            <div style={{display:'flex',justifyContent:'center',marginBottom:16}}><StarIcon/></div>
            <p style={{color:C.textSub,fontSize:16,fontWeight:600}}>No civic champions yet!</p>
            <p style={{color:C.textMuted,fontSize:14}}>Be the first to earn points by filing a report.</p>
          </div>
        ) : (
          <div style={{display:'flex',flexDirection:'column',gap:10,paddingTop:20}}>
            {leaders.map((p,i)=>(
              <div key={p.id} style={{background:C.white,borderRadius:16,border:`1px solid ${C.border}`,padding:'16px',display:'flex',alignItems:'center',gap:12,boxShadow:i<3?'0 4px 16px rgba(26,94,168,0.1)':'none'}}>
                <div style={{width:36,height:36,borderRadius:'50%',background:C.blueSoft,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
                  {i<3 ? <MedalIcon rank={i}/> : <span style={{fontWeight:900,fontSize:13,color:C.blue}}>#{i+1}</span>}
                </div>
                <div style={{width:44,height:44,borderRadius:'50%',background:'linear-gradient(135deg,#1A5EA8,#2D7A4F)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:20,color:'white',fontWeight:900,flexShrink:0}}>
                  {(p.full_name||'?')[0].toUpperCase()}
                </div>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontWeight:800,fontSize:15,color:C.textMain}}>{p.full_name||'Anonymous'}</div>
                  <div style={{display:'flex',gap:6,marginTop:4,flexWrap:'wrap',alignItems:'center'}}>
                    {(p.badges||[]).map((b:string)=> BADGES[b] &&
                      <span key={b} title={BADGES[b].label} style={{display:'inline-flex',alignItems:'center',gap:3,padding:'2px 8px',borderRadius:20,background:BADGES[b].color+'15',border:`1px solid ${BADGES[b].color}30`}}>
                        {BADGES[b].icon}
                        <span style={{fontSize:10,fontWeight:700,color:BADGES[b].color}}>{BADGES[b].label}</span>
                      </span>
                    )}
                    {p.ward_number && <span style={{display:'inline-flex',alignItems:'center',gap:3,fontSize:11,color:C.green,fontWeight:700}}><ShieldIcon/> Ward {p.ward_number}</span>}
                  </div>
                </div>
                <div style={{textAlign:'right',flexShrink:0}}>
                  <div style={{fontSize:24,fontWeight:900,color:C.blue}}>{p.points||0}</div>
                  <div style={{fontSize:11,color:C.textMuted}}>{p.report_count} report{p.report_count!==1?'s':''}</div>
                </div>
              </div>
            ))}
          </div>
        )}
        <div style={{marginTop:24,padding:16,background:C.blueSoft,borderRadius:14,border:`1px solid #C3D4EE`}}>
          <div style={{fontSize:13,fontWeight:800,color:C.blue,marginBottom:10}}>How to earn points</div>
          {[['Submit a report','10 pts',<ClipboardIcon/>],['Me Too click','2 pts',<FlagIcon/>],['Report resolved','25 pts bonus',<ShieldIcon/>],['10+ reports','Civic Hero badge',<HeroIcon/>]].map(([label,val,icon]:any)=>(
            <div key={label as string} style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'8px 0',borderBottom:'1px solid #C3D4EE'}}>
              <div style={{display:'flex',alignItems:'center',gap:8,fontSize:13,color:C.textSub}}>{icon}{label}</div>
              <div style={{fontSize:13,fontWeight:800,color:C.blue}}>{val}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
