'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Map } from 'lucide-react';

const NAV = [
  { href: '/',     label: 'Home', Icon: Home },
  { href: '/feed', label: 'Map',  Icon: Map  },
];

export function BottomNav() {
  const pathname = usePathname();
  return (
    <nav style={{
      position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)',
      width: '100%', maxWidth: '32rem', zIndex: 50,
      display: 'flex', alignItems: 'center',
      background: '#FFFFFF',
      borderTop: '1px solid #E2E8F4',
      paddingBottom: 'env(safe-area-inset-bottom)',
      boxShadow: '0 -4px 24px rgba(15,23,42,0.10)',
    }}>

      {/* Left: Home */}
      <NavItem href={NAV[0].href} label={NAV[0].label} Icon={NAV[0].Icon} active={pathname === '/'} />

      {/* Center: BIG Report button */}
      <Link href="/report" style={{
        flex: '0 0 auto',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        gap: 3, padding: '8px 24px', textDecoration: 'none',
      }}>
        <div style={{
          width: 64, height: 64, borderRadius: 20,
          background: 'linear-gradient(135deg, #1D4ED8 0%, #059669 100%)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 6px 28px rgba(29,78,216,0.45)',
          marginBottom: 2,
        }}>
          {/* Camera icon */}
          <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="28" height="28">
            <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
            <circle cx="12" cy="13" r="4"/>
          </svg>
        </div>
        <span style={{ fontSize: 11, fontWeight: 800, color: '#1D4ED8', letterSpacing: '0.03em' }}>REPORT</span>
      </Link>

      {/* Right: Map/Feed */}
      <NavItem href={NAV[1].href} label={NAV[1].label} Icon={NAV[1].Icon} active={pathname.startsWith('/feed') || pathname.startsWith('/map')} />
    </nav>
  );
}

function NavItem({ href, label, Icon, active }: { href: string; label: string; Icon: React.ElementType; active: boolean }) {
  return (
    <Link href={href} style={{
      flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', gap: 4, padding: '14px 0', textDecoration: 'none',
    }}>
      <Icon size={26} strokeWidth={active ? 2.5 : 2} style={{ color: active ? '#1D4ED8' : '#9CA3AF', transition: 'color 0.15s' }} />
      <span style={{ fontSize: 11, fontWeight: active ? 700 : 600, color: active ? '#1D4ED8' : '#9CA3AF', transition: 'color 0.15s' }}>
        {label}
      </span>
    </Link>
  );
}
