'use client';

import { Eye } from 'lucide-react';
import { ReportWithDetails } from '@/lib/types';
import { CATEGORIES } from '@/lib/constants';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { MeTooButton } from './MeTooButton';
import { approximateLocation } from '@/lib/geo';
import { timeAgo } from '@/lib/utils';
import { motion } from 'framer-motion';

interface ReportCardProps {
  report: ReportWithDetails;
  onClick?: () => void;
}

export function ReportCard({ report, onClick }: ReportCardProps) {
  const cat = CATEGORIES[report.category];

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -4 }}
      onClick={onClick}
      className="bg-[var(--color-surface)] rounded-[var(--radius-lg)] border border-[var(--color-border)] overflow-hidden active:opacity-95 transition-opacity cursor-pointer"
      style={{ boxShadow: 'var(--shadow-card)' }}
      role="article"
      aria-label={`${cat.label} report`}
    >
      {report.photo_url ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={report.photo_url}
          alt={`${cat.label} issue`}
          className="w-full h-44 object-cover"
          loading="lazy"
        />
      ) : (
        <div className="w-full h-28 bg-[var(--color-bg)] flex items-center justify-center">
          <span className="text-4xl" role="img" aria-label={cat.label}>
            {cat.emoji}
          </span>
        </div>
      )}

      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex items-center gap-2">
            <span className="text-xl" role="img" aria-label={cat.label}>
              {cat.emoji}
            </span>
            <p className="text-sm font-semibold text-[var(--color-text)] leading-tight">
              {cat.label}
            </p>
          </div>
          <StatusBadge status={report.status} />
        </div>

        {report.description && (
          <p className="text-sm text-[var(--color-text-muted)] mb-2 line-clamp-2">
            {report.description}
          </p>
        )}

        <p className="text-xs text-[var(--color-text-subtle)] mb-3">
          {approximateLocation(report.lat, report.lng)} · {timeAgo(report.created_at)}
        </p>

        <div className="flex items-center justify-between">
          <MeTooButton reportId={report.id} count={report.me_too_count} />
          <div className="flex items-center gap-1 text-xs text-[var(--color-text-subtle)]">
            <Eye size={14} />
            <span>{report.view_count}</span>
          </div>
        </div>
      </div>
    </motion.article>
  );
}
