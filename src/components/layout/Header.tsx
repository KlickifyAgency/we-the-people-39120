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
    <header className="sticky top-0 z-50 flex items-center justify-between px-4 pt-11 pb-3 bg-white/95 backdrop-blur-md border-b border-[#DDE3EC] shadow-[0_1px_8px_rgba(0,0,0,0.06)]">
      {showLogo ? (
        <Link href="/" className="flex items-center gap-2.5 no-underline">
          <div className="w-9 h-9 rounded-xl bg-[#1A5EA8] flex items-center justify-center shrink-0">
            <span className="text-white text-[10px] font-black tracking-tight">WTP</span>
          </div>
          <div>
            <div className="text-[15px] font-bold text-[#1A5EA8] leading-none">We The People</div>
            <div className="text-[10px] font-bold text-[#94A3B8] tracking-widest uppercase mt-1">{BRAND.city} · {BRAND.zip}</div>
          </div>
        </Link>
      ) : (
        <div>
          <h1 className="text-[17px] font-bold text-[#0F172A]">{title}</h1>
          {subtitle && <p className="text-[11px] text-[#94A3B8] font-medium mt-0.5">{subtitle}</p>}
        </div>
      )}

      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#E8F5EE] border border-[#A7D4B8]">
          <div className="w-1.5 h-1.5 rounded-full bg-[#2D7A4F] animate-pulse" />
          <span className="text-[10px] font-bold text-[#2D7A4F] uppercase tracking-widest">Live</span>
        </div>
        <Link
          href="/notifications"
          className="relative w-9 h-9 flex items-center justify-center rounded-xl bg-[#F7F9FC] border border-[#DDE3EC] no-underline hover:bg-[#EBF2FB] transition-colors duration-150"
        >
          <Bell size={16} strokeWidth={2} color="#475569" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#DC2626] border-2 border-white" />
        </Link>
      </div>
    </header>
  );
}
