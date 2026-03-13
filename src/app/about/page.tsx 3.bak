import Link from 'next/link';

export default function AboutPage() {
  return (
    <main className="min-h-screen px-5 py-12 max-w-lg mx-auto">

      {/* Logo */}
      <div className="flex items-center gap-3 mb-10">
        <div className="relative w-12 h-12 flex items-center justify-center flex-shrink-0">
          <div className="absolute inset-0 rounded-2xl opacity-50" style={{background:'linear-gradient(135deg,#7c3aed,#a855f7,#06b6d4)'}}/>
          <div className="absolute inset-[1.5px] rounded-[14px] bg-[#080810]"/>
          <span className="relative z-10 text-[12px] font-black" style={{background:'linear-gradient(135deg,#a855f7,#06b6d4)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent'}}>WTP</span>
        </div>
        <div>
          <div className="text-[17px] font-bold" style={{background:'linear-gradient(135deg,#a855f7,#06b6d4)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent'}}>We The People 39120</div>
          <div className="text-[10px] font-semibold tracking-widest uppercase" style={{color:'#484870'}}>Natchez, Mississippi</div>
        </div>
      </div>

      {/* Hero */}
      <h1 className="text-3xl font-black text-[var(--color-text)] leading-tight mb-4">
        Your neighborhood.<br/>
        <span style={{background:'linear-gradient(135deg,#a855f7,#06b6d4)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent'}}>Their responsibility.</span>
      </h1>
      <p className="text-base text-[var(--color-text-muted)] leading-relaxed mb-10">
        We The People 39120 is a civic reporting tool built for the residents of Natchez.
        Snap a photo of a pothole, an illegal dump site, a broken streetlight, or any neighborhood
        problem — and within seconds it appears on a public map for the entire community to see.
      </p>

      {/* How it works */}
      <div className="text-xs font-bold tracking-widest uppercase mb-4" style={{color:'#a855f7'}}>How it works</div>
      <div className="flex flex-col gap-3 mb-10">
        {[
          { emoji:'📸', title:'You report it', body:'Take a photo and drop a pin. It takes less than one minute. No account required — you can stay completely anonymous.' },
          { emoji:'🗺️', title:'The community sees it', body:'Your report goes live on the public map instantly. Neighbors tap "Me Too" to confirm the problem affects them too — building undeniable social proof.' },
          { emoji:'🏛️', title:'Politicians feel the pressure', body:'Every report is automatically tied to the responsible ward alderman. The more reports pile up — and the longer they sit ignored — the louder the public spotlight becomes.' },
          { emoji:'⏰', title:'The 30-day clock starts', body:'Once a report is filed, the alderman has 30 days to act. After that, the issue — and their name — moves to the public Wall of Shame. No hiding, no excuses.' },
          { emoji:'✅', title:'Problems get fixed', body:'When officials act, the report is marked resolved and their response is permanently recorded. The community can see who delivers and who doesn\'t.' },
        ].map(s => (
          <div key={s.title} className="flex gap-4 p-4 rounded-2xl border"
            style={{background:'var(--color-surface)',borderColor:'var(--color-border)'}}>
            <div className="text-2xl flex-shrink-0 mt-0.5">{s.emoji}</div>
            <div>
              <div className="text-sm font-bold text-[var(--color-text)] mb-1">{s.title}</div>
              <div className="text-sm text-[var(--color-text-muted)] leading-relaxed">{s.body}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Why it matters */}
      <div className="p-5 rounded-2xl mb-6"
        style={{background:'linear-gradient(135deg,rgba(124,58,237,0.12),rgba(6,182,212,0.06))',border:'1px solid rgba(124,58,237,0.25)'}}>
        <div className="text-xs font-bold tracking-widest uppercase mb-3" style={{color:'#a855f7'}}>Why this matters</div>
        <p className="text-sm text-[var(--color-text-muted)] leading-relaxed">
          Natchez aldermen and the mayor are elected to serve every resident in their ward.
          When a neighborhood problem sits unresolved for weeks or months, that is a failure of public duty.
          We The People 39120 does not attack politicians personally — it simply makes their
          performance visible to everyone they were elected to serve.{' '}
          <span className="text-[var(--color-text)] font-semibold">Sunlight is the best disinfectant.</span>
        </p>
      </div>

      {/* Board of Aldermen */}
      <div className="text-xs font-bold tracking-widest uppercase mb-4" style={{color:'var(--color-text-subtle)'}}>Your elected representatives</div>
      <div className="flex flex-col gap-2 mb-8">
        {[
          { ward:'Mayor',  name:'Dan M. Gibson',             phone:'601-445-7500' },
          { ward:'Ward 1', name:'Valencia Hall',              phone:'601-445-7500' },
          { ward:'Ward 2', name:'Billie Joe Frazier',         phone:'601-445-7500' },
          { ward:'Ward 3', name:'Sarah Cartier Smith',        phone:'601-445-7500' },
          { ward:'Ward 4', name:'Felicia Bridgewater-Irving', phone:'601-445-7500' },
          { ward:'Ward 5', name:'Benjamin Davis',             phone:'601-445-7500' },
          { ward:'Ward 6', name:'Curtis Moroney',             phone:'601-445-7500' },
        ].map(p => (
          <div key={p.ward} className="flex items-center justify-between px-4 py-3 rounded-xl"
            style={{background:'var(--color-surface2)',border:'1px solid var(--color-border)'}}>
            <div>
              <div className="text-xs font-bold text-[var(--color-text-subtle)] uppercase tracking-wider">{p.ward}</div>
              <div className="text-sm font-semibold text-[var(--color-text)] mt-0.5">{p.name}</div>
            </div>
            <a href={`tel:${p.phone}`}
              className="text-xs font-bold px-3 py-1.5 rounded-lg"
              style={{background:'var(--color-surface3)',color:'#a855f7',border:'1px solid rgba(168,85,247,0.3)'}}>
              📞 Call
            </a>
          </div>
        ))}
      </div>

      {/* Meeting schedule */}
      <div className="p-4 rounded-2xl mb-8 flex gap-3"
        style={{background:'var(--color-surface2)',border:'1px solid var(--color-border)'}}>
        <div className="text-xl">📅</div>
        <div>
          <div className="text-sm font-bold text-[var(--color-text)] mb-0.5">Public Meetings — Everyone Welcome</div>
          <div className="text-xs text-[var(--color-text-muted)] leading-relaxed">
            2nd Tuesday · 11:00 AM{'\n'}4th Tuesday · 6:00 PM{'\n'}
            City Council Chambers · 115 S. Pearl Street
          </div>
        </div>
      </div>

      {/* CTA */}
      <Link href="/"
        className="w-full h-14 rounded-2xl font-bold text-white text-base flex items-center justify-center gap-2 mb-4 active:scale-[0.98] transition-transform"
        style={{background:'linear-gradient(135deg,#7c3aed,#a855f7,#06b6d4)',boxShadow:'0 6px 24px rgba(124,58,237,0.45)'}}>
        🗺️ See the Community Map
      </Link>

      <Link href="/report"
        className="w-full h-12 rounded-2xl font-bold text-base flex items-center justify-center gap-2 mb-8"
        style={{background:'var(--color-surface2)',color:'var(--color-text-muted)',border:'1px solid var(--color-border)'}}>
        📢 Report an Issue Now
      </Link>

      {/* Footer */}
      <div className="text-center text-xs leading-relaxed" style={{color:'var(--color-text-subtle)'}}>
        Built for Natchez by{' '}
        <a href="https://klickifyagency.com" className="font-semibold" style={{color:'#a855f7'}}>KlickifyAgency.com</a>
        <br/>
        <a href="mailto:support@klickifyagency.com" style={{color:'#a855f7'}}>support@klickifyagency.com</a>
        <br/><br/>
        For emergencies, always call 911.
      </div>

    </main>
  );
}
