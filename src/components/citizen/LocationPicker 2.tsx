'use client';

import { MapPin, Locate, AlertCircle, CheckCircle } from 'lucide-react';
import { useLocation } from '@/hooks/useLocation';
import { approximateLocation } from '@/lib/geo';
import { motion } from 'framer-motion';

interface LocationPickerProps {
  lat: number | null;
  lng: number | null;
  onLocationSet: (lat: number, lng: number) => void;
}

export function LocationPicker({ lat, lng, onLocationSet }: LocationPickerProps) {
  const location = useLocation();

  const handleDetect = async () => {
    location.getLocation();
  };

  // Sync detected location upward
  if (location.lat && location.lng && (location.lat !== lat || location.lng !== lng)) {
    onLocationSet(location.lat, location.lng);
  }

  const hasLocation = lat !== null && lng !== null;

  return (
    <div>
      <p className="text-xl font-bold text-[var(--color-text)] mb-4">Where is it?</p>

      <motion.button
        whileTap={{ scale: 0.97 }}
        onClick={handleDetect}
        disabled={location.loading}
        className="w-full flex items-center gap-4 p-4 rounded-2xl border-2 border-[var(--color-accent)] bg-[var(--color-accent-soft)] active:opacity-70 transition-opacity"
        aria-label="Detect my current location"
      >
        <div className="w-12 h-12 bg-[var(--color-accent)] rounded-full flex items-center justify-center shrink-0">
          <Locate size={24} color="white" />
        </div>
        <div className="text-left">
          <p className="text-base font-bold text-[var(--color-accent)]">
            {location.loading ? 'Locating you…' : 'Use My Location'}
          </p>
          <p className="text-sm text-[var(--color-text-muted)]">Auto-detect via GPS</p>
        </div>
      </motion.button>

      {/* Status */}
      <div className="mt-3">
        {location.error && (
          <div className="flex items-center gap-2 p-3 bg-red-500/15 border border-red-500/30 rounded-xl">
            <AlertCircle size={18} className="text-red-400 shrink-0" />
            <p className="text-sm text-red-300">{location.error}</p>
          </div>
        )}

        {hasLocation && !location.error && (
          <div className="flex items-center gap-2 p-3 bg-[var(--color-success-soft)] border border-emerald-500/30 rounded-xl">
            <CheckCircle size={18} className="text-emerald-400 shrink-0" />
            <div>
              <p className="text-sm font-semibold text-emerald-300">Location captured</p>
              <p className="text-xs text-emerald-400/90">{approximateLocation(lat!, lng!)}</p>
            </div>
          </div>
        )}

        {!hasLocation && !location.error && !location.loading && (
          <div className="flex items-center gap-2 p-3 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-xl">
            <MapPin size={18} className="text-[var(--color-text-subtle)] shrink-0" />
            <p className="text-sm text-[var(--color-text-muted)]">No location set yet</p>
          </div>
        )}
      </div>

      <p className="text-xs text-[var(--color-text-subtle)] mt-2 text-center">
        Only your approximate neighborhood is shown publicly.
      </p>
    </div>
  );
}
