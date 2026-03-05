'use client';
import { useEffect, useState } from 'react';
import { createBrowserClient } from '@supabase/ssr';
const C = {bg:'#F7F9FC',white:'#FFFFFF',border:'#DDE3EC',blue:'#1A5EA8',blueSoft:'#EBF2FB',green:'#2D7A4F',greenSoft:'#E8F5EE',textMain:'#0F172A',textSub:'#475569',textMuted:'#94A3B8'};
const BADGES: Record<string,{icon:string,label:string,color:string}> = {
  first_report:{icon:'🏁',label:'First Report',color:'#6366F1'},
  five_reports:{icon:'📋',label:'5 Reports',color:'#1A5EA8'},
  ten_reports:{icon:'🔟',label:'10 Reports',color:'#2D7A4F'},
  civic_hero:{icon:'🦸',label:'Civic Hero',color:'#DC2626'},
  ward_champion:{icon:'🏆',label:'Ward Champion',color:'#B45309'},
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
  return (
    <div style={{minHeight:'100vh',background:C.bg,paddingBottom:100,fontFamily:'-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif'}}>
      <div style={{background:'linear-gradient(135deg,#1A5EA8,#2D7A4F)',padding:'40px 20px 50px',textAlign:'center'}}>
        <div style={{fontSize:40,marginBottom:8}}>🏆</div>
        <h1 style={{color:'white',fontSize:26,fontWeight:900,margin:0}}>Community Leaderboard</h1>
        <p style={{color:'rgba(255,255,255,0.8)',fontSize:14,marginTop:6}}>Natchez's most active civic champions</p>
      </div>
      <div style={{maxWidth:560,margin:'-20px auto 0',padding:'0 16px'}}>
        {loading ? (
          <div style={{textAlign:'center',padding:60,color:C.textMuted,fontSize:16}}>Loading...</div>
        ) : leaders.length === 0 ? (
          <div style={{textAlign:'center',padding:60}}>
            <div style={{fontSize:48,marginBottom:16}}>🌟</div>
            <p style={{color:C.textSub,fontSize:16,fontWeight:600}}>No civic champions yet!</p>
            <p style={{color:C.textMuted,fontSize:14}}>Be the first to earn points by filing a report.</p>
          </div>
        ) : (
          <div style={{display:'flex',flexDirection:'column',gap:10,paddingTop:20}}>
            {leaders.map((p,i)=>{
              const medal = i===0?'🥇':i===1?'🥈':i===2?'🥉':null;
              return (
                <div key={p.id} style={{background:C.white,borderRadius:16,border:`1px solid ${C.border}`,padding:'16px',display:'flex',alignItems:'center',gap:12,boxShadow:i<3?'0 4px 16px rgba(26,94,168,0.1)':'none'}}>
                  <div style={{width:36,height:36,borderRadius:'50%',background:C.blueSoft,display:'flex',alignItems:'center',justifyContent:'center',fontWeight:900,fontSize:14,color:C.blue,flexShrink:0}}>
                    {medal || `#${i+1}`}
                  </div>
                  <div style={{width:44,height:44,borderRadius:'50%',background:'linear-gradient(135deg,#1A5EA8,#2D7A4F)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:20,color:'white',fontWeight:900,flexShrink:0}}>
                    {(p.full_name||'?')[0].toUpperCase()}
                  </div>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{fontWeight:800,fontSize:15,color:C.textMain}}>{p.full_name||'Anonymous'}</div>
                    <div style={{display:'flex',gap:6,marginTop:4,flexWrap:'wrap',alignItems:'center'}}>
                      {(p.badges||[]).map((b:string)=> BADGES[b] && <span key={b} title={BADGES[b].label} style={{fontSize:16}}>{BADGES[b].icon}</span>)}
                      {p.ward_number && <span style={{fontSize:11,color:C.green,fontWeight:700}}>Ward {p.ward_number}</span>}
                    </div>
                  </div>
                  <div style={{textAlign:'right',flexShrink:0}}>
                    <div style={{fontSize:24,fontWeight:900,color:C.blue}}>{p.points||0}</div>
                    <div style={{fontSize:11,color:C.textMuted}}>{p.report_count} report{p.report_count!==1?'s':''}</div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
        <div style={{marginTop:24,padding:16,background:C.blueSoft,borderRadius:14,border:`1px solid #C3D4EE`}}>
          <div style={{fontSize:13,fontWeight:800,color:C.blue,marginBottom:8}}>How to earn points</div>
          <div style={{fontSize:13,color:C.textSub,lineHeight:1.9}}>
            📋 Submit a report → <strong>10 pts</strong><br/>
            👍 Me Too click → <strong>2 pts</strong><br/>
            ✅ Report resolved → <strong>25 pts bonus</strong><br/>
            🦸 10+ reports → <strong>Civic Hero badge</strong>
          </div>
        </div>
      </div>
    </div>
  );
}
