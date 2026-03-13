'use client';

import { ThumbsUp, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMeToo } from '@/hooks/useMeToo';
import { cn } from '@/lib/utils';

interface MeTooButtonProps {
  reportId: string;
  count: number;
}

export function MeTooButton({ reportId, count }: MeTooButtonProps) {
  const { hasConfirmed, confirm, isPending } = useMeToo(reportId);

  return (
    <motion.button
      whileTap={!hasConfirmed && !isPending ? { scale: 0.96 } : {}}
      onClick={(e) => {
        e.stopPropagation();
        confirm();
      }}
      disabled={hasConfirmed || isPending}
      aria-label={
        isPending
          ? 'Submitting…'
          : hasConfirmed
            ? `${count} neighbors confirmed this issue`
            : `Tap to confirm: I see this too (${count} already confirmed)`
      }
      aria-pressed={hasConfirmed}
      aria-busy={isPending}
      className={cn(
        'flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium transition-all min-h-[44px]',
        hasConfirmed
          ? 'bg-[var(--color-accent)] text-white'
          : isPending
            ? 'bg-[var(--color-border)] text-[var(--color-text-subtle)] cursor-wait'
            : 'bg-[var(--color-bg)] text-[var(--color-text-muted)] hover:bg-[var(--color-border)]'
      )}
    >
      {isPending ? (
        <Loader2 size={16} className="animate-spin" aria-hidden />
      ) : (
        <ThumbsUp size={16} strokeWidth={hasConfirmed ? 2.5 : 1.75} aria-hidden />
      )}

      <AnimatePresence mode="wait">
        <motion.span
          key={count}
          initial={{ opacity: 0, y: -2 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 2 }}
          transition={{ duration: 0.12 }}
          className="tabular-nums"
        >
          {count}
        </motion.span>
      </AnimatePresence>

      <span className="text-xs">
        {isPending ? 'Saving…' : hasConfirmed ? 'Me too' : 'Me too'}
      </span>
    </motion.button>
  );
}
