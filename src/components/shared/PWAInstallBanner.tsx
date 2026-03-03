'use client';
import { useState, useEffect } from 'react';

export function PWAInstallBanner() {
  const [show, setShow] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isAndroid, setIsAndroid] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [installed, setInstalled] = useState(false);
  const [showIOSSteps, setShowIOSSteps] = useState(false);

  useEffect(() => {
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone;
    if (isStandalone) { setInstalled(true); return; }

    const ua = navigator.userAgent;
    const ios = /iphone|ipad|ipod/i.test(ua);
    const android = /android/i.test(ua);
    setIsIOS(ios);
    setIsAndroid(android);

    if (ios || android) setShow(true);

    const handler = (e: any) => { e.preventDefault(); setDeferredPrompt(e); setShow(true); };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleAndroidInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const result = await deferredPrompt.userChoice;
      if (result.outcome === 'accepted') { setInstalled(true); setShow(false); }
      setDeferredPrompt(null);
    }
  };

  if (!show || installed) return null;

  return (
    <div style={{margin:'0 20px 24px',borderRadius:16,overflow:'hidden',border:'1px solid #C3D4EE',boxShadow:'0 4px 16px rgba(26,94,168,0.12)'}}>
      <div style={{background:'linear-gradient(135deg,#1A5EA8,#2D7A4F)',padding:'16px 20px',display:'flex',alignItems:'center',gap:12}}>
        <div style={{width:44,height:44,borderRadius:12,background:'rgba(255,255,255,0.15)',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
          <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="24" height="24"><path d="M12 2L12 14M12 14L8 10M12 14L16 10"/><path d="M3 17v3a1 1 0 001 1h16a1 1 0 001-1v-3"/></svg>
        </div>
        <div style={{flex:1}}>
          <div style={{color:'white',fontWeight:800,fontSize:15,lineHeight:1.2}}>Install the App</div>
          <div style={{color:'rgba(255,255,255,0.8)',fontSize:12,marginTop:2}}>Add to your home screen — free, no app store needed</div>
        </div>
        <button onClick={() => setShow(false)} style={{background:'rgba(255,255,255,0.15)',border:'none',borderRadius:8,width:28,height:28,display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer',flexShrink:0}}>
          <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" width="14" height="14"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      </div>

      <div style={{background:'#EBF2FB',padding:'16px 20px'}}>
        {isAndroid && (
          <button onClick={handleAndroidInstall} style={{width:'100%',height:48,borderRadius:12,background:'#1A5EA8',color:'white',fontWeight:800,fontSize:15,border:'none',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',gap:8}}>
            <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="18" height="18"><path d="M12 2L12 14M12 14L8 10M12 14L16 10"/><path d="M3 17v3a1 1 0 001 1h16a1 1 0 001-1v-3"/></svg>
            Tap Here to Install
          </button>
        )}

        {isIOS && !showIOSSteps && (
          <button onClick={() => setShowIOSSteps(true)} style={{width:'100%',height:48,borderRadius:12,background:'#1A5EA8',color:'white',fontWeight:800,fontSize:15,border:'none',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',gap:8}}>
            <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="18" height="18"><path d="M12 2L12 14M12 14L8 10M12 14L16 10"/><path d="M3 17v3a1 1 0 001 1h16a1 1 0 001-1v-3"/></svg>
            Show Me How to Install
          </button>
        )}

        {isIOS && showIOSSteps && (
          <div style={{display:'flex',flexDirection:'column',gap:10}}>
            <div style={{fontSize:13,fontWeight:700,color:'#1A5EA8',marginBottom:4}}>3 easy steps — takes 10 seconds:</div>
            {[
              { num:'1', icon: <svg viewBox="0 0 24 24" fill="none" stroke="#1A5EA8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="20" height="20"><path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/></svg>, text: 'Tap the Share button at the bottom of Safari (the box with the arrow pointing up)' },
              { num:'2', icon: <svg viewBox="0 0 24 24" fill="none" stroke="#1A5EA8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="20" height="20"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>, text: 'Scroll down in the menu and tap "Add to Home Screen"' },
              { num:'3', icon: <svg viewBox="0 0 24 24" fill="none" stroke="#1A5EA8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="20" height="20"><polyline points="20 6 9 17 4 12"/></svg>, text: 'Tap "Add" in the top right corner — done!' },
            ].map(s => (
              <div key={s.num} style={{display:'flex',alignItems:'flex-start',gap:12,padding:'12px 14px',background:'white',borderRadius:12,border:'1px solid #DDE3EC'}}>
                <div style={{width:32,height:32,borderRadius:8,background:'#EBF2FB',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>{s.icon}</div>
                <div style={{fontSize:14,color:'#475569',lineHeight:1.5,paddingTop:2}}><strong style={{color:'#0F172A'}}>Step {s.num}:</strong> {s.text}</div>
              </div>
            ))}
            <div style={{padding:'10px 14px',background:'#FEF3C7',borderRadius:10,border:'1px solid #FCD34D',fontSize:13,color:'#92400E'}}>
              <strong>Must use Safari on iPhone.</strong> If you're in Chrome, copy the link and open it in Safari first.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
