import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase';

// GET /api/v1/wards — returns all wards with alderman info
// Phase 1: Returns empty geometry (GeoJSON uploaded in Phase 2)
// Phase 2: Enable WARD_OVERLAY_MAP feature flag
export async function GET() {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('wards')
    .select('*, alderman:aldermen(id, name, email, phone, response_rate, total_resolved, total_ignored)')
    .order('ward_number', { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json(data ?? []);
}
