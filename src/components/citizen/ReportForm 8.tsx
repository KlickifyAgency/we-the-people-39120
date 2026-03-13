'use client';

import { useState, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useLocation } from '@/hooks/useLocation';
import { useCreateReport } from '@/hooks/useReports';
import { CATEGORIES } from '@/lib/constants';
import { ReportCategory } from '@/lib/types';
import {
  Camera, MapPin, Loader2, CheckCircle2,
  ChevronRight, ChevronLeft, X, AlertTriangle,
} from 'lucide-react';

type Step = 'category' | 'photo' | 'location' | 'description' | 'confirm';
const STEPS: Step[] = ['category', 'photo', 'location', 'description', 'confirm'];

const GPS_MESSAGES: Record<string, { title: string; body: string; fix: string }> = {
  GPS_DENIED: {
    title: '📵 Location access is turned off',
    body: 'Your phone is blocking this app from seeing your location.',
    fix: 'iPhone: Settings → Privacy & Security → Location Services → Safari → "While Using"\n\nAndroid: Tap the lock icon in your browser → tap Location → Allow',
  },
  GPS_UNAVAILABLE: {
    title: '📡 Cannot find your location right now',
    body: 'This usually happens indoors or in areas with poor signal.',
    fix: 'Step outside or near a window and tap the button again.',
  },
  GPS_TIMEOUT: {
    title: '⏱️ It took too long',
    body: 'Your phone could not find your location in time.',
    fix: 'Tap the button again. Make sure you are outdoors if possible.',
  },
  NEEDS_HTTPS: {
    title: '🔒 GPS requires a secure connection',
    body: 'Safari on iPhone only allows location on secure (https) websites.',
    fix: 'Use the localtunnel URL your developer provided, or deploy to Vercel.',

  },
  GPS_NOT_SUPPORTED: {
    title: '❌ GPS not available',
    body: 'This device does not support location detection.',
    fix: 'Try using a smartphone with GPS enabled.',
  },
};

export function ReportForm() {
  const router = useRouter();
  const loc    = useLocation();
  const { mutateAsync: createReport } = useCreateReport();

  const [step,         setStep]         = useState<Step>('category');
  const [category,     setCategory]     = useState<ReportCategory | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [photoFile,    setPhotoFile]    = useState<File | null>(null);
  const [description,  setDescription]  = useState('');
  const [anonymous,    setAnonymous]    = useState(true);
  const [submitted,    setSubmitted]    = useState(false);
  const [submitting,   setSubmitting]   = useState(false);
  const [cameraOpen,   setCameraOpen]   = useState(false);
  const [stream,       setStream]       = useState<MediaStream | null>(null);

  const fileRef  = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const progress = ((STEPS.indexOf(step) + 1) / STEPS.length) * 100;

  const goNext = () => {
    const i = STEPS.indexOf(step);
    if (i < STEPS.length - 1) setStep(STEPS[i + 1]);
  };
  const goBack = () => {
    const i = STEPS.indexOf(step);
    if (i > 0) setStep(STEPS[i - 1]);
    else router.back();
  };

  const openCamera = useCallback(async () => {
    try {
      const s = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      setStream(s);
      setCameraOpen(true);
      setTimeout(() => {
        if (videoRef.current) { videoRef.current.srcObject = s; videoRef.current.play(); }
      }, 80);
    } catch {
      fileRef.current?.click();
    }
  }, []);

  const capturePhoto = useCallback(() => {
    if (!videoRef.current) return;
    const c = document.createElement('canvas');
    c.width  = videoRef.current.videoWidth;
    c.height = videoRef.current.videoHeight;
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
    const f = e.target.files?.[0];
    if (!f) return;
    setPhotoFile(f);
    setPhotoPreview(URL.createObjectURL(f));
  }, []);

  const handleSubmit = async () => {
    if (!category) return;
    setSubmitting(true);
    try {
      const fd = new FormData();
      fd.append('category', category);
      fd.append('lat',      String(loc.lat ?? 31.5604));
      fd.append('lng',      String(loc.lng ?? -91.4032));
      fd.append('description', description);
      fd.append('anonymous',   String(anonymous));
      if (photoFile) fd.append('photo', photoFile);
      await createReport(fd);
      setSubmitted(true);
    } catch (err) {
      console.error(err);
      alert('Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (cameraOpen) return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col">
      <video ref={videoRef} className="flex-1 w-full object-cover" playsInline muted />
      <div className="absolute bottom-0 left-0 right-0 p-8 flex items-center justify-between bg-gradient-to-t from-black/80 to-transparent">
        <button onClick={closeCamera} className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
          <X size={24} color="#fff" />
        </button>
        <button onClick={capturePhoto}
          className="w-20 h-20 rounded-full border-4 border-white bg-white/20 flex items-center justify-center active:scale-95 transition-transform">
          <div className="w-14 h-14 rounded-full bg-white" />
        </button>
        <div className="w-12" />
      </div>
    </div>
  );

  if (submitted) return (
    <div className="flex flex-col items-center justify-center h-full gap-6 px-8 text-center">
      <div className="w-24 h-24 rounded-full flex items-center justify-center"
        style={{ background: 'linear-gradient(135deg,#10b981,#059669)', boxShadow: '0 0 50px rgba(16,185,129,0.45)' }}>
        <CheckCircle2 size={48} color="#fff" strokeWidth={2} />
      </div>
      <div>
        <h2 className="text-2xl font-bold text-[var(--color-text)] mb-3">Report Submitted!</h2>
        <p className="text-sm text-[var(--color-text-muted)] leading-relaxed">
          Your report is now on the community map. Thank you for holding Natchez accountable.
        </p>
      </div>
      <button onClick={() => router.push('/')}
        className="w-full h-14 rounded-2xl font-bold text-white text-base active:scale-[0.98] transition-transform"
        style={{ background: 'linear-gradient(135deg,#7c3aed,#a855f7,#06b6d4)', boxShadow: '0 6px 24px rgba(124,58,237,0.45)' }}>
        Back to Map
      </button>
    </div>
  );

  const gpsMsg = loc.error ? GPS_MESSAGES[loc.error] : null;

  return (
    <div className="flex flex-col h-full">

      <div className="flex items-center gap-3 px-4 py-3 pt-11 border-b border-[var(--color-border)]"
        style={{ background: 'rgba(15,15,26,0.92)', backdropFilter: 'blur(16px)' }}>
        <button onClick={goBack}
          className="w-10 h-10 flex items-center justify-center rounded-xl bg-[var(--color-surface2)] border border-[var(--color-border)]">
          <ChevronLeft size={20} color="var(--color-text)" />
        </button>
        <div>
          <div className="text-[16px] font-bold text-[var(--color-text)]">Report an Issue</div>
          <div className="text-[11px] text-[var(--color-text-muted)]">Step {STEPS.indexOf(step) + 1} of {STEPS.length}</div>
        </div>
      </div>

      <div className="h-1 bg-[var(--color-surface2)] flex-shrink-0">
        <div className="h-full transition-all duration-300"
          style={{ width: `${progress}%`, background: 'linear-gradient(90deg,#7c3aed,#a855f7,#06b6d4)' }} />
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-6 flex flex-col gap-5">

        {step === 'category' && <>
          <div>
            <h2 className="text-xl font-bold text-[var(--color-text)]">What are you reporting?</h2>
            <p className="text-sm text-[var(--color-text-muted)] mt-1">Tap the picture that matches the problem.</p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {(Object.entries(CATEGORIES) as [ReportCategory, { label: string; emoji: string; description: string }][])
              .map(([key, cat]) => {
                const sel = category === key;
                return (
                  <button key={key} onClick={() => setCategory(key)}
                    className="flex flex-col items-start gap-2 p-4 rounded-2xl border-2 text-left active:scale-[0.97] transition-all"
                    style={{
                      background:  sel ? 'rgba(124,58,237,0.15)' : 'var(--color-surface2)',
                      borderColor: sel ? '#a855f7' : 'var(--color-border)',
                      boxShadow:   sel ? '0 0 0 1px rgba(168,85,247,0.25)' : 'none',
                    }}>
                    <span className="text-4xl">{cat.emoji}</span>
                    <div>
                      <div className="text-sm font-bold text-[var(--color-text)] leading-tight">{cat.label}</div>
                      <div className="text-xs text-[var(--color-text-subtle)] mt-0.5 leading-snug">{cat.description}</div>
                    </div>
                  </button>
                );
              })}
          </div>
        </>}

        {step === 'photo' && <>
          <div>
            <h2 className="text-xl font-bold text-[var(--color-text)]">Take a photo</h2>
            <p className="text-sm text-[var(--color-text-muted)] mt-1">A photo makes your report stronger. You can skip this step.</p>
          </div>
          {photoPreview ? (
            <div className="relative rounded-2xl overflow-hidden bg-[var(--color-surface2)]" style={{ aspectRatio: '4/3' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={photoPreview} alt="Your photo" className="w-full h-full object-cover" />
              <button onClick={() => { setPhotoFile(null); setPhotoPreview(null); }}
                className="absolute top-3 right-3 w-9 h-9 rounded-full bg-black/70 flex items-center justify-center">
                <X size={18} color="#fff" />
              </button>
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2">
                <div className="px-4 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5"
                  style={{ background: 'rgba(0,0,0,0.7)', color: '#34d399' }}>
                  <CheckCircle2 size={13} /> Photo ready
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              <button onClick={openCamera}
                className="flex items-center gap-4 p-5 rounded-2xl border-2 border-dashed active:scale-[0.98] transition-all"
                style={{ borderColor: '#a855f7', background: 'rgba(124,58,237,0.07)' }}>
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0"
                  style={{ background: 'linear-gradient(135deg,#7c3aed,#a855f7)' }}>
                  <Camera size={30} color="#fff" />
                </div>
                <div className="text-left">
                  <div className="text-base font-bold text-[var(--color-text)]">📷 Take a Photo Now</div>
                  <div className="text-sm text-[var(--color-text-muted)] mt-0.5">Opens your phone camera</div>
                </div>
              </button>
              <button onClick={() => fileRef.current?.click()}
                className="flex items-center gap-4 p-5 rounded-2xl border active:scale-[0.98] transition-all"
                style={{ border: '1px solid var(--color-border2)', background: 'var(--color-surface2)' }}>
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0 bg-[var(--color-surface3)]">
                  <span className="text-3xl">🖼️</span>
                </div>
                <div className="text-left">
                  <div className="text-base font-bold text-[var(--color-text)]">Choose from Gallery</div>
                  <div className="text-sm text-[var(--color-text-muted)] mt-0.5">Pick a photo you already took</div>
                </div>
              </button>
            </div>
          )}
          <input ref={fileRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={onFile} />
        </>}

        {step === 'location' && <>
          <div>
            <h2 className="text-xl font-bold text-[var(--color-text)]">Where is the problem?</h2>
            <p className="text-sm text-[var(--color-text-muted)] mt-1">
              Tap the big button below. Your phone will find where you are standing right now.
            </p>
          </div>

          {!loc.lat && !loc.error && (
            <button onClick={loc.getLocation} disabled={loc.loading}
              className="w-full flex flex-col items-center justify-center gap-4 py-12 rounded-3xl border-2 border-dashed active:scale-[0.98] transition-all disabled:opacity-60"
              style={{
                borderColor: loc.loading ? 'var(--color-border2)' : '#a855f7',
                background:  loc.loading ? 'var(--color-surface2)' : 'rgba(124,58,237,0.07)',
              }}>
              {loc.loading ? (
                <>
                  <Loader2 size={56} className="animate-spin" style={{ color: '#a855f7' }} />
                  <div className="text-center">
                    <div className="text-lg font-bold text-[var(--color-text)]">Finding your location…</div>
                    <div className="text-sm text-[var(--color-text-muted)] mt-1">This usually takes a few seconds</div>
                  </div>
                </>
              ) : (
                <>
                  <div className="w-24 h-24 rounded-full flex items-center justify-center"
                    style={{ background: 'linear-gradient(135deg,#7c3aed,#a855f7,#06b6d4)', boxShadow: '0 8px 32px rgba(124,58,237,0.5)' }}>
                    <MapPin size={42} color="#fff" strokeWidth={2} />
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-bold text-[var(--color-text)]">📍 Use My Location</div>
                    <div className="text-sm text-[var(--color-text-muted)] mt-1 px-4">
                      Tap here — your phone will detect where you are standing automatically
                    </div>
                  </div>
                </>
              )}
            </button>
          )}

          {loc.lat && !loc.error && (
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-4 p-5 rounded-2xl border"
                style={{ background: 'rgba(16,185,129,0.08)', borderColor: 'rgba(16,185,129,0.4)' }}>
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0"
                  style={{ background: 'rgba(16,185,129,0.18)' }}>
                  <CheckCircle2 size={30} color="#10b981" />
                </div>
                <div>
                  <div className="text-lg font-bold" style={{ color: '#10b981' }}>✅ Location Found!</div>
                  <div className="text-xs text-[var(--color-text-muted)] mt-0.5">GPS accuracy: ±{Math.round(loc.accuracy ?? 0)}m</div>
                </div>
              </div>
              <button onClick={loc.reset}
                className="text-sm text-center py-2 underline underline-offset-2"
                style={{ color: 'var(--color-text-subtle)' }}>
                Not right? Try again
              </button>
            </div>
          )}

          {gpsMsg && (
            <div className="flex flex-col gap-3 p-5 rounded-2xl border"
              style={{ background: 'rgba(239,68,68,0.07)', borderColor: 'rgba(239,68,68,0.3)' }}>
              <div className="flex items-start gap-3">
                <AlertTriangle size={22} color="#f87171" className="flex-shrink-0 mt-0.5" />
                <div>
                  <div className="text-base font-bold" style={{ color: '#fca5a5' }}>{gpsMsg.title}</div>
                  <div className="text-sm text-[var(--color-text-muted)] mt-1">{gpsMsg.body}</div>
                </div>
              </div>
              <div className="p-3 rounded-xl text-xs leading-relaxed whitespace-pre-line"
                style={{ background: 'rgba(0,0,0,0.3)', color: 'var(--color-text-muted)' }}>
                <strong className="text-[var(--color-text)]">How to fix it:{'\n'}</strong>{gpsMsg.fix}
              </div>
              <button onClick={loc.getLocation}
                className="w-full h-11 rounded-xl font-bold text-sm"
                style={{ background: 'rgba(239,68,68,0.2)', color: '#fca5a5', border: '1px solid rgba(239,68,68,0.4)' }}>
                Try Again
              </button>
            </div>
          )}
        </>}

        {step === 'description' && <>
          <div>
            <h2 className="text-xl font-bold text-[var(--color-text)]">Describe the problem</h2>
            <p className="text-sm text-[var(--color-text-muted)] mt-1">Optional. Write anything that helps — how long it has been there, how bad it is.</p>
          </div>
          <textarea value={description} onChange={e => setDescription(e.target.value)}
            placeholder="Example: There is a large pile of trash on the corner of Pine and MLK. It has been there since last Monday…"
            className="w-full min-h-[160px] p-4 rounded-2xl text-sm leading-relaxed resize-none outline-none"
            style={{ background: 'var(--color-surface2)', border: '1.5px solid var(--color-border2)', color: 'var(--color-text)' }}
            onFocus={e => (e.target.style.borderColor = '#a855f7')}
            onBlur={e  => (e.target.style.borderColor = 'var(--color-border2)')}
          />
          <div className="flex items-center justify-between p-4 rounded-2xl"
            style={{ background: 'var(--color-surface2)', border: '1px solid var(--color-border)' }}>
            <div>
              <div className="text-base font-bold text-[var(--color-text)]">🕵️ Stay anonymous</div>
              <div className="text-xs text-[var(--color-text-muted)] mt-0.5">Your name will NOT be shown to anyone</div>
            </div>
            <button onClick={() => setAnonymous(a => !a)}
              className="relative flex-shrink-0 rounded-full transition-all"
              style={{
                width: 52, height: 28,
                background: anonymous ? 'linear-gradient(135deg,#7c3aed,#a855f7)' : 'var(--color-border2)',
                boxShadow: anonymous ? '0 2px 10px rgba(124,58,237,0.4)' : 'none',
              }}>
              <span className="absolute top-[3px] w-[22px] h-[22px] rounded-full bg-white shadow transition-all"
                style={{ left: anonymous ? 27 : 3 }} />
            </button>
          </div>
        </>}

        {step === 'confirm' && <>
          <div>
            <h2 className="text-xl font-bold text-[var(--color-text)]">Ready to submit?</h2>
            <p className="text-sm text-[var(--color-text-muted)] mt-1">Review your report before it goes to the map.</p>
          </div>
          <div className="flex flex-col rounded-2xl overflow-hidden border border-[var(--color-border2)]">
            {category && (
              <div className="flex items-center gap-3 p-4 bg-[var(--color-surface2)]">
                <span className="text-3xl">{CATEGORIES[category].emoji}</span>
                <div>
                  <div className="text-xs text-[var(--color-text-subtle)] uppercase tracking-wider font-bold">Category</div>
                  <div className="text-sm font-semibold text-[var(--color-text)] mt-0.5">{CATEGORIES[category].label}</div>
                </div>
              </div>
            )}
            <div className="h-px bg-[var(--color-border)]" />
            <div className="flex items-center gap-3 p-4 bg-[var(--color-surface2)]">
              <MapPin size={24} style={{ color: '#a855f7', flexShrink: 0 }} />
              <div>
                <div className="text-xs text-[var(--color-text-subtle)] uppercase tracking-wider font-bold">Location</div>
                <div className="text-sm font-semibold text-[var(--color-text)] mt-0.5">
                  {loc.lat ? `${loc.lat.toFixed(4)}, ${loc.lng?.toFixed(4)}` : 'No location — center of Natchez'}
                </div>
              </div>
            </div>
            {photoPreview && <>
              <div className="h-px bg-[var(--color-border)]" />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={photoPreview} alt="Report photo" className="w-full object-cover" style={{ maxHeight: 200 }} />
            </>}
            {description && <>
              <div className="h-px bg-[var(--color-border)]" />
              <div className="p-4 bg-[var(--color-surface2)]">
                <div className="text-xs text-[var(--color-text-subtle)] uppercase tracking-wider font-bold mb-1">Description</div>
                <div className="text-sm text-[var(--color-text-muted)] leading-relaxed">{description}</div>
              </div>
            </>}
            <div className="h-px bg-[var(--color-border)]" />
            <div className="p-4 bg-[var(--color-surface2)]">
              <div className="text-xs text-[var(--color-text-subtle)]">
                {anonymous ? '🕵️ Posted anonymously' : '👤 Posted with your profile'}
              </div>
            </div>
          </div>
        </>}

      </div>

      <div className="px-4 py-4 flex-shrink-0 border-t border-[var(--color-border)]"
        style={{ background: 'rgba(15,15,26,0.97)' }}>

        {step === 'photo' && !photoPreview && (
          <button onClick={goNext}
            className="w-full h-12 rounded-2xl font-semibold text-sm mb-3 active:scale-[0.98] transition-all"
            style={{ background: 'var(--color-surface2)', color: 'var(--color-text-muted)', border: '1px solid var(--color-border)' }}>
            Skip — report without photo
          </button>
        )}

        {step === 'location' && !loc.lat && (
          <button onClick={goNext}
            className="w-full h-12 rounded-2xl font-semibold text-sm mb-3 active:scale-[0.98] transition-all"
            style={{ background: 'var(--color-surface2)', color: 'var(--color-text-muted)', border: '1px solid var(--color-border)' }}>
            Skip — continue without location
          </button>
        )}

        {step === 'confirm' ? (
          <button onClick={handleSubmit} disabled={submitting || !category}
            className="w-full h-14 rounded-2xl font-bold text-white text-base flex items-center justify-center gap-2 active:scale-[0.98] transition-all disabled:opacity-50"
            style={{ background: 'linear-gradient(135deg,#7c3aed,#a855f7,#06b6d4)', boxShadow: '0 6px 24px rgba(124,58,237,0.45)' }}>
            {submitting ? <><Loader2 size={20} className="animate-spin" /> Submitting…</> : <>🚀 Submit Report</>}
          </button>
        ) : (
          <button onClick={goNext} disabled={step === 'category' && !category}
            className="w-full h-14 rounded-2xl font-bold text-white text-base flex items-center justify-center gap-2 active:scale-[0.98] transition-all disabled:opacity-40"
            style={{ background: 'linear-gradient(135deg,#7c3aed,#a855f7,#06b6d4)', boxShadow: '0 6px 24px rgba(124,58,237,0.4)' }}>
            Continue <ChevronRight size={20} />
          </button>
        )}
      </div>
    </div>
  );
}
