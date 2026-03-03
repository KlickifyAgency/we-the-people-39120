'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ReportWithDetails, FeedFilters, ReportCategory } from '@/lib/types';

async function fetchReports(filters: Partial<FeedFilters>): Promise<ReportWithDetails[]> {
  const params = new URLSearchParams();
  if (filters.category && filters.category !== 'all') params.set('category', filters.category);
  if (filters.status && filters.status !== 'all') params.set('status', filters.status);
  if (filters.timeRange && filters.timeRange !== 'all') params.set('timeRange', filters.timeRange);
  if (filters.ward && filters.ward !== 'all') params.set('ward', String(filters.ward));

  const res = await fetch(`/api/v1/reports?${params.toString()}`);
  if (!res.ok) throw new Error('Failed to fetch reports');
  return res.json();
}

async function createReport(data: FormData): Promise<ReportWithDetails> {
  const res = await fetch('/api/v1/reports', { method: 'POST', body: data });
  if (!res.ok) { const err = await res.text(); throw new Error(err); }
  return res.json();
}

export function useReports(filters: Partial<FeedFilters> = {}) {
  return useQuery({
    queryKey: ['reports', filters],
    queryFn: () => fetchReports(filters),
    staleTime: 30_000, // 30 seconds
    refetchInterval: 60_000, // Auto-refresh every 60s
  });
}

export function useReport(id: string) {
  return useQuery({
    queryKey: ['report', id],
    queryFn: async () => {
      const res = await fetch(`/api/v1/reports/${id}`);
      if (!res.ok) throw new Error('Report not found');
      return res.json() as Promise<ReportWithDetails>;
    },
    enabled: !!id,
  });
}

export function useCreateReport() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createReport,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reports'] });
    },
  });
}
