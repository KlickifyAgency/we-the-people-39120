import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';

const ALDERMEN: Record<number, { name: string; email: string }> = {
  1: { name: 'Valencia Hall',              email: 'vhall@natchez.ms.us' },
  2: { name: 'Billie Joe Frazier',         email: 'bfrazier@natchez.ms.us' },
  3: { name: 'Sarah Carter-Smith',         email: 'ssmith@natchez.ms.us' },
  4: { name: 'Felicia Bridgewater-Irving', email: 'firving@natchez.ms.us' },
  5: { name: 'Benjamin Davis',             email: 'bdavis@natchez.ms.us' },
  6: { name: 'Curtis Moroney',             email: 'cmoroney@natchez.ms.us' },
};

const LABELS: Record<string, string> = {
  graffiti: 'Graffiti / Vandalism', dumping: 'Illegal Dumping',
  abandoned_vehicle: 'Abandoned Vehicle', property_neglect: 'Property Neglect',
  noise: 'Noise Complaint', street_issues: 'Street / Pothole Issues',
  vegetation: 'Overgrown Vegetation', animal: 'Animal Issues',
  safety_hazard: 'Safety Hazard', water_drainage: 'Water / Drainage Problem',
  public_safety: 'Public Safety Concern',
};

export const maxDuration = 60;

function daysOld(createdAt: string): number {
  return Math.floor((Date.now() - new Date(createdAt).getTime()) / (1000 * 60 * 60 * 24));
}

function urgencyLevel(days: number): 'warning' | 'urgent' | 'critical' | null {
  if (days >= 28) return 'critical';
  if (days >= 21) return 'urgent';
  if (days >= 7)  return 'warning';
  return null;
}

export async function GET() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
  const resend = new Resend(process.env.RESEND_API_KEY);
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://we-the-people-39120.vercel.app';
  const makeUrl = process.env.MAKE_WEBHOOK_URL;

  // Open reports with no alderman response, older than 7 days
  const cutoff = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
  const { data: reports } = await supabase
    .from('reports')
    .select('*')
    .in('status', ['open', 'in_progress'])
    .is('alderman_response', null)
    .lte('created_at', cutoff)
    .order('created_at', { ascending: true });

  if (!reports || reports.length === 0) {
    console.log('[reminders] No overdue reports');
    return NextResponse.json({ skipped: true, reason: 'No overdue reports' });
  }

  // Group by ward
  const byWard: Record<number, typeof reports> = {};
  for (const r of reports) {
    if (!r.ward_number) continue;
    byWard[r.ward_number] ??= [];
    byWard[r.ward_number].push(r);
  }

  let emailsSent = 0;
  let facebookPosts = 0;

  for (const [wardStr, wardReports] of Object.entries(byWard)) {
    const ward = Number(wardStr);
    const alderman = ALDERMEN[ward];
    if (!alderman) continue;

    const firstName = alderman.name.split(' ')[0];

    // Only send email if at least one report hits a reminder milestone today
    const milestoneReports = wardReports.filter(r => {
      const days = daysOld(r.created_at);
      // Send on day 7, 14, 21, 28 (±1 day window to avoid missing a day)
      return [7, 14, 21, 28].some(d => days >= d && days <= d + 1);
    });

    if (milestoneReports.length === 0) continue;

    const mostUrgent = milestoneReports.reduce((acc, r) =>
      daysOld(r.created_at) > daysOld(acc.created_at) ? r : acc
    );
    const maxDays = daysOld(mostUrgent.created_at);
    const urgency = urgencyLevel(maxDays)!;

    const urgencyConfig = {
      warning:  { color: '#D97706', bg: '#FEF3C7', border: '#FCD34D', label: '⚠️ REMINDER',  subject: 'Reminder' },
      urgent:   { color: '#DC2626', bg: '#FEE2E2', border: '#FCA5A5', label: '🔴 URGENT',    subject: 'Urgent: Response Needed' },
      critical: { color: '#7C3AED', bg: '#EDE9FE', border: '#C4B5FD', label: '🚨 CRITICAL',  subject: 'FINAL NOTICE — 30-Day Deadline Approaching' },
    }[urgency];

    const reportRows = milestoneReports.map(r => {
      const days = daysOld(r.created_at);
      const label = LABELS[r.category] ?? r.category;
      return `
      <div style="background:#F8FAFC;border:1px solid #DDE3EC;border-radius:10px;padding:14px 16px;margin-bottom:10px">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px">
          <span style="font-size:12px;font-weight:700;color:#1A5EA8;text-transform:uppercase">${label}</span>
          <span style="font-size:11px;color:#94A3B8">${days} days unanswered</span>
        </div>
        ${r.description ? `<p style="font-size:13px;color:#475569;margin:0 0 10px;font-style:italic">"${r.description.slice(0, 150)}${r.description.length > 150 ? '...' : ''}"</p>` : ''}
        <a href="${appUrl}/report/${r.id}" style="display:inline-block;background:#1A5EA8;color:#fff;text-decoration:none;padding:6px 14px;border-radius:8px;font-size:12px;font-weight:700">View Report →</a>
        ${r.respond_token ? `<a href="${appUrl}/respond/${r.respond_token}" style="display:inline-block;margin-left:8px;background:#2D7A4F;color:#fff;text-decoration:none;padding:6px 14px;border-radius:8px;font-size:12px;font-weight:700">Respond →</a>` : ''}
      </div>`;
    }).join('');

    const html = `<!DOCTYPE html>
<html><body style="margin:0;padding:0;background:#F0F4FA;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif">
<div style="max-width:600px;margin:0 auto;padding:24px 16px">
  <div style="background:linear-gradient(135deg,#1A5EA8,#2D7A4F);border-radius:16px 16px 0 0;padding:28px 32px;text-align:center">
    <h1 style="color:#fff;font-size:20px;font-weight:900;margin:0">We The People 39120</h1>
    <p style="color:rgba(255,255,255,0.8);font-size:13px;margin:6px 0 0">Citizen Report — Ward ${ward} Accountability</p>
  </div>
  <div style="background:#fff;padding:28px;border-radius:0 0 16px 16px;box-shadow:0 4px 24px rgba(0,0,0,0.08)">
    <div style="background:${urgencyConfig.bg};border:1px solid ${urgencyConfig.border};border-left:4px solid ${urgencyConfig.color};border-radius:12px;padding:16px 20px;margin-bottom:24px">
      <p style="font-size:14px;font-weight:800;color:${urgencyConfig.color};margin:0 0 4px">${urgencyConfig.label}</p>
      <p style="font-size:13px;color:#374151;margin:0">Alderman ${firstName}, the following Ward ${ward} reports require your public response.</p>
    </div>
    <p style="font-size:14px;color:#475569;line-height:1.8;margin:0 0 20px">
      Dear Alderman ${firstName},<br><br>
      Citizens of Ward ${ward} filed ${milestoneReports.length} report${milestoneReports.length !== 1 ? 's' : ''} that ${milestoneReports.length !== 1 ? 'have' : 'has'} not received a public response. Under the community accountability standard, aldermen have <strong>30 days</strong> to respond publicly to constituent reports.
    </p>
    ${reportRows}
    <p style="font-size:12px;color:#94A3B8;text-align:center;margin:20px 0 0">
      We The People 39120 — Civic Reporting Platform for Natchez, MS 39120<br>
      Built by <a href="https://klickifyagency.com" style="color:#1A5EA8">KlickifyAgency.com</a>
    </p>
  </div>
</div>
</body></html>`;

    await resend.emails.send({
      from: 'We The People 39120 <noreply@klickifyagency.com>',
      to: alderman.email,
      cc: 'info@klickifyagency.com',
      subject: `${urgencyConfig.subject} — Ward ${ward} Has ${milestoneReports.length} Unanswered Report${milestoneReports.length !== 1 ? 's' : ''}`,
      html,
    }).catch(e => console.error(`[reminders] Email to Ward ${ward} failed:`, e));

    emailsSent++;

    // Post to Facebook for critical (28d+) reports
    if (urgency === 'critical' && makeUrl) {
      for (const r of milestoneReports.filter(r => daysOld(r.created_at) >= 28)) {
        const days = daysOld(r.created_at);
        const label = LABELS[r.category] ?? r.category;
        const message = `⏰ 30-DAY DEADLINE — ${label.toUpperCase()}

📍 Ward ${ward} — Natchez, MS 39120
${r.description ? `\n"${r.description.slice(0, 150)}${r.description.length > 150 ? '...' : ''}"\n` : ''}
🗓️ This report is ${days} days old with no public response from the alderman.

👉 View & support: ${appUrl}/report/${r.id}

#WeThePeople39120 #Natchez #NatchezMS #Accountability #Ward${ward}`;

        await fetch(makeUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message, photo_url: r.photo_url ?? null }),
        }).catch(e => console.error('[reminders] Facebook post failed:', e));

        facebookPosts++;
      }
    }
  }

  console.log(`[reminders] Sent ${emailsSent} emails, ${facebookPosts} Facebook posts`);
  return NextResponse.json({ success: true, emailsSent, facebookPosts });
}
