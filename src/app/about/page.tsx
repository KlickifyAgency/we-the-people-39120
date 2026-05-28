import Link from 'next/link';

const STEPS = [
  {
    title: 'You report it',
    body: "Take a photo and drop a pin. It takes less than one minute. No account required — you can stay completely anonymous.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
        <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
        <circle cx="12" cy="13" r="4"/>
      </svg>
    ),
  },
  {
    title: 'The community sees it',
    body: "Your report goes live on the public map instantly. Neighbors tap \"Me Too\" to confirm the problem affects them too — building undeniable social proof.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
        <circle cx="12" cy="12" r="10"/>
        <line x1="2" y1="12" x2="22" y2="12"/>
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
      </svg>
    ),
  },
  {
    title: 'Politicians feel the pressure',
    body: "Every report is automatically tied to the responsible ward alderman. The more reports pile up — and the longer they sit ignored — the louder the public spotlight becomes.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
        <polyline points="9 22 9 12 15 12 15 22"/>
      </svg>
    ),
  },
  {
    title: 'The 30-day clock starts',
    body: "Once a report is filed, the alderman has 30 days to act. After that, the issue — and their name — moves to the public record. No hiding, no excuses.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
        <circle cx="12" cy="12" r="10"/>
        <polyline points="12 6 12 12 16 14"/>
      </svg>
    ),
  },
  {
    title: 'Problems get fixed',
    body: "When officials act, the report is marked resolved and their response is permanently recorded. The community can see who delivers and who doesn't.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
        <polyline points="22 4 12 14.01 9 11.01"/>
      </svg>
    ),
  },
];

const ALDERMEN = [
  { ward: 'Mayor',  name: 'Dan M. Gibson',             phone: '601-445-7500' },
  { ward: 'Ward 1', name: 'Valencia Hall',              phone: '601-443-1265' },
  { ward: 'Ward 2', name: 'Billie Joe Frazier',         phone: '601-445-7500' },
  { ward: 'Ward 3', name: 'Sarah Carter-Smith',         phone: '601-334-1537' },
  { ward: 'Ward 4', name: 'Felicia Bridgewater-Irving', phone: '601-445-7500' },
  { ward: 'Ward 5', name: 'Benjamin Davis',             phone: '601-445-7500' },
  { ward: 'Ward 6', name: 'Curtis Moroney',             phone: '601-445-7500' },
];

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#F7F9FC] pb-28">

      {/* Header */}
      <div className="bg-gradient-to-br from-[#0B1F40] via-[#1A5EA8] to-[#1565C0] px-6 pt-10 pb-10 text-white">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
            <span className="text-white text-[11px] font-black tracking-tight">WTP</span>
          </div>
          <div>
            <div className="text-[16px] font-bold text-white">We The People 39120</div>
            <div className="text-[10px] font-semibold tracking-widest uppercase text-blue-200">Natchez, Mississippi</div>
          </div>
        </div>
        <h1 className="text-[1.8rem] font-black leading-tight text-white mb-3">
          Your neighborhood.<br/>
          <span className="text-[#6EE7B7]">Their responsibility.</span>
        </h1>
        <p className="text-blue-100 text-[15px] leading-relaxed">
          A civic reporting tool built for the residents of Natchez. Snap a photo of a pothole, an illegal dump site, a broken streetlight — and within seconds it appears on a public map for the entire community to see.
        </p>
      </div>

      <div className="px-5 pt-6">

        {/* How it works */}
        <div className="text-[11px] font-bold tracking-widest uppercase text-[#1A5EA8] mb-3">How it works</div>
        <div className="flex flex-col gap-2.5 mb-7">
          {STEPS.map((s, i) => (
            <div key={s.title} className="flex gap-4 p-4 bg-white rounded-2xl border border-[#DDE3EC] shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-[#EBF2FB] flex items-center justify-center text-[#1A5EA8] shrink-0">
                {s.icon}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-5 h-5 rounded-full bg-[#1A5EA8] flex items-center justify-center text-[11px] font-black text-white shrink-0">{i + 1}</span>
                  <div className="text-[14px] font-bold text-[#0F172A]">{s.title}</div>
                </div>
                <div className="text-[13px] text-[#475569] leading-relaxed">{s.body}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Why it matters */}
        <div className="p-5 bg-[#EBF2FB] rounded-2xl border border-[#C3D4EE] mb-6">
          <div className="text-[11px] font-bold tracking-widest uppercase text-[#1A5EA8] mb-3">Why this matters</div>
          <p className="text-[14px] text-[#475569] leading-relaxed">
            Natchez aldermen and the mayor are elected to serve every resident in their ward. When a neighborhood problem sits unresolved for weeks or months, that is a failure of public duty. We The People 39120 does not attack politicians personally — it simply makes their performance visible to everyone they were elected to serve.{' '}
            <span className="text-[#0F172A] font-semibold">Sunlight is the best disinfectant.</span>
          </p>
        </div>

        {/* Representatives */}
        <div className="text-[11px] font-bold tracking-widest uppercase text-[#94A3B8] mb-3">Your elected representatives</div>
        <div className="flex flex-col gap-2 mb-7">
          {ALDERMEN.map(p => (
            <div key={p.ward} className="flex items-center justify-between px-4 py-3.5 bg-white rounded-xl border border-[#DDE3EC] shadow-sm">
              <div>
                <div className="text-[10px] font-black text-[#1A5EA8] uppercase tracking-wider mb-0.5">{p.ward}</div>
                <div className="text-[14px] font-bold text-[#0F172A]">{p.name}</div>
              </div>
              <a
                href={`tel:${p.phone.replace(/-/g, '')}`}
                className="flex items-center gap-1.5 text-[#2D7A4F] text-[13px] font-bold cursor-pointer hover:text-[#1a4d30] transition-colors duration-150"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="14" height="14">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.41 2 2 0 0 1 3.6 1.22h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.82a16 16 0 0 0 6.29 6.29l.96-.96a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
                </svg>
                {p.phone}
              </a>
            </div>
          ))}
        </div>

        {/* Meeting schedule */}
        <div className="p-4 bg-white rounded-2xl border border-[#DDE3EC] shadow-sm mb-7 flex gap-3.5 items-start">
          <div className="w-9 h-9 rounded-xl bg-[#EBF2FB] flex items-center justify-center shrink-0">
            <svg viewBox="0 0 24 24" fill="none" stroke="#1A5EA8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="17" height="17">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
              <line x1="16" y1="2" x2="16" y2="6"/>
              <line x1="8" y1="2" x2="8" y2="6"/>
              <line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
          </div>
          <div>
            <div className="text-[14px] font-bold text-[#0F172A] mb-1">Public Meetings — Everyone Welcome</div>
            <div className="text-[13px] text-[#475569] leading-relaxed">
              2nd Tuesday · 11:00 AM<br/>
              4th Tuesday · 6:00 PM<br/>
              City Council Chambers · 115 S. Pearl Street
            </div>
          </div>
        </div>

        {/* CTAs */}
        <Link
          href="/map"
          className="flex items-center justify-center gap-2 h-14 bg-[#1A5EA8] text-white font-black text-[15px] rounded-2xl shadow-lg cursor-pointer hover:bg-[#154d8f] transition-colors duration-200 mb-3"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
            <polygon points="3 11 22 2 13 21 11 13 3 11"/>
          </svg>
          See the Community Map
        </Link>

        <Link
          href="/report"
          className="flex items-center justify-center gap-2 h-12 bg-white text-[#475569] font-bold text-[14px] rounded-2xl border border-[#DDE3EC] cursor-pointer hover:bg-[#F7F9FC] transition-colors duration-200 mb-8"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
            <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
            <circle cx="12" cy="13" r="4"/>
          </svg>
          Report an Issue Now
        </Link>

        {/* Footer */}
        <div className="text-center text-[12px] text-[#94A3B8] leading-relaxed">
          Built for Natchez by{' '}
          <a href="https://klickifyagency.com" className="font-semibold text-[#1A5EA8] hover:underline">KlickifyAgency.com</a>
          <br/>
          <a href="mailto:support@klickifyagency.com" className="text-[#1A5EA8] hover:underline">support@klickifyagency.com</a>
          <br/><br/>
          For emergencies, always call 911.
        </div>

      </div>
    </main>
  );
}
