'use client';
import React from 'react';
import { useEffect, useState } from 'react';
import { createBrowserClient } from '@supabase/ssr';

const Gold   = () => <svg viewBox="0 0 24 24" width="22" height="22" fill="none"><circle cx="12" cy="12" r="10" fill="#F59E0B" stroke="#D97706" strokeWidth="1.5"/><text x="12" y="17" textAnchor="middle" fontSize="13" fontWeight="900" fill="white">1</text></svg>;
const Silver = () => <svg viewBox="0 0 24 24" width="22" height="22" fill="none"><circle cx="12" cy="12" r="10" fill="#94A3B8" stroke="#64748B" strokeWidth="1.5"/><text x="12" y="17" textAnchor="middle" fontSize="13" fontWeight="900" fill="white">2</text></svg>;
const Bronze = () => <svg viewBox="0 0 24 24" width="22" height="22" fill="none"><circle cx="12" cy="12" r="10" fill="#B45309" stroke="#92400E" strokeWidth="1.5"/><text x="12" y="17" textAnchor="middle" fontSize="13" fontWeight="900" fill="white">3</text></svg>;

const ShieldIcon   = () => <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="#2D7A4F" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>;
const FlagIcon     = () => <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="#1A5EA8" strokeWidth="2"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/></svg>;
const ClipboardIcon= () => <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="#1A5EA8" strokeWidth="2"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1" ry="1"/></svg>;
const HeroIcon     = () => <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="#DC2626" strokeWidth="2"><path d="M12 2a5 5 0 1 0 0 10A5 5 0 0 0 12 2z"/><path d="M12 14c-7 0-7 4-7 4v2h14v-2s0-4-7-4z"/></svg>;

const BADGES: Record<string, { icon: React.ReactNode; label: string; color: string }> = {
  first_report:  { icon: <FlagIcon/>,      label: 'First Report',   color: '#1A5EA8' },
  five_reports:  { icon: <ClipboardIcon/>, label: '5 Reports',      color: '#1A5EA8' },
  ten_reports:   { icon: <ClipboardIcon/>, label: '10 Reports',     color: '#2D7A4F' },
  civic_hero:    { icon: <HeroIcon/>,      label: 'Civic Hero',     color: '#DC2626' },
  ward_champion: { icon: <ShieldIcon/>,    label: 'Ward Champion',  color: '#B45309' },
};

export default function LeaderboardPage() {
  const [leaders, setLeaders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
  );

  useEffect(() => {
    async function load() {
      const { data: profiles } = await supabase.from('profiles').select('id,full_name,points,badges,ward_number').order('points', { ascending: false }).limit(20);
      const { data: reports } = await supabase.from('reports').select('user_id').not('user_id', 'is', null);
      const counts: Record<string, number> = {};
      reports?.forEach(r => { counts[r.user_id] = (counts[r.user_id] ?? 0) + 1; });
      setLeaders((profiles ?? []).map(p => ({ ...p, report_count: counts[p.id] ?? 0 })));
      setLoading(false);
    }
    load();
  }, []);

  const MedalIcon = ({ rank }: { rank: number }) =>
    rank === 0 ? <Gold/> : rank === 1 ? <Silver/> : <Bronze/>;

  return (
    <div className="min-h-screen bg-[#F7F9FC] pb-28">

      {/* Hero */}
      <div className="bg-gradient-to-br from-[#0B1F40] via-[#1A5EA8] to-[#2D7A4F] px-5 pt-10 pb-14 text-center">
        <div className="flex justify-center mb-3">
          <svg viewBox="0 0 24 24" width="44" height="44" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 9H3.5a2.5 2.5 0 0 0 0 5H6"/>
            <path d="M18 9h2.5a2.5 2.5 0 0 1 0 5H18"/>
            <path d="M4 22h16"/>
            <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/>
            <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/>
            <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/>
          </svg>
        </div>
        <h1 className="text-white text-[1.6rem] font-black mb-1">Community Leaderboard</h1>
        <p className="text-blue-100 text-[14px]">Natchez&apos;s most active civic champions</p>
      </div>

      <div className="px-4 -mt-5">
        {loading ? (
          <div className="flex justify-center pt-16">
            <div className="w-9 h-9 border-[3px] border-[#EBF2FB] border-t-[#1A5EA8] rounded-full animate-spin"/>
          </div>
        ) : leaders.length === 0 ? (
          <div className="flex flex-col items-center justify-center pt-16 gap-3">
            <svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="#94A3B8" strokeWidth="1.5">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
            </svg>
            <p className="text-[#475569] text-[16px] font-semibold">No civic champions yet!</p>
            <p className="text-[#94A3B8] text-[14px]">Be the first to earn points by filing a report.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-2.5 pt-5">
            {leaders.map((p, i) => (
              <div
                key={p.id}
                className="bg-white rounded-2xl border border-[#DDE3EC] p-4 flex items-center gap-3"
                style={{ boxShadow: i < 3 ? '0 4px 16px rgba(26,94,168,0.10)' : 'none' }}
              >
                {/* Rank */}
                <div className="w-9 h-9 rounded-full bg-[#EBF2FB] flex items-center justify-center shrink-0">
                  {i < 3
                    ? <MedalIcon rank={i}/>
                    : <span className="font-black text-[13px] text-[#1A5EA8]">#{i + 1}</span>
                  }
                </div>
                {/* Avatar */}
                <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#1A5EA8] to-[#2D7A4F] flex items-center justify-center text-[18px] text-white font-black shrink-0">
                  {(p.full_name || '?')[0].toUpperCase()}
                </div>
                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-[14px] text-[#0F172A]">{p.full_name || 'Anonymous'}</div>
                  <div className="flex gap-1.5 mt-1 flex-wrap items-center">
                    {(p.badges || []).map((b: string) => BADGES[b] && (
                      <span
                        key={b}
                        title={BADGES[b].label}
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold"
                        style={{ background: BADGES[b].color + '15', border: `1px solid ${BADGES[b].color}30`, color: BADGES[b].color }}
                      >
                        {BADGES[b].icon}
                        {BADGES[b].label}
                      </span>
                    ))}
                    {p.ward_number && (
                      <span className="inline-flex items-center gap-1 text-[11px] text-[#2D7A4F] font-bold">
                        <ShieldIcon/> Ward {p.ward_number}
                      </span>
                    )}
                  </div>
                </div>
                {/* Score */}
                <div className="text-right shrink-0">
                  <div className="text-[22px] font-black text-[#1A5EA8]">{p.points || 0}</div>
                  <div className="text-[11px] text-[#94A3B8]">{p.report_count} report{p.report_count !== 1 ? 's' : ''}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* How to earn points */}
        <div className="mt-6 p-4 bg-[#EBF2FB] rounded-2xl border border-[#C3D4EE]">
          <div className="text-[13px] font-black text-[#1A5EA8] mb-3">How to earn points</div>
          {([
            ['Submit a report',  '10 pts',         <ClipboardIcon key="1"/>],
            ['Me Too click',     '2 pts',           <FlagIcon key="2"/>],
            ['Report resolved',  '25 pts bonus',    <ShieldIcon key="3"/>],
            ['10+ reports',      'Civic Hero badge', <HeroIcon key="4"/>],
          ] as [string, string, React.ReactNode][]).map(([label, val, icon]) => (
            <div key={label} className="flex items-center justify-between py-2 border-b border-[#C3D4EE] last:border-0">
              <div className="flex items-center gap-2 text-[13px] text-[#475569]">{icon}{label}</div>
              <div className="text-[13px] font-black text-[#1A5EA8]">{val}</div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
