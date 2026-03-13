'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState, useEffect } from 'react';

const ME_TOO_KEY = 'we_the_people_39120_metoo';

function getLocalMeToos(): Set<string> {
  if (typeof window === 'undefined') return new Set();
  try {
    const stored = localStorage.getItem(ME_TOO_KEY);
    return stored ? new Set(JSON.parse(stored)) : new Set();
  } catch {
    return new Set();
  }
}

function saveLocalMeToo(reportId: string) {
  const existing = getLocalMeToos();
  existing.add(reportId);
  localStorage.setItem(ME_TOO_KEY, JSON.stringify([...existing]));
}

export function useMeToo(reportId: string) {
  const queryClient = useQueryClient();
  const [hasConfirmed, setHasConfirmed] = useState(false);

  useEffect(() => {
    setHasConfirmed(getLocalMeToos().has(reportId));
  }, [reportId]);

  const mutation = useMutation({
    mutationFn: async () => {
      const res = await fetch(`/api/v1/reports/${reportId}/metoo`, { method: 'POST' });
      if (!res.ok) throw new Error('Failed to confirm');
      return res.json();
    },
    onMutate: async () => {
      // Optimistic update
      await queryClient.cancelQueries({ queryKey: ['reports'] });
      saveLocalMeToo(reportId);
      setHasConfirmed(true);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reports'] });
      queryClient.invalidateQueries({ queryKey: ['report', reportId] });
    },
    onError: () => {
      // Revert optimistic update
      setHasConfirmed(false);
    },
  });

  return {
    hasConfirmed,
    confirm: () => {
      if (!hasConfirmed) mutation.mutate();
    },
    isPending: mutation.isPending,
  };
}
