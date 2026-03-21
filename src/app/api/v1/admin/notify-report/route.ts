import { NextRequest, NextResponse } from 'next/server';
import { notifyAllCitizens } from '@/lib/notify-citizens';
import { createClient } from '@supabase/supabase-js';

export const maxDuration = 60;

export async function POST(req: NextRequest) {
  const { reportId } = await req.json();
  if (!reportId) return NextResponse.json({ error: 'Missing reportId' }, { status: 400 });
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
  const { data: report } = await supabase.from('reports').select('*').eq('id', reportId).single();
  if (!report) return NextResponse.json({ error: 'Report not found' }, { status: 404 });
  await notifyAllCitizens({
    eventType: 'new_report',
    category: report.category,
    wardNumber: report.ward_number ?? '?',
    reportId: report.id,
    description: report.description ?? undefined,
    photoUrl: report.photo_url ?? undefined,
  });
  return NextResponse.json({ success: true, message: 'Notifications sent' });
}
