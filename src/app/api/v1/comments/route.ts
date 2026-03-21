import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(req: NextRequest) {
  const { report_id, content } = await req.json();
  if (!report_id || !content?.trim()) return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
  if (content.trim().length < 5) return NextResponse.json({ error: 'Too short' }, { status: 400 });

  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
  const { data, error } = await supabase.from('comments').insert({ report_id, content: content.trim() }).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function GET(req: NextRequest) {
  const report_id = req.nextUrl.searchParams.get('report_id');
  if (!report_id) return NextResponse.json({ error: 'Missing report_id' }, { status: 400 });

  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
  const { data, error } = await supabase.from('comments').select('*').eq('report_id', report_id).order('created_at', { ascending: true });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data ?? []);
}
