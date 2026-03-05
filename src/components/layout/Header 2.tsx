'use client';

import { BRAND } from '@/lib/constants';
import { Bell } from 'lucide-react';
import Link from 'next/link';

interface HeaderProps {
  showLogo?: boolean;
  title?: string;
  subtitle?: string;
}

export function Header({ showLogo, title, subtitle }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 flex items-center justify-between px-4 py-3 pt-11 bg-[rgba(15,15,26,0.80)] backdrop-blur-xl border-b border-[var(--color-border)]">
      {showLogo ? (
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative w-11 h-11 flex items-center justify-center flex-shrink-0">
            <div className="absolute inset-0 rounded-xl opacity-20 blur-md group-hover:opacity-35 transition-opacity" style={{background:'linear-gradient(135deg,#7c3aed,#06b6d4)'}} />
            <div className="absolute inset-0 rounded-xl opacity-50" style={{background:'linear-gradient(135deg,#7c3aed,#a855f7,#06b6d4)'}} />
            <div className="absolute inset-[1.5px] rounded-[10px] bg-[rgba(8,8,16,0.85)]" />
            <span className="relative z-10 text-[11px] font-black tracking-tight" style={{background:'linear-gradient(135deg,#a855f7,#06b6d4)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent'}}>WTP</span>
          </div>
          <div className="min-w-0">
            <div className="text-[16px] font-bold leading-tight tracking-tight" style={{background:'linear-gradient(135deg,#a855f7,#06b6d4)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent'}}>
              We The People
            </div>
            <div className="text-[10px] font-semibold text-[var(--color-text-subtle)] tracking-[0.12em] uppercase mt-0.5">
              {BRAND.city} · {BRAND.zip}
            </div>
          </div>
        </Link>
      ) : (
        <div>
          <h1 className="text-[17px] font-bold text-[var(--color-text)]">{title}</h1>
          {subtitle && <p className="text-[11px] text-[var(--color-text-muted)] font-medium mt-0.5">{subtitle}</p>}
        </div>
      )}
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[var(--color-surface2)] border border-[var(--color-border)]">
          <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-success)] animate-pulse" />
          <span className="text-[10px] font-bold text-[var(--color-text-subtle)] uppercase tracking-wider">Live</span>
        </div>
        <Link href="/notifications" className="relative w-9 h-9 flex items-center justify-center rounded-xl bg-[var(--color-surface2)] border border-[var(--color-border)] text-[var(--color-text-muted)] hover:border-[var(--color-accent2)] transition-all" aria-label="Notifications">
          <Bell size={16} strokeWidth={2} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[var(--color-danger)] border-[1.5px] border-[var(--color-bg)]" />
        </Link>
      </div>
    </header>
  );
}
