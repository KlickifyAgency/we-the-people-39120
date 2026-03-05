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
    <nav className="fixed bottom-0 left-0 right-0 z-50 flex max-w-lg mx-auto bg-[rgba(15,15,26,0.97)] border-t border-[var(--color-border)] backdrop-blur-xl" style={{paddingBottom:'env(safe-area-inset-bottom)'}}>
      {NAV_ITEMS.map(({ href, label, Icon }) => {
        const isReport = href === '/report';
        const isActive = pathname === href || (href !== '/' && pathname.startsWith(href));

        return (
          <Link key={href} href={href} className="flex-1 flex flex-col items-center justify-center gap-1 py-3">
            <Icon size={20} strokeWidth={isActive ? 2.5 : 2} style={{color: isActive ? '#a855f7' : '#484870', transition:'color 0.15s'}} />
            <span className="text-[10px] font-semibold transition-colors" style={{color: isActive ? '#a855f7' : '#484870'}}>{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
