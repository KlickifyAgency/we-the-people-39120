'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { List, User, Home } from 'lucide-react';

const NAV_ITEMS = [
  { href: '/',        label: 'Home',    Icon: Home   },
  { href: '/feed',    label: 'Feed',    Icon: List   },
  { href: '/report',  label: 'Report',  Icon: null   },
  { href: '/profile', label: 'Profile', Icon: User   },
];

export function BottomNav() {
  const pathname = usePathname();
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 flex max-w-lg mx-auto"
      style={{background:'#FFFFFF',borderTop:'1px solid #DDE3EC',paddingBottom:'env(safe-area-inset-bottom)',boxShadow:'0 -2px 12px rgba(0,0,0,0.06)'}}>
      {NAV_ITEMS.map(({ href, label, Icon }) => {
        const isActive = href === '/' ? pathname === '/' : pathname === href || pathname.startsWith(href);
        const isReport = href === '/report';
        return (
          <Link key={href} href={href} className="flex-1 flex flex-col items-center justify-center gap-1 py-3"
            style={{textDecoration:'none'}}>
            {isReport ? (
              <div style={{width:44,height:44,borderRadius:14,background:'#1A5EA8',display:'flex',alignItems:'center',justifyContent:'center',marginBottom:2,boxShadow:'0 4px 12px rgba(26,94,168,0.35)'}}>
                <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="22" height="22"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>
              </div>
            ) : (
              Icon ? <Icon size={22} strokeWidth={isActive ? 2.5 : 2} style={{color: isActive ? '#1A5EA8' : '#94A3B8', transition:'color 0.15s'}} /> : null
            )}
            <span style={{fontSize:10,fontWeight:isActive?700:600,color:isReport?'#1A5EA8':isActive?'#1A5EA8':'#94A3B8',transition:'color 0.15s'}}>{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
