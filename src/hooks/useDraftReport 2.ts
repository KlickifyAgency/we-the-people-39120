'use client';

import { useState, useEffect, useCallback } from 'react';
import { ReportCategory } from '@/lib/types';

const DRAFT_KEY = 'we_the_people_39120_report_draft';

export interface ReportDraft {
  category: ReportCategory | null;
  lat: number | null;
  lng: number | null;
  description: string;
  anonymous: boolean;
  savedAt: string;
  // Note: photo files cannot be serialized — user must retake on reconnect
  hasPhoto: boolean;
}

const EMPTY_DRAFT: Omit<ReportDraft, 'savedAt'> = {
  category: null,
  lat: null,
  lng: null,
  description: '',
  anonymous: true,
  hasPhoto: false,
};

function loadDraft(): ReportDraft | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(DRAFT_KEY);
    if (!raw) return null;
    const draft = JSON.parse(raw) as ReportDraft;
    // Discard drafts older than 24 hours
    const age = Date.now() - new Date(draft.savedAt).getTime();
    if (age > 24 * 60 * 60 * 1000) {
      localStorage.removeItem(DRAFT_KEY);
      return null;
    }
    return draft;
  } catch {
    return null;
  }
}

function saveDraft(draft: Omit<ReportDraft, 'savedAt'>) {
  if (typeof window === 'undefined') return;
  const full: ReportDraft = { ...draft, savedAt: new Date().toISOString() };
  localStorage.setItem(DRAFT_KEY, JSON.stringify(full));
}

function clearDraft() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(DRAFT_KEY);
}

export function useDraftReport() {
  const [draft, setDraft] = useState<ReportDraft | null>(null);
  const [isOnline, setIsOnline] = useState(true);
  const [hasDraft, setHasDraft] = useState(false);

  // Load existing draft on mount
  useEffect(() => {
    const existing = loadDraft();
    if (existing) {
      setDraft(existing);
      setHasDraft(true);
    }
    setIsOnline(navigator.onLine);
  }, []);

  // Monitor online/offline status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const updateDraft = useCallback(
    (updates: Partial<Omit<ReportDraft, 'savedAt'>>) => {
      setDraft((prev) => {
        const next = {
          ...(prev ?? { ...EMPTY_DRAFT }),
          ...updates,
        };
        saveDraft(next);
        setHasDraft(true);
        return { ...next, savedAt: new Date().toISOString() };
      });
    },
    []
  );

  const discardDraft = useCallback(() => {
    clearDraft();
    setDraft(null);
    setHasDraft(false);
  }, []);

  return {
    draft,
    isOnline,
    hasDraft,
    updateDraft,
    discardDraft,
  };
}
