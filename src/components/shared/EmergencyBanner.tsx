import { Phone } from 'lucide-react';

export function EmergencyBanner() {
  return (
    <div
      className="flex items-center gap-3 px-4 py-2.5 bg-[var(--color-danger)]/95 border-b border-red-700/30"
      role="alert"
      aria-live="polite"
    >
      <Phone size={18} className="text-white shrink-0" aria-hidden />
      <p className="text-xs font-medium text-white leading-snug">
        Emergencies: call{' '}
        <a
          href="tel:911"
          className="font-semibold underline"
          aria-label="Call 911 for emergencies"
        >
          911
        </a>
        . This app is not monitored in real time.
      </p>
    </div>
  );
}
