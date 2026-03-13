'use client';
import Link from 'next/link';
import { PWAInstallBanner } from '@/components/shared/PWAInstallBanner';

const STEPS = [
  { num: '1', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="22" height="22"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>, action: 'Snap a Photo', detail: 'Point your phone at the problem' },
  { num: '2', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="22" height="22"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>, action: 'Confirm Location', detail: 'GPS pins it automatically' },
  { num: '3', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="22" height="22"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>, action: 'Pick a Category', detail: 'Pothole, dumping, graffiti and more' },
  { num: '4', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="22" height="22"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>, action: 'Post it Publicly', detail: 'Visible to the entire community' },
  { num: '5', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="22" height="22"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>, action: 'Alderman Notified', detail: 'Direct line — 30-day response window' },
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

const FB_PAGE = 'https://www.facebook.com/profile.php?id=61588640650718';
const C = { bg:'#F7F9FC', white:'#FFFFFF', border:'#DDE3EC', blue:'#1A5EA8', blueSoft:'#EBF2FB', green:'#2D7A4F', greenSoft:'#E8F5EE', amberSoft:'#FEF3C7', textMain:'#0F172A', textSub:'#475569', textMuted:'#94A3B8' };

export default function HomePage() {
  return (
    <main style={{minHeight:'100vh',background:C.bg,paddingBottom:120,maxWidth:560,margin:'0 auto',fontFamily:'-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif'}}>

      <div style={{background:`linear-gradient(160deg,${C.blueSoft} 0%,${C.white} 100%)`,padding:'40px 24px 32px',textAlign:'center',borderBottom:`1px solid ${C.border}`}}>
        <div style={{display:'flex',justifyContent:'center',marginBottom:20}}>
          <img src="/logo-wtp.png" alt="We The People 39120" style={{height:75,objectFit:'contain'}} />
        </div>
        <h1 style={{fontSize:30,fontWeight:900,color:C.textMain,lineHeight:1.2,marginBottom:10}}>
          We See It.<br/>We Report It.<br/><span style={{color:C.blue}}>We Fix It — Together.</span>
        </h1>
        <p style={{fontSize:16,color:C.textSub,lineHeight:1.65,marginBottom:24}}>
          Connecting Natchez residents directly with their elected officials — where neighborhood problems get seen, tracked, and resolved.
        </p>
        <Link href="/report" style={{display:'flex',alignItems:'center',justifyContent:'center',gap:10,background:C.blue,color:C.white,fontWeight:800,fontSize:18,height:64,borderRadius:16,textDecoration:'none',boxShadow:'0 4px 20px rgba(26,94,168,0.35)',marginBottom:12}}>
          <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="22" height="22"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>
          Report a Problem — It's Free
        </Link>
        <p style={{fontSize:13,color:C.textMuted}}>Anonymous reporting always available · Takes 30 seconds</p>
      </div>

      <div style={{margin:'24px 20px',padding:'20px 22px',background:C.white,borderRadius:16,border:`1px solid ${C.border}`}}>
        <p style={{fontSize:16,lineHeight:1.75,color:C.textSub,margin:0}}>
          <strong style={{color:C.textMain}}>We The People 39120</strong> is a free civic platform built for the residents of Natchez, Mississippi. For the first time, citizens and their elected officials can work together — in real time — to take care of the city they both love.
        </p>
      </div>

      <PWAInstallBanner />

      <div style={{margin:'0 20px 24px',padding:'18px 20px',background:'#EEF3FB',borderRadius:16,border:'1px solid #C3D4EE',textAlign:'center'}}>
        <div style={{display:'flex',alignItems:'center',justifyContent:'center',gap:8,marginBottom:8}}>
          <svg viewBox="0 0 24 24" fill="#1877F2" width="20" height="20"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
          <span style={{color:'#1877F2',fontWeight:800,fontSize:15}}>Follow us on Facebook</span>
        </div>
        <p style={{fontSize:14,color:C.textSub,marginBottom:14,lineHeight:1.5}}>Every new report is shared publicly on our Facebook page. Stay informed and help spread the word.</p>
        <a href={FB_PAGE} target="_blank" rel="noopener noreferrer" style={{display:'flex',alignItems:'center',justifyContent:'center',gap:14,background:'#1877F2',color:C.white,fontWeight:800,fontSize:17,padding:'16px 24px',borderRadius:14,textDecoration:'none',boxShadow:'0 4px 14px rgba(24,119,242,0.3)'}}>
          <svg viewBox="0 0 24 24" fill="white" width="30" height="30"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
          <span>We The People 39120 on Facebook</span>
        </a>
      </div>

      <div style={{margin:'0 20px 24px'}}>
        <h2 style={{fontSize:20,fontWeight:900,color:C.textMain,marginBottom:4}}>Civic Action, Made Simple</h2>
        <p style={{fontSize:14,color:C.textMuted,marginBottom:16}}>Five easy steps to get your neighborhood problem on the public record.</p>
        <div style={{display:'flex',flexDirection:'column',gap:10}}>
          {STEPS.map((s, i) => (
            <div key={i} style={{display:'flex',alignItems:'center',gap:14,padding:'14px 16px',background:C.white,borderRadius:14,border:`1px solid ${C.border}`}}>
              <div style={{width:46,height:46,borderRadius:12,background:C.blueSoft,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,color:C.blue}}>{s.icon}</div>
              <div style={{flex:1}}>
                <div style={{fontWeight:800,fontSize:15,color:C.textMain,marginBottom:2}}>{s.action}</div>
                <div style={{fontSize:13,color:C.textMuted}}>{s.detail}</div>
              </div>
              <div style={{width:28,height:28,borderRadius:'50%',background:C.blue,display:'flex',alignItems:'center',justifyContent:'center',fontSize:13,fontWeight:900,color:C.white,flexShrink:0}}>{s.num}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{margin:'0 20px 24px',padding:'20px 22px',background:C.white,borderRadius:16,border:`1px solid ${C.border}`}}>
        <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:14}}>
          <div style={{width:38,height:38,borderRadius:10,background:C.greenSoft,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
            <svg viewBox="0 0 24 24" fill="none" stroke={C.green} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="20" height="20"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
          </div>
          <h2 style={{fontSize:18,fontWeight:900,color:C.textMain,margin:0}}>Why This Matters</h2>
        </div>
        <p style={{fontSize:15,lineHeight:1.75,color:C.textSub,marginBottom:12}}>For too long, a gap has existed between Natchez residents and the officials they elected to serve them. Calls went to voicemail. Reports submitted through the City's website disappeared — no follow-up, no confirmation, no accountability.</p>
        <p style={{fontSize:15,lineHeight:1.75,color:C.textSub,marginBottom:12}}><strong style={{color:C.textMain}}>We The People 39120 bridges that gap.</strong> It doesn't replace city government — it empowers it. When residents report publicly and officials respond publicly, trust is built, problems get solved, and Natchez moves forward together.</p>
        <p style={{fontSize:15,lineHeight:1.75,color:C.textSub,marginBottom:16}}>It's easy to complain — we've all done it. But complaining alone changes nothing. Instead of pointing fingers at the elected official of the moment, let's try something different: let's work <em>with</em> them. We elected them because we believed in them. Now let's help them do their jobs better. Civic change is not just the government's responsibility — it's ours too. <strong style={{color:C.blue}}>Together, we can make Natchez better.</strong></p>
        <div style={{borderLeft:`3px solid ${C.blue}`,paddingLeft:14}}>
          <p style={{fontSize:15,lineHeight:1.6,color:C.blue,fontWeight:700,margin:0,fontStyle:'italic'}}>"We See It. We Report It. We Fix It — Together."</p>
        </div>
      </div>

      <div style={{margin:'0 20px 24px',padding:'18px 20px',background:C.amberSoft,borderRadius:16,border:'1px solid #FCD34D',display:'flex',gap:14,alignItems:'flex-start'}}>
        <div style={{width:40,height:40,borderRadius:10,background:'#FDE68A',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
          <svg viewBox="0 0 24 24" fill="none" stroke="#92400E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="20" height="20"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
        </div>
        <div>
          <div style={{fontWeight:800,fontSize:15,color:'#92400E',marginBottom:4}}>The 30-Day Response Window</div>
          <p style={{fontSize:14,lineHeight:1.65,color:'#78350F',margin:0}}>Once a report is submitted, the elected official for that ward has <strong>30 days to respond publicly</strong>. Every response — or lack thereof — becomes part of the permanent community record. Public accountability drives real results.</p>
        </div>
      </div>

      <div style={{margin:'0 20px 24px'}}>
        <Link href="/report" style={{display:'block',textAlign:'center',lineHeight:'60px',background:C.green,color:C.white,fontWeight:800,fontSize:17,height:60,borderRadius:16,textDecoration:'none',boxShadow:'0 4px 18px rgba(45,122,79,0.3)'}}>
          Join Your Community — Report Now
        </Link>
      </div>

      <div style={{margin:'0 20px 24px'}}>
        <h2 style={{fontSize:20,fontWeight:900,color:C.textMain,marginBottom:4}}>Your Representatives</h2>
        <p style={{fontSize:14,color:C.textMuted,marginBottom:14}}>These are the elected officials who serve Natchez.</p>
        <div style={{display:'flex',flexDirection:'column',gap:8}}>
          {ALDERMEN.map(a => (
            <div key={a.ward} style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'14px 16px',background:C.white,borderRadius:14,border:`1px solid ${C.border}`}}>
              <div>
                <div style={{fontSize:11,fontWeight:800,color:C.blue,textTransform:'uppercase',letterSpacing:'0.07em',marginBottom:2}}>{a.ward}</div>
                <div style={{fontWeight:700,fontSize:15,color:C.textMain}}>{a.name}</div>
              </div>
              <a href={`tel:${a.phone}`} style={{display:'flex',alignItems:'center',gap:6,color:C.green,fontSize:14,fontWeight:700,textDecoration:'none',flexShrink:0}}>
                <svg viewBox="0 0 24 24" fill="none" stroke={C.green} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.41 2 2 0 0 1 3.6 1.22h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.82a16 16 0 0 0 6.29 6.29l.96-.96a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                {a.display}
              </a>
            </div>
          ))}
        </div>
      </div>

      <div style={{margin:'0 20px 24px',padding:'18px 20px',background:C.white,borderRadius:16,border:`1px solid ${C.border}`,display:'flex',gap:14,alignItems:'flex-start'}}>
        <div style={{width:40,height:40,borderRadius:10,background:C.blueSoft,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
          <svg viewBox="0 0 24 24" fill="none" stroke={C.blue} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="20" height="20"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
        </div>
        <div>
          <div style={{fontWeight:800,fontSize:15,color:C.textMain,marginBottom:4}}>Public Board Meetings</div>
          <p style={{fontSize:14,lineHeight:1.65,color:C.textSub,margin:0}}>The City Board meets the <strong style={{color:C.textMain}}>2nd and 4th Tuesday</strong> of each month at <strong style={{color:C.textMain}}>6:00 PM</strong> — City Hall, 215 Main Street, Natchez, MS 39120.</p>
        </div>
      </div>

      <div style={{margin:'0 20px 24px',padding:'20px 22px',background:C.blueSoft,borderRadius:16,border:`1px solid #C3D4EE`}}>
        <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:14}}>
          <div style={{width:38,height:38,borderRadius:10,background:C.blue,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
            <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="20" height="20"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          </div>
          <h2 style={{fontSize:18,fontWeight:900,color:C.textMain,margin:0}}>Create Your Profile</h2>
        </div>
        <p style={{fontSize:15,lineHeight:1.75,color:C.textSub,marginBottom:12}}>When you create a free profile, you can <strong style={{color:C.textMain}}>track every report you submit</strong> — see its status, how many neighbors support it, and get notified the moment your alderman responds.</p>
        <p style={{fontSize:14,lineHeight:1.65,color:C.textSub,marginBottom:16}}>Your profile also builds your civic reputation. The more you participate, the more your voice matters in the community record.</p>
        <div style={{display:'flex',gap:10}}>
          <Link href="/profile" style={{flex:1,display:'block',textAlign:'center',lineHeight:'52px',background:C.blue,color:'white',fontWeight:800,fontSize:16,height:52,borderRadius:14,textDecoration:'none',boxShadow:'0 4px 16px rgba(26,94,168,0.3)'}}>
            Create Profile
          </Link>
          <Link href="/leaderboard" style={{flex:1,display:'block',textAlign:'center',lineHeight:'52px',background:C.green,color:'white',fontWeight:800,fontSize:16,height:52,borderRadius:14,textDecoration:'none',boxShadow:'0 4px 16px rgba(45,122,79,0.3)'}}>
            🏆 Leaderboard
          </Link>
        </div>
      </div>

      <div style={{margin:'0 20px',padding:'20px',background:C.white,borderRadius:16,border:`1px solid ${C.border}`,textAlign:'center'}}>
        <div style={{display:'flex',flexWrap:'wrap',gap:16,justifyContent:'center',marginBottom:14}}>
          <Link href="/map" style={{fontSize:14,color:C.blue,fontWeight:700,textDecoration:'none'}}>Public Map</Link>
          <span style={{color:C.border}}>·</span>
          <Link href="/report" style={{fontSize:14,color:C.blue,fontWeight:700,textDecoration:'none'}}>Report Now</Link>
          <span style={{color:C.border}}>·</span>
          <a href={FB_PAGE} target="_blank" rel="noopener noreferrer" style={{fontSize:14,color:'#1877F2',fontWeight:700,textDecoration:'none'}}>Facebook</a>
        </div>
        <p style={{fontSize:13,color:C.textMuted,lineHeight:1.6,marginBottom:10}}>We never share your personal information. Anonymous reporting is always available.</p>
        <p style={{fontSize:13,color:C.textMuted,margin:0}}>Built for Natchez by <a href="https://klickifyagency.com" style={{color:C.blue,fontWeight:600}}>KlickifyAgency.com</a> · <a href="mailto:g@klickifyagency.com" style={{color:C.blue}}>Want this in your city?</a></p>
      </div>

    </main>
  );
}
