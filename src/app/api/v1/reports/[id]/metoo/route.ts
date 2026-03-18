import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase';
import { ESCALATION_THRESHOLDS } from '@/lib/constants';
import { isEnabled } from '@/lib/features';
import { notifyReportOwner } from '@/lib/notify-citizens';

// POST /api/v1/reports/[id]/metoo — anonymous Me Too confirmation
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = createClient();

  // Use IP as anonymous user fingerprint (server-side only)
  const ip = req.headers.get('x-forwarded-for') ?? req.headers.get('x-real-ip') ?? 'unknown';
  const fingerprint = `anon:${Buffer.from(ip).toString('base64').slice(0, 16)}`;

  // Check for duplicate (best-effort, not a hard security guarantee)
  const { data: existing } = await supabase
    .from('confirmations')
    .select('id')
    .eq('report_id', id)
    .eq('user_id', fingerprint)
    .maybeSingle();

  if (existing) {
    return NextResponse.json({ error: 'Already confirmed' }, { status: 409 });
  }

  const { error } = await supabase.from('confirmations').insert({
    report_id: id,
    user_id: fingerprint,
  });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Increment me_too_count
  await supabase.rpc('increment_me_too', { report_id: id });

  // Get updated count
  const { data: report } = await supabase
    .from('reports')
    .select('me_too_count, status, category, ward_number, description')
    .eq('id', id)
    .single();

  // Phase 2: Trigger escalation logic at threshold (built now, disabled)
  if (
    isEnabled('ME_TOO_ALDERMAN_NOTIFY') &&
    report &&
    report.me_too_count >= ESCALATION_THRESHOLDS.ME_TOO_ALDERMAN_NOTIFY
  ) {
    // TODO Phase 2: Send notification to ward alderman
    // await notifyAlderman(id);
  }

  // Notify report owner
  if (report) {
    notifyReportOwner({
      reportId: id,
      eventType: 'me_too',
      category: report.category,
      wardNumber: report.ward_number ?? '?',
      description: report.description ?? undefined,
    }).catch(() => {});
  }

  return NextResponse.json({ me_too_count: report?.me_too_count ?? 0 });
}
