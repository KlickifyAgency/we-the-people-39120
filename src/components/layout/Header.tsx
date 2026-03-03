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
    <header style={{position:'sticky',top:0,zIndex:50,display:'flex',alignItems:'center',justifyContent:'space-between',padding:'44px 16px 12px',background:'rgba(255,255,255,0.95)',backdropFilter:'blur(16px)',borderBottom:'1px solid #DDE3EC',boxShadow:'0 1px 8px rgba(0,0,0,0.06)'}}>
      {showLogo ? (
        <Link href="/" style={{display:'flex',alignItems:'center',gap:10,textDecoration:'none'}}>
          <div style={{width:40,height:40,borderRadius:12,background:'#1A5EA8',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
            <span style={{color:'#fff',fontSize:11,fontWeight:900,letterSpacing:'-0.02em'}}>WTP</span>
          </div>
          <div>
            <div style={{fontSize:16,fontWeight:800,color:'#1A5EA8',lineHeight:1.1}}>We The People</div>
            <div style={{fontSize:10,fontWeight:700,color:'#94A3B8',letterSpacing:'0.12em',textTransform:'uppercase',marginTop:2}}>{BRAND.city} · {BRAND.zip}</div>
          </div>
        </Link>
      ) : (
        <div>
          <h1 style={{fontSize:17,fontWeight:800,color:'#0F172A'}}>{title}</h1>
          {subtitle && <p style={{fontSize:11,color:'#94A3B8',fontWeight:500,marginTop:2}}>{subtitle}</p>}
        </div>
      )}
      <div style={{display:'flex',alignItems:'center',gap:8}}>
        <div style={{display:'flex',alignItems:'center',gap:6,padding:'4px 10px',borderRadius:100,background:'#E8F5EE',border:'1px solid #A7D4B8'}}>
          <div style={{width:6,height:6,borderRadius:'50%',background:'#2D7A4F',animation:'pulse 2s infinite'}} />
          <span style={{fontSize:10,fontWeight:700,color:'#2D7A4F',textTransform:'uppercase',letterSpacing:'0.08em'}}>Live</span>
        </div>
        <Link href="/notifications" style={{position:'relative',width:36,height:36,display:'flex',alignItems:'center',justifyContent:'center',borderRadius:10,background:'#F7F9FC',border:'1px solid #DDE3EC',textDecoration:'none'}}>
          <Bell size={16} strokeWidth={2} color="#475569" />
          <span style={{position:'absolute',top:6,right:6,width:8,height:8,borderRadius:'50%',background:'#DC2626',border:'2px solid #fff'}} />
        </Link>
      </div>
    </header>
  );
}
