import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET() {
  const checks: Record<string, string> = {};
  let allOk = true;
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
    const { error } = await supabase.from('reports').select('id').limit(1);
    checks.supabase = error ? 'ERROR: ' + error.message : 'OK';
    if (error) allOk = false;
  } catch {
    checks.supabase = 'ERROR: unreachable';
    allOk = false;
  }
  checks.resend = process.env.RESEND_API_KEY ? 'OK' : 'MISSING';
  checks.make_webhook = process.env.MAKE_WEBHOOK_URL ? 'OK' : 'MISSING';
  if (!process.env.RESEND_API_KEY) allOk = false;
  return NextResponse.json({
    status: allOk ? 'healthy' : 'degraded',
    timestamp: new Date().toISOString(),
    app: 'We The People 39120',
    checks,
  }, { status: allOk ? 200 : 503 });
}
