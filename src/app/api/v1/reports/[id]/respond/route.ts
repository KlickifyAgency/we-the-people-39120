import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase';

type Params = { params: Promise<{ id: string }> };

export async function POST(req: NextRequest, { params }: Params) {
  const { id } = await params;
  const supabase = createClient();
  const { response } = await req.json();

  if (!response || response.trim().length < 10) {
    return NextResponse.json({ error: 'Response too short' }, { status: 400 });
  }

  const { data, error } = await supabase
    .from('reports')
    .update({
      alderman_response: response.trim(),
      alderman_responded_at: new Date().toISOString(),
      status: 'in_progress',
    })
    .eq('id', id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
