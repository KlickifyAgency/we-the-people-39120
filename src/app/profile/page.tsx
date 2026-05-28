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
  const [fullName, setFullName] = useState('');
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
      if (!fullName.trim()) { setError('Please enter your full name.'); setSubmitting(false); return; }
      const { data: signUpData, error: e } = await supabase.auth.signUp({ email, password, options: { data: { full_name: fullName } } });
      if (e) setError(e.message);
      else {
        if (signUpData.user) {
          await supabase.from('profiles').upsert({ id: signUpData.user.id, full_name: fullName, email });
        }
        setSuccess('Account created! Check your email to confirm.');
      }
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
    <div className="min-h-screen flex items-center justify-center bg-[#F7F9FC]">
      <div className="w-9 h-9 border-[3px] border-[#EBF2FB] border-t-[#1A5EA8] rounded-full animate-spin" />
    </div>
  );

  if (!user) return (
    <>
      <Header title="Profile" />
      <div className="px-5 py-8 pb-28">

        <div className="flex justify-center mb-8">
          <div className="w-20 h-20 rounded-full bg-[#EBF2FB] border border-[#C3D4EE] flex items-center justify-center">
            <User size={36} color="#1A5EA8" />
          </div>
        </div>

        {/* Tab toggle */}
        <div className="flex rounded-xl overflow-hidden border border-[#DDE3EC] bg-[#F7F9FC] mb-6">
          {(['login','signup'] as const).map(m => (
            <button
              key={m}
              onClick={() => { setMode(m); setError(''); setSuccess(''); }}
              className="flex-1 py-2.5 text-[14px] font-bold transition-colors duration-200 cursor-pointer"
              style={{
                background: mode === m ? '#1A5EA8' : 'transparent',
                color: mode === m ? '#fff' : '#475569',
              }}
            >
              {m === 'login' ? 'Sign In' : 'Create Account'}
            </button>
          ))}
        </div>

        <div className="flex flex-col gap-3">
          {mode === 'signup' && (
            <input
              type="text"
              placeholder="Full name"
              value={fullName}
              onChange={e => setFullName(e.target.value)}
              className="w-full h-12 px-4 rounded-xl text-[14px] outline-none bg-white border border-[#DDE3EC] text-[#0F172A] focus:border-[#1A5EA8] transition-colors"
            />
          )}
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full h-12 px-4 rounded-xl text-[14px] outline-none bg-white border border-[#DDE3EC] text-[#0F172A] focus:border-[#1A5EA8] transition-colors"
          />
          <div className="relative">
            <input
              type={showPw ? 'text' : 'password'}
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full h-12 px-4 pr-12 rounded-xl text-[14px] outline-none bg-white border border-[#DDE3EC] text-[#0F172A] focus:border-[#1A5EA8] transition-colors"
            />
            <button
              onClick={() => setShowPw(!showPw)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94A3B8] cursor-pointer"
            >
              {showPw ? <EyeOff size={18}/> : <Eye size={18}/>}
            </button>
          </div>

          {error && <p className="text-[13px] text-[#DC2626] px-1">{error}</p>}
          {success && <p className="text-[13px] text-[#2D7A4F] px-1">{success}</p>}

          <button
            onClick={handleAuth}
            disabled={submitting || !email || !password || (mode === 'signup' && !fullName.trim())}
            className="w-full h-12 rounded-xl font-bold text-white text-[14px] mt-1 bg-[#1A5EA8] hover:bg-[#154d8f] transition-colors duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? 'Please wait...' : mode === 'login' ? 'Sign In' : 'Create Account'}
          </button>
        </div>

        <div className="mt-6 p-4 rounded-2xl bg-[#EBF2FB] border border-[#C3D4EE]">
          <p className="text-[13px] text-center text-[#475569] leading-relaxed">
            With an account you can track your reports, receive email alerts when neighbors submit reports nearby, and see your alderman responses in your inbox.
          </p>
        </div>
      </div>
    </>
  );

  return (
    <>
      <Header title="Profile" />
      <div className="px-5 py-8 pb-28">

        {/* Avatar */}
        <div className="flex flex-col items-center gap-3 mb-8">
          <div className="relative">
            <div className="w-20 h-20 rounded-full overflow-hidden bg-gradient-to-br from-[#1A5EA8] to-[#2D7A4F] flex items-center justify-center shadow-lg">
              {avatarUrl
                ? <img src={avatarUrl} alt="avatar" className="w-full h-full object-cover"/>
                : <User size={36} color="#fff" />}
            </div>
            <label className="absolute bottom-0 right-0 w-7 h-7 rounded-full flex items-center justify-center cursor-pointer bg-[#1A5EA8] border-2 border-white">
              {uploadingAvatar
                ? <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin"/>
                : <svg viewBox="0 0 24 24" fill="white" width="12" height="12"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg>
              }
              <input type="file" accept="image/*" className="hidden" onChange={e => { if (e.target.files?.[0]) uploadAvatar(e.target.files[0], user.id); }}/>
            </label>
          </div>
          <div className="text-center">
            <p className="text-[16px] font-bold text-[#0F172A]">{user.email}</p>
            <p className="text-[13px] text-[#94A3B8]">Natchez, MS {BRAND.zip}</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-7">
          {[
            { icon: MapPin, label: 'Reports', value: String(stats.reports) },
            { icon: Star,   label: 'Points',  value: String(stats.points)  },
            { icon: Shield, label: 'Resolved',value: String(stats.resolved)},
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className="rounded-2xl p-4 text-center bg-white border border-[#DDE3EC] shadow-sm">
              <Icon size={18} color="#1A5EA8" className="mx-auto mb-1" />
              <p className="text-[1.5rem] font-black text-[#0F172A]">{value}</p>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-[#94A3B8]">{label}</p>
            </div>
          ))}
        </div>

        {/* Admin link */}
        <a
          href="/admin"
          className="w-full h-12 rounded-xl font-bold text-[14px] flex items-center justify-center gap-2 mb-3 bg-[#EBF2FB] text-[#1A5EA8] border border-[#C3D4EE] hover:bg-[#dce9f7] transition-colors duration-200 cursor-pointer"
          style={{ textDecoration: 'none' }}
        >
          <svg viewBox="0 0 24 24" fill="#1A5EA8" width="16" height="16">
            <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 4l5 2.18V11c0 3.5-2.33 6.79-5 7.93-2.67-1.14-5-4.43-5-7.93V7.18L12 5z"/>
          </svg>
          Admin Dashboard
        </a>

        {/* Sign out */}
        <button
          onClick={handleLogout}
          className="w-full h-12 rounded-xl font-bold text-[14px] flex items-center justify-center gap-2 bg-white text-[#DC2626] border border-[rgba(220,38,38,0.25)] hover:bg-[#FEF2F2] transition-colors duration-200 cursor-pointer"
        >
          <LogOut size={16} /> Sign Out
        </button>

      </div>
    </>
  );
}
