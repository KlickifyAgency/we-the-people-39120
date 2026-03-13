'use client';

import { WifiOff, Wifi } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface OfflineBannerProps {
  isOnline: boolean;
  hasDraft?: boolean;
}

export function OfflineBanner({ isOnline, hasDraft }: OfflineBannerProps) {
  return (
    <AnimatePresence>
      {!isOnline && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="overflow-hidden"
        >
          <div className="flex items-center gap-3 px-4 py-2.5 bg-amber-500/15 border-b border-amber-500/30">
            <WifiOff size={18} className="text-amber-400 shrink-0" aria-hidden />
            <div>
              <p className="text-sm font-medium text-amber-300">Offline</p>
              <p className="text-xs text-amber-400/90">
                {hasDraft
                  ? 'Draft saved. It will submit when you reconnect.'
                  : 'Report will be saved as draft and submitted when back online.'}
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {isOnline && hasDraft && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="overflow-hidden"
        >
          <div className="flex items-center gap-3 px-4 py-2.5 bg-[var(--color-success-soft)] border-b border-emerald-500/30">
            <Wifi size={18} className="text-emerald-400 shrink-0" aria-hidden />
            <p className="text-sm font-medium text-emerald-300">Back online — draft restored</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
