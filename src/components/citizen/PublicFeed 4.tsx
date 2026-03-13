'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { Map, List, SlidersHorizontal } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';
import { useReports } from '@/hooks/useReports';
import { ReportCard } from './ReportCard';
import { FeedFilters, ReportCategory, ReportStatus } from '@/lib/types';
import { CATEGORIES } from '@/lib/constants';
import { cn } from '@/lib/utils';

const MapView = dynamic(() => import('./MapView'), { ssr: false });

type ViewMode = 'map' | 'list';

const DEFAULT_FILTERS: FeedFilters = {
  category: 'all',
  status: 'all',
  timeRange: '30d',
  ward: 'all',
};

export function PublicFeed() {
  const [view, setView] = useState<ViewMode>('map');
  const [filters, setFilters] = useState<FeedFilters>(DEFAULT_FILTERS);
  const [showFilters, setShowFilters] = useState(false);

  const { data: reports = [], isLoading, isError } = useReports(filters);

  const categoryOptions: { value: ReportCategory | 'all'; label: string; emoji?: string }[] = [
    { value: 'all', label: 'All' },
    ...Object.entries(CATEGORIES).map(([key, val]) => ({
      value: key as ReportCategory,
      label: val.label,
      emoji: val.emoji,
    })),
  ];

  const statusOptions: { value: ReportStatus | 'all'; label: string }[] = [
    { value: 'all', label: 'All' },
    { value: 'pending', label: 'Pending' },
    { value: 'confirmed', label: 'Confirmed' },
    { value: 'in_progress', label: 'In progress' },
    { value: 'resolved', label: 'Resolved' },
    { value: 'ignored', label: 'Ignored' },
  ];

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-2 px-4 py-2.5 bg-[var(--color-surface)] border-b border-[var(--color-border)]">
        <div className="flex bg-[var(--color-bg)] rounded-lg p-0.5 gap-0">
          <button
            onClick={() => setView('map')}
            className={cn(
              'flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium transition-colors min-h-[36px]',
              view === 'map'
                ? 'bg-[var(--color-surface)] text-[var(--color-text)] shadow-sm'
                : 'text-[var(--color-text-muted)]'
            )}
            aria-pressed={view === 'map'}
            aria-label="Map view"
          >
            <Map size={16} /> Map
          </button>
          <button
            onClick={() => setView('list')}
            className={cn(
              'flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium transition-colors min-h-[36px]',
              view === 'list'
                ? 'bg-[var(--color-surface)] text-[var(--color-text)] shadow-sm'
                : 'text-[var(--color-text-muted)]'
            )}
            aria-pressed={view === 'list'}
            aria-label="List view"
          >
            <List size={16} /> List
          </button>
        </div>

        <button
          onClick={() => setShowFilters(!showFilters)}
          className={cn(
            'flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium ml-auto min-h-[36px] transition-colors',
            showFilters
              ? 'bg-[var(--color-accent)] text-white'
              : 'bg-[var(--color-bg)] text-[var(--color-text-muted)] border border-[var(--color-border)]'
          )}
          aria-expanded={showFilters}
          aria-label="Toggle filters"
        >
          <SlidersHorizontal size={16} />
          Filters
          {(filters.category !== 'all' || filters.status !== 'all') && (
            <span className="w-1.5 h-1.5 bg-current rounded-full opacity-80" />
          )}
        </button>
      </div>

      {showFilters && (
        <div className="px-4 py-3 bg-[var(--color-bg)] border-b border-[var(--color-border)] space-y-3">
          <div>
            <label className="text-[10px] font-medium text-[var(--color-text-muted)] uppercase tracking-wider">
              Category
            </label>
            <select
              value={filters.category}
              onChange={(e) =>
                setFilters((f) => ({ ...f, category: e.target.value as ReportCategory | 'all' }))
              }
              className="w-full mt-1 p-2.5 text-sm border border-[var(--color-border)] rounded-lg bg-[var(--color-surface)] text-[var(--color-text)]"
              aria-label="Filter by category"
            >
              {categoryOptions.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.emoji ? `${o.emoji} ${o.label}` : o.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[10px] font-medium text-[var(--color-text-muted)] uppercase tracking-wider">
              Status
            </label>
            <select
              value={filters.status}
              onChange={(e) =>
                setFilters((f) => ({ ...f, status: e.target.value as ReportStatus | 'all' }))
              }
              className="w-full mt-1 p-2.5 text-sm border border-[var(--color-border)] rounded-lg bg-[var(--color-surface)] text-[var(--color-text)]"
              aria-label="Filter by status"
            >
              {statusOptions.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[10px] font-medium text-[var(--color-text-muted)] uppercase tracking-wider">
              Time
            </label>
            <div className="flex gap-1.5 mt-1">
              {(['24h', '7d', '30d', 'all'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setFilters((f) => ({ ...f, timeRange: t }))}
                  className={cn(
                    'flex-1 py-2 rounded-lg text-xs font-medium border transition-colors',
                    filters.timeRange === t
                      ? 'bg-[var(--color-accent)] text-white border-transparent'
                      : 'bg-[var(--color-surface)] text-[var(--color-text-muted)] border-[var(--color-border)]'
                  )}
                >
                  {t === 'all' ? 'All' : t}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="flex-1 overflow-hidden">
        {isLoading && (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="w-8 h-8 border-2 border-[var(--color-accent)] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
              <p className="text-sm text-[var(--color-text-muted)]">Loading…</p>
            </div>
          </div>
        )}

        {isError && (
          <div className="flex items-center justify-center h-full px-6">
            <p className="text-center text-sm text-[var(--color-text-muted)]">
              Could not load reports. Check your connection.
            </p>
          </div>
        )}

        {!isLoading && !isError && view === 'map' && (
          <div className="h-full">
            <MapView reports={reports} />
          </div>
        )}

        {!isLoading && !isError && view === 'list' && (
          <div className="h-full overflow-y-auto">
            {reports.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 px-6 text-center">
                <span className="text-4xl mb-3 opacity-60">📍</span>
                <p className="text-base font-semibold text-[var(--color-text)]">No reports yet</p>
                <p className="text-sm text-[var(--color-text-muted)] mt-1">
                  Be the first to report an issue in 39120.
                </p>
              </div>
            ) : (
              <div className="px-4 py-4 space-y-3 pb-24">
                <p className="text-xs text-[var(--color-text-subtle)] font-medium">
                  {reports.length} report{reports.length !== 1 ? 's' : ''}
                </p>
                <AnimatePresence>
                  {reports.map((report) => (
                    <ReportCard key={report.id} report={report} />
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
