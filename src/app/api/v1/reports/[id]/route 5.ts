import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase';

// GET /api/v1/reports/[id]
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = createClient();

  // Increment view count
  await supabase.rpc('increment_view_count', { report_id: id });

  const { data, error } = await supabase
    .from('reports')
    .select('*, ward:wards(ward_number), user:users(id, anonymous_alias)')
    .eq('id', id)
    .single();

  if (error || !data) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  return NextResponse.json(data);
}
