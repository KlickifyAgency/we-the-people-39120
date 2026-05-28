'use client';
import Link from 'next/link';
import { PWAInstallBanner } from '@/components/shared/PWAInstallBanner';

const FB_PAGE = 'https://www.facebook.com/profile.php?id=61588640650718';

const STEPS = [
  {
    num: 1,
    action: 'Snap a Photo',
    detail: 'Point your phone at the problem',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
        <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
        <circle cx="12" cy="13" r="4"/>
      </svg>
    ),
  },
  {
    num: 2,
    action: 'Confirm Location',
    detail: 'GPS pins it automatically',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
        <circle cx="12" cy="10" r="3"/>
      </svg>
    ),
  },
  {
    num: 3,
    action: 'Pick a Category',
    detail: 'Pothole, dumping, graffiti and more',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
        <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/>
        <line x1="7" y1="7" x2="7.01" y2="7"/>
      </svg>
    ),
  },
  {
    num: 4,
    action: 'Post it Publicly',
    detail: 'Visible to the entire community',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
        <circle cx="12" cy="12" r="10"/>
        <line x1="2" y1="12" x2="22" y2="12"/>
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
      </svg>
    ),
  },
  {
    num: 5,
    action: 'Alderman Notified',
    detail: 'Direct line — 30-day response window',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
        <circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
        <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
    ),
  },
];

const ALDERMEN = [
  { ward: 'Mayor',  name: 'Dan M. Gibson',             phone: '6014457500', display: '601-445-7500' },
  { ward: 'Ward 1', name: 'Valencia Hall',              phone: '6014431265', display: '601-443-1265' },
  { ward: 'Ward 2', name: 'Billie Joe Frazier',         phone: '6014457500', display: '601-445-7500' },
  { ward: 'Ward 3', name: 'Sarah Carter-Smith',         phone: '6013341537', display: '601-334-1537' },
  { ward: 'Ward 4', name: 'Felicia Bridgewater-Irving', phone: '6014457500', display: '601-445-7500' },
  { ward: 'Ward 5', name: 'Benjamin Davis',             phone: '6014457500', display: '601-445-7500' },
  { ward: 'Ward 6', name: 'Curtis Moroney',             phone: '6014457500', display: '601-445-7500' },
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#F7F9FC]">

      {/* ── HERO ─────────────────────────────────────────────── */}
      <section className="relative bg-gradient-to-br from-[#0B1F40] via-[#1A5EA8] to-[#1565C0] px-6 pt-10 pb-12 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-[0.04] [background-image:radial-gradient(circle,white_1px,transparent_1px)] [background-size:20px_20px]" />
        <div className="relative">
          <div className="flex justify-center mb-7">
            <img src="/logo-wtp.png" alt="We The People 39120" className="h-[70px] object-contain drop-shadow-lg" />
          </div>
          <h1 className="text-[2rem] font-black leading-[1.15] text-center mb-4 tracking-tight">
            We See It.<br />We Report It.<br />
            <span className="text-[#6EE7B7]">We Fix It — Together.</span>
          </h1>
          <p className="text-blue-100 text-center text-[15px] leading-relaxed mb-7 px-1">
            Connecting Natchez residents directly with their elected officials — where neighborhood problems get seen, tracked, and resolved.
          </p>
          <Link
            href="/report"
            className="flex items-center justify-center gap-3 bg-white text-[#1A5EA8] font-black text-[17px] h-[60px] rounded-2xl shadow-xl cursor-pointer hover:bg-blue-50 transition-colors duration-200 mb-3"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
              <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
              <circle cx="12" cy="13" r="4"/>
            </svg>
            Report a Problem — It&apos;s Free
          </Link>
          <p className="text-blue-200/80 text-center text-xs">Anonymous reporting always available · Takes 30 seconds</p>
        </div>
      </section>

      {/* ── STATS BAR ─────────────────────────────────────────── */}
      <div className="grid grid-cols-3 bg-[#0B1F40] text-white">
        <div className="text-center py-4 border-r border-white/10">
          <div className="text-[1.4rem] font-black">6</div>
          <div className="text-[11px] text-blue-300 mt-0.5">City Wards</div>
        </div>
        <div className="text-center py-4 border-r border-white/10">
          <div className="text-[1.4rem] font-black text-[#6EE7B7]">30</div>
          <div className="text-[11px] text-blue-300 mt-0.5">Day Response</div>
        </div>
        <div className="text-center py-4">
          <div className="text-[1.4rem] font-black">Free</div>
          <div className="text-[11px] text-blue-300 mt-0.5">Always</div>
        </div>
      </div>

      {/* ── ABOUT ─────────────────────────────────────────────── */}
      <div className="mx-5 mt-5 mb-5 p-5 bg-white rounded-2xl border border-[#DDE3EC] shadow-sm">
        <p className="text-[15px] leading-[1.75] text-[#475569]">
          <strong className="text-[#0F172A]">We The People 39120</strong> is a free civic platform built for the residents of Natchez, Mississippi. For the first time, citizens and their elected officials can work together — in real time — to take care of the city they both love.
        </p>
      </div>

      {/* ── PWA BANNER ────────────────────────────────────────── */}
      <PWAInstallBanner />

      {/* ── FACEBOOK ──────────────────────────────────────────── */}
      <div className="mx-5 mb-5 p-5 bg-[#EEF3FB] rounded-2xl border border-[#C3D4EE]">
        <div className="flex items-center gap-2 mb-2">
          <svg viewBox="0 0 24 24" fill="#1877F2" width="18" height="18">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
          </svg>
          <span className="text-[#1877F2] font-bold text-[14px]">Follow us on Facebook</span>
        </div>
        <p className="text-[#475569] text-[13px] leading-relaxed mb-4">Every new report is shared publicly on our Facebook page. Stay informed and help spread the word.</p>
        <a
          href={FB_PAGE}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-3 bg-[#1877F2] text-white font-bold text-[15px] py-4 rounded-xl cursor-pointer hover:bg-[#1565D8] transition-colors duration-200 shadow-md"
        >
          <svg viewBox="0 0 24 24" fill="white" width="22" height="22">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
          </svg>
          We The People 39120 on Facebook
        </a>
      </div>

      {/* ── HOW IT WORKS ──────────────────────────────────────── */}
      <section className="px-5 mb-5">
        <h2 className="text-[19px] font-black text-[#0F172A] mb-1">Civic Action, Made Simple</h2>
        <p className="text-[#94A3B8] text-[13px] mb-4">Five easy steps to get your neighborhood problem on the public record.</p>
        <div className="flex flex-col gap-2.5">
          {STEPS.map((s) => (
            <div key={s.num} className="flex items-center gap-3.5 p-4 bg-white rounded-2xl border border-[#DDE3EC] shadow-sm">
              <div className="w-11 h-11 rounded-xl bg-[#EBF2FB] flex items-center justify-center shrink-0 text-[#1A5EA8]">
                {s.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-[14px] text-[#0F172A] mb-0.5">{s.action}</div>
                <div className="text-[12px] text-[#94A3B8] leading-snug">{s.detail}</div>
              </div>
              <div className="w-7 h-7 rounded-full bg-[#1A5EA8] flex items-center justify-center text-[12px] font-black text-white shrink-0">
                {s.num}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── WHY IT MATTERS ────────────────────────────────────── */}
      <section className="mx-5 mb-5 p-5 bg-white rounded-2xl border border-[#DDE3EC] shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-9 h-9 rounded-xl bg-[#E8F5EE] flex items-center justify-center shrink-0">
            <svg viewBox="0 0 24 24" fill="none" stroke="#2D7A4F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>
          </div>
          <h2 className="text-[17px] font-black text-[#0F172A]">Why This Matters</h2>
        </div>
        <p className="text-[14px] leading-[1.75] text-[#475569] mb-3">
          For too long, a gap has existed between Natchez residents and the officials they elected to serve them. Calls went to voicemail. Reports disappeared — no follow-up, no confirmation, no accountability.
        </p>
        <p className="text-[14px] leading-[1.75] text-[#475569] mb-3">
          <strong className="text-[#0F172A]">We The People 39120 bridges that gap.</strong> It doesn&apos;t replace city government — it empowers it. When residents report publicly and officials respond publicly, trust is built, problems get solved, and Natchez moves forward together.
        </p>
        <p className="text-[14px] leading-[1.75] text-[#475569] mb-4">
          Instead of pointing fingers, let&apos;s work <em>with</em> our elected officials. We elected them because we believed in them. <strong className="text-[#1A5EA8]">Together, we can make Natchez better.</strong>
        </p>
        <div className="border-l-[3px] border-[#1A5EA8] pl-4">
          <p className="text-[14px] leading-relaxed text-[#1A5EA8] font-bold italic">
            &ldquo;We See It. We Report It. We Fix It — Together.&rdquo;
          </p>
        </div>
      </section>

      {/* ── 30-DAY WINDOW ─────────────────────────────────────── */}
      <div className="mx-5 mb-5 p-5 bg-[#FEF3C7] rounded-2xl border border-[#FCD34D] flex gap-3.5 items-start">
        <div className="w-10 h-10 rounded-xl bg-[#FDE68A] flex items-center justify-center shrink-0">
          <svg viewBox="0 0 24 24" fill="none" stroke="#92400E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
            <circle cx="12" cy="12" r="10"/>
            <polyline points="12 6 12 12 16 14"/>
          </svg>
        </div>
        <div>
          <div className="font-black text-[14px] text-[#92400E] mb-1">The 30-Day Response Window</div>
          <p className="text-[13px] leading-[1.65] text-[#78350F]">
            Once a report is submitted, the elected official for that ward has <strong>30 days to respond publicly</strong>. Every response — or lack thereof — becomes part of the permanent community record.
          </p>
        </div>
      </div>

      {/* ── SECOND CTA ────────────────────────────────────────── */}
      <div className="mx-5 mb-5">
        <Link
          href="/report"
          className="flex items-center justify-center h-[56px] bg-[#2D7A4F] text-white font-black text-[16px] rounded-2xl shadow-lg cursor-pointer hover:bg-[#256040] transition-colors duration-200"
        >
          Join Your Community — Report Now
        </Link>
      </div>

      {/* ── REPRESENTATIVES ───────────────────────────────────── */}
      <section className="px-5 mb-5">
        <h2 className="text-[19px] font-black text-[#0F172A] mb-1">Your Representatives</h2>
        <p className="text-[#94A3B8] text-[13px] mb-4">Elected officials who serve Natchez.</p>
        <div className="flex flex-col gap-2">
          {ALDERMEN.map((a) => (
            <div key={a.ward} className="flex items-center justify-between px-4 py-3.5 bg-white rounded-xl border border-[#DDE3EC] shadow-sm">
              <div>
                <div className="text-[10px] font-black text-[#1A5EA8] uppercase tracking-wider mb-0.5">{a.ward}</div>
                <div className="font-bold text-[14px] text-[#0F172A]">{a.name}</div>
              </div>
              <a
                href={`tel:${a.phone}`}
                className="flex items-center gap-1.5 text-[#2D7A4F] text-[13px] font-bold cursor-pointer hover:text-[#1a4d30] transition-colors duration-150 shrink-0"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="15" height="15">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.41 2 2 0 0 1 3.6 1.22h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.82a16 16 0 0 0 6.29 6.29l.96-.96a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
                </svg>
                {a.display}
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* ── BOARD MEETINGS ────────────────────────────────────── */}
      <div className="mx-5 mb-5 p-4 bg-white rounded-2xl border border-[#DDE3EC] shadow-sm flex gap-3.5 items-start">
        <div className="w-9 h-9 rounded-xl bg-[#EBF2FB] flex items-center justify-center shrink-0">
          <svg viewBox="0 0 24 24" fill="none" stroke="#1A5EA8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="17" height="17">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
            <line x1="16" y1="2" x2="16" y2="6"/>
            <line x1="8" y1="2" x2="8" y2="6"/>
            <line x1="3" y1="10" x2="21" y2="10"/>
          </svg>
        </div>
        <div>
          <div className="font-bold text-[14px] text-[#0F172A] mb-1">Public Board Meetings</div>
          <p className="text-[13px] leading-relaxed text-[#475569]">
            The City Board meets the <strong className="text-[#0F172A]">2nd and 4th Tuesday</strong> of each month at <strong className="text-[#0F172A]">6:00 PM</strong> — City Hall, 215 Main Street, Natchez, MS 39120.
          </p>
        </div>
      </div>

      {/* ── PROFILE / LEADERBOARD ─────────────────────────────── */}
      <section className="mx-5 mb-5 p-5 bg-gradient-to-br from-[#EBF2FB] to-[#E8F5EE] rounded-2xl border border-[#C3D4EE]">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-9 h-9 rounded-xl bg-[#1A5EA8] flex items-center justify-center shrink-0">
            <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="17" height="17">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
            </svg>
          </div>
          <h2 className="text-[17px] font-black text-[#0F172A]">Create Your Profile</h2>
        </div>
        <p className="text-[14px] leading-[1.75] text-[#475569] mb-2">
          Track every report you submit — see its status, how many neighbors support it, and get notified the moment your alderman responds.
        </p>
        <p className="text-[13px] leading-relaxed text-[#475569] mb-4">
          Your profile builds your civic reputation. The more you participate, the more your voice matters in the community record.
        </p>
        <div className="flex gap-3">
          <Link
            href="/profile"
            className="flex-1 flex items-center justify-center h-[50px] bg-[#1A5EA8] text-white font-black text-[15px] rounded-xl shadow-md cursor-pointer hover:bg-[#154d8f] transition-colors duration-200"
          >
            Create Profile
          </Link>
          <Link
            href="/leaderboard"
            className="flex-1 flex items-center justify-center h-[50px] bg-[#2D7A4F] text-white font-black text-[15px] rounded-xl shadow-md cursor-pointer hover:bg-[#256040] transition-colors duration-200"
          >
            Leaderboard
          </Link>
        </div>
      </section>

      {/* ── FOOTER ────────────────────────────────────────────── */}
      <footer className="mx-5 mb-6 p-5 bg-white rounded-2xl border border-[#DDE3EC] text-center">
        <div className="flex flex-wrap gap-4 justify-center mb-3">
          <Link href="/map" className="text-[13px] text-[#1A5EA8] font-bold cursor-pointer hover:underline">Public Map</Link>
          <span className="text-[#DDE3EC]">·</span>
          <Link href="/report" className="text-[13px] text-[#1A5EA8] font-bold cursor-pointer hover:underline">Report Now</Link>
          <span className="text-[#DDE3EC]">·</span>
          <a href={FB_PAGE} target="_blank" rel="noopener noreferrer" className="text-[13px] text-[#1877F2] font-bold cursor-pointer hover:underline">Facebook</a>
        </div>
        <p className="text-[12px] text-[#94A3B8] leading-relaxed mb-1">We never share your personal information. Anonymous reporting is always available.</p>
        <p className="text-[12px] text-[#94A3B8]">
          Built for Natchez by{' '}
          <a href="https://klickifyagency.com" className="text-[#1A5EA8] font-semibold hover:underline">KlickifyAgency.com</a>
          {' '}·{' '}
          <a href="mailto:g@klickifyagency.com" className="text-[#1A5EA8] hover:underline">Want this in your city?</a>
        </p>
      </footer>

    </main>
  );
}
