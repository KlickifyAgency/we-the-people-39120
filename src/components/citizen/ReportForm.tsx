'use client';

import { useState, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useLocation } from '@/hooks/useLocation';
import { useCreateReport } from '@/hooks/useReports';
import { CATEGORIES, CATEGORY_ICONS } from '@/lib/constants';
import { ReportCategory } from '@/lib/types';
import { Camera, MapPin, Loader2, CheckCircle2, ChevronRight, ChevronLeft, X, AlertTriangle, Image } from 'lucide-react';

const C = {
  bg: '#F7F9FC', surface: '#FFFFFF', border: '#DDE3EC',
  blue: '#1A5EA8', blueSoft: '#EBF2FB',
  green: '#2D7A4F', greenSoft: '#E8F5EE',
  amber: '#B45309', amberSoft: '#FEF3C7',
  textMain: '#0F172A', textSub: '#475569', textMuted: '#94A3B8',
  white: '#FFFFFF', danger: '#DC2626', dangerSoft: '#FEE2E2',
};

const CAT_COLORS: Record<string, string> = {
  graffiti: '#7C3AED', dumping: '#2D7A4F', abandoned_vehicle: '#B45309',
  property_neglect: '#6D28D9', noise: '#0369A1', street_issues: '#DC2626',
  vegetation: '#2D7A4F', animal: '#C2410C', safety_hazard: '#B45309',
  water_drainage: '#0284C7', public_safety: '#DC2626',
};

const GPS_MESSAGES: Record<string, { title: string; body: string; fix: string }> = {
  GPS_DENIED: {
    title: 'Location access is turned off',
    body: 'Your phone is blocking this app from seeing your location.',
    fix: 'iPhone: Settings → Privacy & Security → Location Services → Safari → "While Using"\n\nAndroid: Tap the lock icon in your browser → tap Location → Allow',
  },
  GPS_UNAVAILABLE: {
    title: 'Cannot find your location right now',
    body: 'This usually happens indoors or in areas with poor signal.',
    fix: 'Step outside or near a window and tap the button again.',
  },
  GPS_TIMEOUT: {
    title: 'It took too long',
    body: 'Your phone could not find your location in time.',
    fix: 'Tap the button again. Make sure you are outdoors if possible.',
  },
  NEEDS_HTTPS: {
    title: 'GPS requires a secure connection',
    body: 'Safari on iPhone only allows location on secure (https) websites.',
    fix: 'Use the app link at we-the-people-39120.vercel.app',
  },
  GPS_NOT_SUPPORTED: {
    title: 'GPS not available',
    body: 'This device does not support location detection.',
    fix: 'Try using a smartphone with GPS enabled.',
  },
};

type Step = 'category' | 'photo' | 'location' | 'description' | 'confirm';
const STEPS: Step[] = ['category', 'photo', 'location', 'description', 'confirm'];

export function ReportForm() {
  const router = useRouter();
  const loc = useLocation();
  const { mutateAsync: createReport } = useCreateReport();

  const [step, setStep] = useState<Step>('category');
  const [category, setCategory] = useState<ReportCategory | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [description, setDescription] = useState('');
  const [anonymous, setAnonymous] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [cameraOpen, setCameraOpen] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);

  const fileRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const progress = ((STEPS.indexOf(step) + 1) / STEPS.length) * 100;

  const goNext = () => { const i = STEPS.indexOf(step); if (i < STEPS.length - 1) setStep(STEPS[i + 1]); };
  const goBack = () => { const i = STEPS.indexOf(step); if (i > 0) setStep(STEPS[i - 1]); else router.back(); };

  const openCamera = useCallback(async () => {
    try {
      const s = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      setStream(s); setCameraOpen(true);
      setTimeout(() => { if (videoRef.current) { videoRef.current.srcObject = s; videoRef.current.play(); } }, 80);
    } catch { fileRef.current?.click(); }
  }, []);

  const capturePhoto = useCallback(() => {
    if (!videoRef.current) return;
    const c = document.createElement('canvas');
    c.width = videoRef.current.videoWidth; c.height = videoRef.current.videoHeight;
    c.getContext('2d')!.drawImage(videoRef.current, 0, 0);
    c.toBlob(blob => {
      if (!blob) return;
      setPhotoFile(new File([blob], 'photo.jpg', { type: 'image/jpeg' }));
      setPhotoPreview(c.toDataURL('image/jpeg', 0.85));
      stream?.getTracks().forEach(t => t.stop());
      setStream(null); setCameraOpen(false);
    }, 'image/jpeg', 0.85);
  }, [stream]);

  const closeCamera = useCallback(() => {
    stream?.getTracks().forEach(t => t.stop());
    setStream(null); setCameraOpen(false);
  }, [stream]);

  const onFile = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]; if (!f) return;
    setPhotoFile(f); setPhotoPreview(URL.createObjectURL(f));
  }, []);

  const handleSubmit = async () => {
    if (!category) return;
    setSubmitting(true);
    try {
      const fd = new FormData();
      fd.append('category', category);
      fd.append('lat', String(loc.lat ?? 31.5604));
      fd.append('lng', String(loc.lng ?? -91.4032));
      fd.append('description', description);
      fd.append('anonymous', String(anonymous));
      if (photoFile) fd.append('photo', photoFile);
      await createReport(fd);
      setSubmitted(true);
    } catch (err: any) {
      alert('Error: ' + (err?.message || 'Something went wrong. Please try again.'));
    } finally { setSubmitting(false); }
  };

  // Camera view
  if (cameraOpen) return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col">
      <video ref={videoRef} className="flex-1 w-full object-cover" playsInline muted />
      <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between bg-gradient-to-t from-black/80 to-transparent" style={{padding:"24px 32px",paddingBottom:"calc(env(safe-area-inset-bottom) + 90px)"}}>
        <button onClick={closeCamera} className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
          <X size={24} color="#fff" />
        </button>
        <button onClick={capturePhoto} className="w-20 h-20 rounded-full border-4 border-white bg-white/20 flex items-center justify-center active:scale-95 transition-transform">
          <div className="w-14 h-14 rounded-full bg-white" />
        </button>
        <div className="w-12" />
      </div>
    </div>
  );

  // Success view
  if (submitted) return (
    <div style={{background:C.bg,minHeight:'100vh',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',padding:'32px 24px',textAlign:'center',gap:24}}>
      <div style={{width:96,height:96,borderRadius:'50%',background:C.green,display:'flex',alignItems:'center',justifyContent:'center',boxShadow:'0 8px 32px rgba(45,122,79,0.35)'}}>
        <CheckCircle2 size={48} color="#fff" strokeWidth={2} />
      </div>
      <div>
        <h2 style={{fontSize:26,fontWeight:900,color:C.textMain,marginBottom:10}}>Report Submitted!</h2>
        <p style={{fontSize:16,color:C.textSub,lineHeight:1.65}}>
          Your report is now on the public record. Thank you for taking action to improve Natchez. Together, we make a difference.
        </p>
      </div>
      <button onClick={() => router.push('/')}
        style={{width:'100%',height:56,borderRadius:16,fontWeight:800,fontSize:16,color:C.white,background:C.blue,border:'none',cursor:'pointer',boxShadow:'0 4px 20px rgba(26,94,168,0.3)'}}>
        Back to Home
      </button>
    </div>
  );

  const gpsMsg = loc.error ? GPS_MESSAGES[loc.error] : null;

  return (
    <div style={{display:'flex',flexDirection:'column',height:'100%',background:C.bg}}>

      {/* Header */}
      <div style={{display:'flex',alignItems:'center',gap:12,padding:'44px 16px 12px',borderBottom:`1px solid ${C.border}`,background:C.white}}>
        <button onClick={goBack} style={{width:40,height:40,display:'flex',alignItems:'center',justifyContent:'center',borderRadius:12,background:C.blueSoft,border:`1px solid ${C.border}`,cursor:'pointer'}}>
          <ChevronLeft size={20} color={C.blue} />
        </button>
        <div style={{flex:1}}>
          <div style={{fontSize:17,fontWeight:800,color:C.textMain}}>Report an Issue</div>
          <div style={{fontSize:12,color:C.textMuted}}>Step {STEPS.indexOf(step) + 1} of {STEPS.length}</div>
        </div>
        {step !== 'confirm' && (
          <button onClick={goNext} disabled={step === 'category' && !category}
            style={{display:'flex',alignItems:'center',gap:6,height:40,paddingLeft:16,paddingRight:16,borderRadius:12,fontWeight:800,fontSize:15,color:C.white,background:C.blue,border:'none',cursor:'pointer',opacity:step==='category'&&!category?0.4:1,boxShadow:'0 2px 10px rgba(26,94,168,0.3)'}}>
            Next <ChevronRight size={18} />
          </button>
        )}
        {step === 'confirm' && (
          <button onClick={handleSubmit} disabled={submitting || !category}
            style={{display:'flex',alignItems:'center',gap:6,height:40,paddingLeft:16,paddingRight:16,borderRadius:12,fontWeight:800,fontSize:15,color:C.white,background:C.green,border:'none',cursor:'pointer',opacity:submitting||!category?0.5:1,boxShadow:'0 2px 10px rgba(45,122,79,0.3)'}}>
            {submitting ? <Loader2 size={16} className="animate-spin" /> : null}
            {submitting ? 'Sending…' : 'Submit'}
          </button>
        )}
      </div>

      {/* Progress bar */}
      <div style={{height:4,background:C.border,flexShrink:0}}>
        <div style={{height:'100%',width:`${progress}%`,background:C.blue,transition:'width 0.3s ease'}} />
      </div>

      {/* Content */}
      <div style={{flex:1,overflowY:'auto',padding:'20px 16px',display:'flex',flexDirection:'column',gap:16}}>

        {/* STEP: CATEGORY */}
        {step === 'category' && <>
          <div>
            <h2 style={{fontSize:22,fontWeight:900,color:C.textMain,marginBottom:4}}>What are you reporting?</h2>
            <p style={{fontSize:15,color:C.textSub}}>Select the category that best matches the problem.</p>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10}}>
            {(Object.entries(CATEGORIES) as [ReportCategory, { label: string; emoji: string; description: string }][]).map(([key, cat]) => {
              const sel = category === key;
              return (
                <button key={key} onClick={() => setCategory(key)} style={{display:'flex',flexDirection:'column',alignItems:'flex-start',gap:10,padding:14,borderRadius:16,border:`2px solid ${sel ? CAT_COLORS[key] : C.border}`,background:sel ? `${CAT_COLORS[key]}12` : C.white,cursor:'pointer',textAlign:'left',transition:'all 0.15s'}}>
                  <div style={{width:40,height:40,borderRadius:10,background:sel ? CAT_COLORS[key] : C.blueSoft,display:'flex',alignItems:'center',justifyContent:'center'}}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill={sel ? '#fff' : C.blue}><path d={CATEGORY_ICONS[key] ?? ""} /></svg>
                  </div>
                  <div>
                    <div style={{fontSize:14,fontWeight:800,color:C.textMain,lineHeight:1.2}}>{cat.label}</div>
                    <div style={{fontSize:12,color:C.textMuted,marginTop:2,lineHeight:1.4}}>{cat.description}</div>
                  </div>
                </button>
              );
            })}
          </div>
        </>}

        {/* STEP: PHOTO */}
        {step === 'photo' && <>
          <div>
            <h2 style={{fontSize:22,fontWeight:900,color:C.textMain,marginBottom:4}}>Add a Photo</h2>
            <p style={{fontSize:15,color:C.textSub}}>A photo makes your report stronger. You can skip this step.</p>
          </div>
          {photoPreview ? (
            <div style={{position:'relative',borderRadius:16,overflow:'hidden',aspectRatio:'4/3',background:C.border}}>
              <img src={photoPreview} alt="Your photo" style={{width:'100%',height:'100%',objectFit:'cover'}} />
              <button onClick={() => { setPhotoFile(null); setPhotoPreview(null); }} style={{position:'absolute',top:10,right:10,width:34,height:34,borderRadius:'50%',background:'rgba(0,0,0,0.6)',display:'flex',alignItems:'center',justifyContent:'center',border:'none',cursor:'pointer'}}>
                <X size={16} color="#fff" />
              </button>
              <div style={{position:'absolute',bottom:10,left:'50%',transform:'translateX(-50%)',background:'rgba(45,122,79,0.9)',color:'#fff',padding:'6px 14px',borderRadius:100,fontSize:13,fontWeight:700,display:'flex',alignItems:'center',gap:6}}>
                <CheckCircle2 size={14} /> Photo ready
              </div>
            </div>
          ) : (
            <div style={{display:'flex',flexDirection:'column',gap:10}}>
              <button onClick={openCamera} style={{display:'flex',alignItems:'center',gap:14,padding:18,borderRadius:16,border:`2px dashed ${C.blue}`,background:C.blueSoft,cursor:'pointer',textAlign:'left'}}>
                <div style={{width:56,height:56,borderRadius:14,background:C.blue,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
                  <Camera size={28} color="#fff" />
                </div>
                <div>
                  <div style={{fontSize:16,fontWeight:800,color:C.textMain}}>Take a Photo</div>
                  <div style={{fontSize:14,color:C.textSub,marginTop:2}}>Opens your phone camera</div>
                </div>
              </button>
              <button onClick={() => fileRef.current?.click()} style={{display:'flex',alignItems:'center',gap:14,padding:18,borderRadius:16,border:`1px solid ${C.border}`,background:C.white,cursor:'pointer',textAlign:'left'}}>
                <div style={{width:56,height:56,borderRadius:14,background:C.blueSoft,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
                  <Image size={28} color={C.blue} />
                </div>
                <div>
                  <div style={{fontSize:16,fontWeight:800,color:C.textMain}}>Choose from Gallery</div>
                  <div style={{fontSize:14,color:C.textSub,marginTop:2}}>Pick a photo you already took</div>
                </div>
              </button>
            </div>
          )}
          <input ref={fileRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={onFile} />
        </>}

        {/* STEP: LOCATION */}
        {step === 'location' && <>
          <div>
            <h2 style={{fontSize:22,fontWeight:900,color:C.textMain,marginBottom:4}}>Where is the problem?</h2>
            <p style={{fontSize:15,color:C.textSub}}>Tap the button below — your phone will find where you are standing right now.</p>
          </div>

          {!loc.lat && !loc.error && (
            <button onClick={loc.getLocation} disabled={loc.loading} style={{width:'100%',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:16,padding:'40px 20px',borderRadius:20,border:`2px dashed ${loc.loading ? C.border : C.blue}`,background:loc.loading ? C.bg : C.blueSoft,cursor:'pointer',opacity:loc.loading?0.7:1}}>
              {loc.loading ? (
                <>
                  <Loader2 size={48} className="animate-spin" color={C.blue} />
                  <div style={{textAlign:'center'}}>
                    <div style={{fontSize:18,fontWeight:800,color:C.textMain}}>Finding your location…</div>
                    <div style={{fontSize:14,color:C.textSub,marginTop:4}}>This usually takes a few seconds</div>
                  </div>
                </>
              ) : (
                <>
                  <div style={{width:80,height:80,borderRadius:'50%',background:C.blue,display:'flex',alignItems:'center',justifyContent:'center',boxShadow:'0 8px 24px rgba(26,94,168,0.35)'}}>
                    <MapPin size={36} color="#fff" strokeWidth={2} />
                  </div>
                  <div style={{textAlign:'center'}}>
                    <div style={{fontSize:20,fontWeight:800,color:C.textMain}}>Use My Location</div>
                    <div style={{fontSize:14,color:C.textSub,marginTop:6,lineHeight:1.5}}>Tap here — your phone will detect where you are standing automatically</div>
                  </div>
                </>
              )}
            </button>
          )}

          {loc.lat && !loc.error && (
            <div style={{display:'flex',flexDirection:'column',gap:10}}>
              <div style={{display:'flex',alignItems:'center',gap:14,padding:18,borderRadius:16,border:`1px solid ${C.green}`,background:C.greenSoft}}>
                <div style={{width:52,height:52,borderRadius:12,background:C.green,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
                  <CheckCircle2 size={26} color="#fff" />
                </div>
                <div>
                  <div style={{fontSize:17,fontWeight:800,color:C.green}}>Location Found!</div>
                  <div style={{fontSize:13,color:C.textSub,marginTop:2}}>GPS accuracy: ±{Math.round(loc.accuracy ?? 0)}m</div>
                </div>
              </div>
              <button onClick={loc.reset} style={{fontSize:14,color:C.textMuted,textDecoration:'underline',background:'none',border:'none',cursor:'pointer',padding:8}}>
                Not right? Try again
              </button>
            </div>
          )}

          {gpsMsg && (
            <div style={{padding:18,borderRadius:16,border:`1px solid ${C.danger}`,background:C.dangerSoft}}>
              <div style={{display:'flex',alignItems:'flex-start',gap:10,marginBottom:12}}>
                <AlertTriangle size={22} color={C.danger} style={{flexShrink:0,marginTop:2}} />
                <div>
                  <div style={{fontSize:16,fontWeight:800,color:C.danger}}>{gpsMsg.title}</div>
                  <div style={{fontSize:14,color:C.textSub,marginTop:4}}>{gpsMsg.body}</div>
                </div>
              </div>
              <div style={{background:'rgba(0,0,0,0.05)',borderRadius:10,padding:12,fontSize:13,color:C.textSub,lineHeight:1.6,whiteSpace:'pre-line',marginBottom:12}}>
                <strong style={{color:C.textMain}}>How to fix it:{'\n'}</strong>{gpsMsg.fix}
              </div>
              <button onClick={loc.getLocation} style={{width:'100%',height:44,borderRadius:12,fontWeight:700,fontSize:14,color:C.danger,background:'rgba(220,38,38,0.1)',border:`1px solid ${C.danger}`,cursor:'pointer'}}>
                Try Again
              </button>
            </div>
          )}
        </>}

        {/* STEP: DESCRIPTION */}
        {step === 'description' && <>
          <div>
            <h2 style={{fontSize:22,fontWeight:900,color:C.textMain,marginBottom:4}}>Describe the problem</h2>
            <p style={{fontSize:15,color:C.textSub}}>Optional — write anything that helps: how long it has been there, how bad it is.</p>
          </div>
          <textarea value={description} onChange={e => setDescription(e.target.value)}
            placeholder="Example: There is a large pile of trash on the corner of Pine and MLK. It has been there since last Monday…"
            style={{width:'100%',minHeight:150,padding:16,borderRadius:14,fontSize:15,lineHeight:1.6,resize:'none',outline:'none',border:`1.5px solid ${C.border}`,background:C.white,color:C.textMain,fontFamily:'inherit',boxSizing:'border-box'}}
            onFocus={e => (e.target.style.borderColor = C.blue)}
            onBlur={e => (e.target.style.borderColor = C.border)}
          />

          {/* Anonymous toggle */}
          <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'14px 16px',borderRadius:14,border:`1px solid ${C.border}`,background:C.white}}>
            <div>
              <div style={{fontSize:16,fontWeight:700,color:C.textMain}}>Stay Anonymous</div>
              <div style={{fontSize:13,color:C.textMuted,marginTop:2}}>Your name will not be shown to anyone</div>
            </div>
            <button onClick={() => setAnonymous(a => !a)} style={{position:'relative',flexShrink:0,width:48,height:26,borderRadius:100,background:anonymous ? C.blue : C.border,border:'none',cursor:'pointer',transition:'background 0.2s',padding:0}}>
              <span style={{position:'absolute',top:3,width:20,height:20,borderRadius:'50%',background:C.white,boxShadow:'0 1px 4px rgba(0,0,0,0.2)',transition:'left 0.2s',left:anonymous ? 25 : 3}} />
            </button>
          </div>
        </>}

        {/* STEP: CONFIRM */}
        {step === 'confirm' && <>
          <div>
            <h2 style={{fontSize:22,fontWeight:900,color:C.textMain,marginBottom:4}}>Ready to submit?</h2>
            <p style={{fontSize:15,color:C.textSub}}>Review your report before it goes on the public record.</p>
          </div>
          <div style={{borderRadius:16,overflow:'hidden',border:`1px solid ${C.border}`,background:C.white}}>
            {category && (
              <div style={{display:'flex',alignItems:'center',gap:12,padding:'14px 16px',borderBottom:`1px solid ${C.border}`}}>
                <div style={{width:36,height:36,borderRadius:10,background:CAT_COLORS[category],display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="white"><path d={CATEGORY_ICONS[category] ?? ""} /></svg>
                </div>
                <div>
                  <div style={{fontSize:11,fontWeight:700,color:C.textMuted,textTransform:'uppercase',letterSpacing:'0.06em'}}>Category</div>
                  <div style={{fontSize:15,fontWeight:700,color:C.textMain,marginTop:1}}>{CATEGORIES[category].label}</div>
                </div>
              </div>
            )}
            <div style={{display:'flex',alignItems:'center',gap:12,padding:'14px 16px',borderBottom:`1px solid ${C.border}`}}>
              <MapPin size={22} color={C.blue} style={{flexShrink:0}} />
              <div>
                <div style={{fontSize:11,fontWeight:700,color:C.textMuted,textTransform:'uppercase',letterSpacing:'0.06em'}}>Location</div>
                <div style={{fontSize:15,fontWeight:700,color:C.textMain,marginTop:1}}>
                  {loc.lat ? `${loc.lat.toFixed(4)}, ${loc.lng?.toFixed(4)}` : 'Center of Natchez (approximate)'}
                </div>
              </div>
            </div>
            {photoPreview && (
              <img src={photoPreview} alt="Report photo" style={{width:'100%',objectFit:'cover',maxHeight:200,display:'block'}} />
            )}
            {description && (
              <div style={{padding:'14px 16px',borderTop:`1px solid ${C.border}`}}>
                <div style={{fontSize:11,fontWeight:700,color:C.textMuted,textTransform:'uppercase',letterSpacing:'0.06em',marginBottom:4}}>Description</div>
                <div style={{fontSize:14,color:C.textSub,lineHeight:1.6}}>{description}</div>
              </div>
            )}
            <div style={{padding:'12px 16px',borderTop:`1px solid ${C.border}`,background:C.bg}}>
              <div style={{fontSize:13,color:C.textMuted}}>{anonymous ? '🔒 Posted anonymously' : '👤 Posted with your profile'}</div>
            </div>
          </div>
        </>}

      </div>

      {((step === 'photo' && !photoPreview) || (step === 'location' && !loc.lat)) && (
        <div style={{padding:'12px 16px',flexShrink:0,borderTop:`1px solid ${C.border}`,background:C.white,paddingBottom:'calc(env(safe-area-inset-bottom) + 12px)'}}>
          <button onClick={goNext} style={{width:'100%',height:44,borderRadius:12,fontWeight:600,fontSize:14,color:C.textMuted,background:C.bg,border:`1px solid ${C.border}`,cursor:'pointer'}}>
            Skip this step
          </button>
        </div>
      )}

    </div>
  );
}
