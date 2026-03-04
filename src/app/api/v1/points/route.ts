import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
const BADGES: Record<string,{icon:string,label:string}> = {
  first_report:{icon:'🏁',label:'First Report'},
  five_reports:{icon:'📋',label:'5 Reports'},
  ten_reports:{icon:'🔟',label:'10 Reports'},
  civic_hero:{icon:'🦸',label:'Civic Hero'},
  ward_champion:{icon:'🏆',label:'Ward Champion'},
};
export async function POST(req: NextRequest) {
  const { user_id, action } = await req.json();
  if (!user_id || !action) return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
  const pointsMap: Record<string,number> = { report_submitted: 10, me_too: 2, report_resolved: 25 };
  const pts = pointsMap[action] ?? 0;
  const { data: profile } = await supabase.from('profiles').select('points,badges,ward_number').eq('id', user_id).single();
  if (!profile) return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
  const newPoints = (profile.points ?? 0) + pts;
  const badges = new Set<string>(profile.badges ?? []);
  const { data: reportCount } = await supabase.from('reports').select('id', { count: 'exact' }).eq('user_id', user_id);
  const count = reportCount?.length ?? 0;
  if (count >= 1) badges.add('first_report');
  if (count >= 5) badges.add('five_reports');
  if (count >= 10) { badges.add('ten_reports'); badges.add('civic_hero'); }
  await supabase.from('profiles').update({ points: newPoints, badges: [...badges] }).eq('id', user_id);
  return NextResponse.json({ points: newPoints, badges: [...badges] });
}
