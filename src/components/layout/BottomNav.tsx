'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { MapPin, List, Plus, User } from 'lucide-react';

const NAV_ITEMS = [
  { href: '/map',     label: 'Map',     Icon: MapPin },
  { href: '/feed',    label: 'Feed',    Icon: List   },
  { href: '/report',  label: 'Report',  Icon: Plus   },
  { href: '/profile', label: 'Profile', Icon: User   },
];

export function BottomNav() {
  const pathname = usePathname();
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 flex max-w-lg mx-auto"
      style={{background:'#FFFFFF',borderTop:'1px solid #DDE3EC',paddingBottom:'env(safe-area-inset-bottom)',boxShadow:'0 -2px 12px rgba(0,0,0,0.06)'}}>
      {NAV_ITEMS.map(({ href, label, Icon }) => {
        const isActive = pathname === href || (href !== '/' && pathname.startsWith(href));
        const isReport = href === '/report';
        return (
          <Link key={href} href={href} className="flex-1 flex flex-col items-center justify-center gap-1 py-3"
            style={{textDecoration:'none'}}>
            {isReport ? (
              <div style={{width:44,height:44,borderRadius:14,background:'#1A5EA8',display:'flex',alignItems:'center',justifyContent:'center',marginBottom:2,boxShadow:'0 4px 12px rgba(26,94,168,0.35)'}}>
                <Icon size={22} strokeWidth={2.5} color="#fff" />
              </div>
            ) : (
              <Icon size={22} strokeWidth={isActive ? 2.5 : 2}
                style={{color: isActive ? '#1A5EA8' : '#94A3B8', transition:'color 0.15s'}} />
            )}
            <span style={{fontSize:10,fontWeight:isActive?700:600,color:isReport?'#1A5EA8':isActive?'#1A5EA8':'#94A3B8',transition:'color 0.15s'}}>{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
