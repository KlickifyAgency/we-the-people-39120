import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';

const ALDERMEN: Record<number,string> = {
  1:'Valencia Hall', 2:'Billie Joe Frazier', 3:'Sarah Carter-Smith',
  4:'Felicia Bridgewater-Irving', 5:'Benjamin Davis', 6:'Curtis Moroney'
};

const LABELS: Record<string,string> = {
  graffiti:'Graffiti / Vandalism', dumping:'Illegal Dumping', abandoned_vehicle:'Abandoned Vehicle',
  property_neglect:'Property Neglect', noise:'Noise Complaint', street_issues:'Street / Pothole Issues',
  vegetation:'Overgrown Vegetation', animal:'Animal Issues', safety_hazard:'Safety Hazard',
  water_drainage:'Water / Drainage Problem', public_safety:'Public Safety Concern',
};

export const maxDuration = 60;

export async function GET() {
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
  const resend = new Resend(process.env.RESEND_API_KEY);
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://we-the-people-39120.vercel.app';

  // Get reports from last 6 hours
  const since = new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString();
  const { data: reports } = await supabase
    .from('reports')
    .select('*')
    .gte('created_at', since)
    .order('created_at', { ascending: false });

  if (!reports || reports.length === 0) {
    console.log('[digest] No new reports in last 6 hours');
    return NextResponse.json({ skipped: true, reason: 'No new reports' });
  }

  console.log(`[digest] Found ${reports.length} new reports`);

  // Get all confirmed users
  const { data: { users } } = await supabase.auth.admin.listUsers();
  const activeUsers = (users ?? []).filter(u => u.email);

  console.log(`[digest] Sending digest to ${activeUsers.length} users`);

  // Build report cards HTML
  const reportCards = reports.map(r => {
    const label = LABELS[r.category] ?? r.category;
    const alderman = ALDERMEN[r.ward_number] ?? 'Unassigned';
    const reportUrl = `${appUrl}/report/${r.id}`;
    return `
    <div style="background:#F8FAFC;border:1px solid #DDE3EC;border-radius:12px;padding:16px;margin-bottom:12px">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">
        <span style="font-size:12px;font-weight:700;color:#1A5EA8;text-transform:uppercase">${label}</span>
        <span style="font-size:11px;color:#94A3B8">Ward ${r.ward_number ?? '?'} — ${alderman}</span>
      </div>
      ${r.description ? `<p style="font-size:13px;color:#475569;margin:0 0 10px;font-style:italic">"${r.description.slice(0,150)}${r.description.length>150?'...':''}"</p>` : ''}
      ${r.photo_url ? `<img src="${r.photo_url}" style="width:100%;max-height:180px;object-fit:cover;border-radius:8px;margin-bottom:10px" />` : ''}
      <a href="${reportUrl}" style="display:inline-block;background:#1A5EA8;color:#fff;text-decoration:none;padding:8px 16px;border-radius:8px;font-size:12px;font-weight:700">View Report →</a>
    </div>`;
  }).join('');

  const html = `<!DOCTYPE html>
<html><body style="margin:0;padding:0;background:#F0F4FA;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif">
<div style="max-width:600px;margin:0 auto;padding:24px 16px">
  <div style="background:linear-gradient(135deg,#1A5EA8,#2D7A4F);border-radius:16px 16px 0 0;padding:28px 32px;text-align:center">
    <h1 style="color:#fff;font-size:20px;font-weight:900;margin:0">We The People 39120</h1>
    <p style="color:rgba(255,255,255,0.8);font-size:13px;margin:6px 0 0">Community Activity Digest — Natchez, MS</p>
  </div>
  <div style="background:#fff;padding:28px;border-radius:0 0 16px 16px;box-shadow:0 4px 24px rgba(0,0,0,0.08)">
    <h2 style="font-size:18px;font-weight:900;color:#0F172A;margin:0 0 6px">🚨 ${reports.length} New Report${reports.length!==1?'s':''} in Your Community</h2>
    <p style="font-size:13px;color:#64748B;margin:0 0 20px">Your neighbors have been active. Here's what's been reported in the last 6 hours:</p>
    ${reportCards}
    <div style="margin-top:20px;padding:16px;background:#EBF2FB;border-radius:12px;text-align:center">
      <a href="${appUrl}/feed" style="display:inline-block;background:linear-gradient(135deg,#1A5EA8,#2D7A4F);color:#fff;text-decoration:none;padding:14px 28px;border-radius:10px;font-weight:700;font-size:14px">View All Reports on the Map →</a>
    </div>
    <p style="font-size:11px;color:#94A3B8;text-align:center;margin:16px 0 0">You're receiving this because you have an account on We The People 39120.<br>Built by <a href="https://klickifyagency.com" style="color:#1A5EA8">KlickifyAgency.com</a></p>
  </div>
</div>
</body></html>`;

  // Send in batches of 3
  let sent = 0;
  for (let i = 0; i < activeUsers.length; i += 3) {
    const batch = activeUsers.slice(i, i + 3);
    await Promise.allSettled(batch.map(u =>
      resend.emails.send({
        from: 'We The People 39120 <noreply@klickifyagency.com>',
        to: u.email!,
        subject: `🚨 ${reports.length} New Report${reports.length!==1?'s':''} in Natchez — We The People 39120`,
        html,
      }).catch(e => console.error(`Failed to send to ${u.email}:`, e))
    ));
    sent += batch.length;
  }

  console.log(`[digest] Sent to ${sent} users`);
  return NextResponse.json({ success: true, reports: reports.length, users: sent });
}
