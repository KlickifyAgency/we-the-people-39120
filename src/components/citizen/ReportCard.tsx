'use client';

import { Eye } from 'lucide-react';
import { ReportWithDetails } from '@/lib/types';
import { CATEGORIES } from '@/lib/constants';
import { MeTooButton } from './MeTooButton';
import { approximateLocation } from '@/lib/geo';
import { timeAgo } from '@/lib/utils';
import { motion } from 'framer-motion';

interface ReportCardProps {
  report: ReportWithDetails;
  onClick?: () => void;
}

const STATUS_BADGE: Record<string, string> = {
  pending:     'badge badge-pending',
  resolved:    'badge badge-resolved',
  in_progress: 'badge badge-in-progress',
  community:   'badge badge-community',
  ignored:     'badge badge-ignored',
  overdue:     'badge badge-overdue',
};

const STATUS_LABEL: Record<string, string> = {
  pending:     'Pending',
  resolved:    'Resolved',
  in_progress: 'In Progress',
  community:   'Community Fix',
  ignored:     'Ignored',
  overdue:     'Overdue',
};

export function ReportCard({ report, onClick }: ReportCardProps) {
  const cat = CATEGORIES[report.category];
  const days = Math.floor((Date.now() - new Date(report.created_at).getTime()) / 86400000);
  const status = report.status ?? 'pending';

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -4 }}
      onClick={onClick}
      role="article"
      aria-label={`${cat.label} report`}
      style={{
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-card)',
        overflow: 'hidden',
        cursor: 'pointer',
        transition: 'transform 0.12s, box-shadow 0.12s',
      }}
      whileTap={{ scale: 0.985 }}
    >
      {/* Photo or emoji placeholder */}
      {report.photo_url ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={report.photo_url}
          alt={`${cat.label} issue`}
          loading="lazy"
          style={{ width: '100%', height: 176, objectFit: 'cover', display: 'block' }}
        />
      ) : (
        <div style={{
          width: '100%', height: 100,
          background: 'var(--bg)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <span style={{ fontSize: 40 }} role="img" aria-label={cat.label}>{cat.emoji}</span>
        </div>
      )}

      <div style={{ padding: '14px 16px' }}>
        {/* Header row */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8, marginBottom: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 22 }} role="img" aria-label={cat.label}>{cat.emoji}</span>
            <span style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text)', fontFamily: 'var(--font-display)', lineHeight: 1.25 }}>
              {cat.label}
            </span>
          </div>
          <span className={STATUS_BADGE[status] ?? 'badge badge-pending'}>
            {STATUS_LABEL[status] ?? status}
          </span>
        </div>

        {/* Description */}
        {report.description && (
          <p style={{
            fontSize: '0.9rem', color: 'var(--text-sub)', marginBottom: 8,
            lineHeight: 1.55, display: '-webkit-box', WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical', overflow: 'hidden',
          }}>
            {report.description}
          </p>
        )}

        {/* Location + time */}
        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: 12 }}>
          {approximateLocation(report.lat, report.lng)} · {timeAgo(report.created_at)}
          {days > 0 && <span style={{ marginLeft: 6, color: days >= 30 ? 'var(--red)' : days >= 20 ? 'var(--amber)' : 'var(--text-muted)' }}>· Day {days}</span>}
        </p>

        {/* Footer: Me Too + Views */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <MeTooButton reportId={report.id} count={report.me_too_count} />
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            <Eye size={15} />
            <span>{report.view_count}</span>
          </div>
        </div>
      </div>
    </motion.article>
  );
}
