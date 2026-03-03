import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get('token');
  if (!token) return NextResponse.json({ error: 'No token' }, { status: 400 });
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
  const { data, error } = await supabase.from('reports').select('*').eq('respond_token', token).single();
  if (error || !data) return NextResponse.json({ error: 'Invalid token' }, { status: 404 });
  return NextResponse.json(data);
}
export async function POST(req: NextRequest) {
  const { token, response } = await req.json();
  if (!token || !response) return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
  const { error } = await supabase.from('reports')
    .update({ alderman_response: response, alderman_responded_at: new Date().toISOString(), status: 'acknowledged' })
    .eq('respond_token', token);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
