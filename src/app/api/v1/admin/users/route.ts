import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  // Get all auth users
  const { data: { users }, error } = await supabase.auth.admin.listUsers();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Get all profiles
  const { data: profiles } = await supabase
    .from('profiles')
    .select('id, email, full_name, ward_number, points, badges, avatar_url, updated_at');

  const profileMap = new Map((profiles ?? []).map((p: any) => [p.id, p]));

  // Merge auth users + profiles
  const merged = (users ?? []).map((u: any) => ({
    id: u.id,
    email: u.email,
    full_name: profileMap.get(u.id)?.full_name ?? u.user_metadata?.full_name ?? null,
    ward_number: profileMap.get(u.id)?.ward_number ?? null,
    points: profileMap.get(u.id)?.points ?? 0,
    badges: profileMap.get(u.id)?.badges ?? [],
    avatar_url: profileMap.get(u.id)?.avatar_url ?? null,
    created_at: u.created_at,
    confirmed: !!u.confirmed_at,
  }));

  return NextResponse.json(merged);
}
