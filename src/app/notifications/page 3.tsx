'use client';
import { useEffect, useState } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import Link from 'next/link';
import { Bell, MapPin, MessageSquare, Users } from 'lucide-react';

export default function NotificationsPage() {
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    supabase.from('reports')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(20)
      .then(({ data }) => { setReports(data ?? []); setLoading(false); });
  }, []);

  const timeAgo = (ts: string) => {
    const d = Math.floor((Date.now() - new Date(ts).getTime()) / 1000);
    if (d < 60) return 'just now';
    if (d < 3600) return `${Math.floor(d/60)}m ago`;
    if (d < 86400) return `${Math.floor(d/3600)}h ago`;
    return `${Math.floor(d/86400)}d ago`;
  };

  const LABELS: Record<string,string> = {
    graffiti:'Graffiti',dumping:'Illegal Dumping',abandoned_vehicle:'Abandoned Vehicle',
    property_neglect:'Property Neglect',noise:'Noise',street_issues:'Street Issues',
    vegetation:'Vegetation',animal:'Animal',safety_hazard:'Safety Hazard',
    water_drainage:'Water/Drainage',public_safety:'Public Safety',
  };

  return (
    <div className="min-h-screen pb-28" style={{background:'var(--color-bg)'}}>
      <div className="sticky top-0 z-50 px-4 py-3 pt-12 flex items-center gap-3"
        style={{background:'rgba(15,15,26,0.9)',backdropFilter:'blur(20px)',borderBottom:'1px solid var(--color-border)'}}>
        <Link href="/" style={{color:'#a855f7'}}>
          <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20"><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/></svg>
        </Link>
        <h1 className="text-lg font-bold text-[var(--color-text)]">Community Activity</h1>
        <div className="ml-auto flex items-center gap-1.5 px-2.5 py-1 rounded-full" style={{background:'var(--color-surface2)',border:'1px solid var(--color-border)'}}>
          <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"/>
          <span className="text-[10px] font-bold uppercase tracking-wider" style={{color:'#6b6b8a'}}>Live</span>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center pt-20">
          <div style={{width:36,height:36,border:'3px solid rgba(168,85,247,0.3)',borderTop:'3px solid #a855f7',borderRadius:'50%',animation:'spin 1s linear infinite'}}/>
          <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
        </div>
      ) : reports.length === 0 ? (
        <div className="flex flex-col items-center justify-center pt-20 gap-3">
          <Bell size={40} color="#484870"/>
          <p style={{color:'#6b6b8a'}}>No reports yet</p>
        </div>
      ) : (
        <div className="px-4 py-4 flex flex-col gap-3">
          {reports.map(r => (
            <Link key={r.id} href={`/report/${r.id}`}
              className="flex gap-3 p-4 rounded-2xl active:scale-[0.98] transition-transform"
              style={{background:'var(--color-surface)',border:'1px solid var(--color-border)',textDecoration:'none'}}>
              <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                style={{background:'linear-gradient(135deg,rgba(124,58,237,0.3),rgba(6,182,212,0.15))'}}>
                <MapPin size={18} color="#a855f7"/>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="text-xs font-bold" style={{color:'#a855f7'}}>{LABELS[r.category] ?? r.category}</span>
                  <span className="text-xs" style={{color:'#484870'}}>{timeAgo(r.created_at)}</span>
                </div>
                <p className="text-sm font-semibold text-[var(--color-text)] truncate">{r.description || 'No description'}</p>
                <p className="text-xs mt-0.5 truncate" style={{color:'#6b6b8a'}}>Ward {r.ward_number} · {r.status}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
