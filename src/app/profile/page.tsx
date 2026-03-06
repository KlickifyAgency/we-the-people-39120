'use client';
import { useState, useEffect } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { User, Star, MapPin, Shield, LogOut, Eye, EyeOff } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { BRAND } from '@/lib/constants';

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState<'login'|'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [stats, setStats] = useState({ reports: 0, metoos: 0, resolved: 0, points: 0, badges: [] as string[] });
  const [avatarUrl, setAvatarUrl] = useState<string|null>(null);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
      setLoading(false);
      if (data.user) {
        loadStats(data.user.id);
        supabase.from('profiles').select('avatar_url').eq('id', data.user.id).single().then(({ data: prof }) => {
          if (prof?.avatar_url) setAvatarUrl(prof.avatar_url);
        });
      }
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        loadStats(session.user.id);
        supabase.from('profiles').select('avatar_url').eq('id', session.user.id).single().then(({ data: prof }) => {
          if (prof?.avatar_url) setAvatarUrl(prof.avatar_url);
        });
      }
    });
    return () => subscription.unsubscribe();
  }, []);

  async function uploadAvatar(file: File, uid: string) {
    setUploadingAvatar(true);
    const ext = file.name.split('.').pop();
    const path = `avatars/${uid}.${ext}`;
    await supabase.storage.from('avatars').upload(path, file, { upsert: true });
    const { data } = supabase.storage.from('avatars').getPublicUrl(path);
    const cleanUrl = data.publicUrl.split('?')[0];
    await supabase.from('profiles').upsert({ id: uid, avatar_url: cleanUrl, updated_at: new Date().toISOString() });
    setAvatarUrl(cleanUrl + '?t=' + Date.now());
    setUploadingAvatar(false);
  }

  async function loadStats(uid: string) {
    const { count: reports } = await supabase.from('reports').select('*', { count: 'exact', head: true }).eq('user_id', uid);
    const { count: resolved } = await supabase.from('reports').select('*', { count: 'exact', head: true }).eq('user_id', uid).eq('status', 'resolved');
    const { data: profile } = await supabase.from('profiles').select('points,badges').eq('id', uid).single();
    setStats({ reports: reports ?? 0, metoos: 0, resolved: resolved ?? 0, points: profile?.points ?? 0, badges: profile?.badges ?? [] });
  }

  async function handleAuth() {
    setError(''); setSuccess(''); setSubmitting(true);
    if (mode === 'signup') {
      const { error: e } = await supabase.auth.signUp({ email, password });
      if (e) setError(e.message);
      else setSuccess('Account created! Check your email to confirm.');
    } else {
      const { error: e } = await supabase.auth.signInWithPassword({ email, password });
      if (e) setError(e.message);
    }
    setSubmitting(false);
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    setUser(null);
  }

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: 36, height: 36, border: '3px solid rgba(168,85,247,0.3)', borderTop: '3px solid #a855f7', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  if (!user) return (
    <>
      <Header title="Profile" />
      <div className="px-5 py-8 max-w-lg mx-auto pb-28">
        <div className="flex justify-center mb-8">
          <div className="w-20 h-20 rounded-full flex items-center justify-center" style={{background:'linear-gradient(135deg,rgba(124,58,237,0.2),rgba(6,182,212,0.1))',border:'1px solid rgba(168,85,247,0.3)'}}>
            <User size={36} color="#a855f7" />
          </div>
        </div>
        <div className="flex rounded-xl overflow-hidden mb-6" style={{border:'1px solid var(--color-border)',background:'var(--color-surface2)'}}>
          {(['login','signup'] as const).map(m => (
            <button key={m} onClick={() => { setMode(m); setError(''); setSuccess(''); }}
              className="flex-1 py-2.5 text-sm font-bold transition-all"
              style={{background: mode===m ? 'linear-gradient(135deg,#7c3aed,#a855f7)' : 'transparent', color: mode===m ? '#fff' : '#6b6b8a'}}>
              {m === 'login' ? 'Sign In' : 'Create Account'}
            </button>
          ))}
        </div>
        <div className="flex flex-col gap-3">
          <input type="email" placeholder="Email address" value={email} onChange={e => setEmail(e.target.value)}
            className="w-full h-12 px-4 rounded-xl text-sm outline-none"
            style={{background:'var(--color-surface2)',border:'1px solid var(--color-border)',color:'var(--color-text)'}} />
          <div className="relative">
            <input type={showPw ? 'text' : 'password'} placeholder="Password" value={password} onChange={e => setPassword(e.target.value)}
              className="w-full h-12 px-4 pr-12 rounded-xl text-sm outline-none"
              style={{background:'var(--color-surface2)',border:'1px solid var(--color-border)',color:'var(--color-text)'}} />
            <button onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2" style={{color:'#6b6b8a'}}>
              {showPw ? <EyeOff size={18}/> : <Eye size={18}/>}
            </button>
          </div>
          {error && <p className="text-xs px-1" style={{color:'#f87171'}}>{error}</p>}
          {success && <p className="text-xs px-1" style={{color:'#34d399'}}>{success}</p>}
          <button onClick={handleAuth} disabled={submitting || !email || !password}
            className="w-full h-12 rounded-xl font-bold text-white text-sm mt-1"
            style={{background:'linear-gradient(135deg,#7c3aed,#a855f7,#06b6d4)',opacity:submitting?0.7:1}}>
            {submitting ? 'Please wait...' : mode === 'login' ? 'Sign In' : 'Create Account'}
          </button>
        </div>
        <div className="mt-6 p-4 rounded-2xl" style={{background:'linear-gradient(135deg,rgba(124,58,237,0.08),rgba(6,182,212,0.04))',border:'1px solid rgba(124,58,237,0.15)'}}>
          <p className="text-xs text-center leading-relaxed" style={{color:'#6b6b8a'}}>
            With an account you can track your reports, receive email alerts when neighbors submit reports nearby, and see your alderman responses in your inbox.
          </p>
        </div>
      </div>
    </>
  );

  return (
    <>
      <Header title="Profile" />
      <div className="px-5 py-8 max-w-lg mx-auto pb-28">
        <div className="flex flex-col items-center gap-3 mb-8">
          <div className="relative">
            <div className="w-20 h-20 rounded-full overflow-hidden flex items-center justify-center" style={{background:'linear-gradient(135deg,#7c3aed,#a855f7)',boxShadow:'0 8px 32px rgba(124,58,237,0.4)'}}>
              {avatarUrl ? <img src={avatarUrl} alt="avatar" style={{width:'100%',height:'100%',objectFit:'cover'}}/> : <User size={36} color="#fff" />}
            </div>
            <label className="absolute bottom-0 right-0 w-7 h-7 rounded-full flex items-center justify-center cursor-pointer" style={{background:'#a855f7',border:'2px solid #0a0a14'}}>
              {uploadingAvatar ? <div style={{width:12,height:12,border:'2px solid rgba(255,255,255,0.3)',borderTop:'2px solid white',borderRadius:'50%',animation:'spin 1s linear infinite'}}/> : <svg viewBox="0 0 24 24" fill="white" width="14" height="14"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg>}
              <input type="file" accept="image/*" className="hidden" onChange={e => { if (e.target.files?.[0]) uploadAvatar(e.target.files[0], user.id); }}/>
            </label>
          </div>
          <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
          <div className="text-center">
            <p className="text-lg font-bold text-[var(--color-text)]">{user.email}</p>
            <p className="text-sm" style={{color:'#6b6b8a'}}>Natchez, MS {BRAND.zip}</p>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3 mb-8">
          {[
            { icon: MapPin, label: 'Reports', value: String(stats.reports) },
            { icon: Star, label: 'Points', value: String(stats.points) },
            { icon: Shield, label: 'Resolved', value: String(stats.resolved) },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className="rounded-2xl p-4 text-center border" style={{background:'var(--color-surface2)',borderColor:'var(--color-border)'}}>
              <Icon size={18} color="#a855f7" className="mx-auto mb-1" />
              <p className="text-2xl font-black text-[var(--color-text)]">{value}</p>
              <p className="text-[10px] font-semibold uppercase tracking-wider" style={{color:'#6b6b8a'}}>{label}</p>
            </div>
          ))}
        </div>
        <a href="/admin"
          className="w-full h-12 rounded-xl font-bold text-sm flex items-center justify-center gap-2 mb-3"
          style={{background:'linear-gradient(135deg,rgba(124,58,237,0.15),rgba(6,182,212,0.08))',color:'#a855f7',border:'1px solid rgba(168,85,247,0.3)',textDecoration:'none',display:'flex'}}>
          <svg viewBox="0 0 24 24" fill="#a855f7" width="16" height="16"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 4l5 2.18V11c0 3.5-2.33 6.79-5 7.93-2.67-1.14-5-4.43-5-7.93V7.18L12 5z"/></svg>
          Admin Dashboard
        </a>
        <button onClick={handleLogout}
          className="w-full h-12 rounded-xl font-bold text-sm flex items-center justify-center gap-2"
          style={{background:'var(--color-surface2)',color:'#f87171',border:'1px solid rgba(248,113,113,0.3)'}}>
          <LogOut size={16} /> Sign Out
        </button>
      </div>
    </>
  );
}
