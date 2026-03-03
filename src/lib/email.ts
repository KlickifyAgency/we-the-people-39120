import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

const CATEGORY_LABELS: Record<string, string> = {
  graffiti: 'Graffiti / Vandalism',
  dumping: 'Illegal Dumping',
  abandoned_vehicle: 'Abandoned Vehicle',
  property_neglect: 'Property Neglect',
  noise: 'Noise Complaint',
  street_issues: 'Street / Pothole Issues',
  vegetation: 'Overgrown Vegetation',
  animal: 'Animal Issues',
  safety_hazard: 'Safety Hazard',
  water_drainage: 'Water / Drainage Problem',
  public_safety: 'Public Safety Concern',
};

export interface ReportEmailData {
  aldermanName: string;
  aldermanEmail: string;
  wardNumber: number;
  category: string;
  description?: string;
  lat: number;
  lng: number;
  reportId: string;
  photoUrl?: string;
  isAnonymous: boolean;
}

export async function sendAldermanNotification(data: ReportEmailData) {
  const categoryLabel = CATEGORY_LABELS[data.category] ?? data.category;
  const mapsUrl = `https://maps.google.com/?q=${data.lat},${data.lng}`;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://we-the-people-39120.vercel.app';
  const reportUrl = `${appUrl}/report/${data.reportId}`;
  const firstName = data.aldermanName.split(' ')[0];

  const html = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;background:#F0F4FA;color:#0F172A}
.wrap{max-width:600px;margin:0 auto;padding:32px 16px}
.card{background:#FFFFFF;border-radius:20px;overflow:hidden;border:1px solid #DDE3EC;box-shadow:0 4px 24px rgba(0,0,0,0.06)}
.hdr{padding:36px 32px;background:linear-gradient(135deg,#1A5EA8 0%,#2D7A4F 100%);text-align:center}
.hdr img{height:64px;margin-bottom:20px;display:block;margin-left:auto;margin-right:auto}
.hdr h1{color:white;font-size:24px;font-weight:800;line-height:1.35;margin-bottom:8px}
.hdr p{color:rgba(255,255,255,0.85);font-size:14px;font-weight:500}
.body{padding:32px}
.greeting{font-size:16px;line-height:1.85;color:#475569;margin-bottom:24px}
.greeting strong{color:#0F172A}
.collab-box{background:#EBF2FB;border:1px solid #C3D4EE;border-left:4px solid #1A5EA8;border-radius:12px;padding:20px 22px;margin-bottom:24px}
.collab-box p{font-size:15px;color:#1E3A5F;line-height:1.75;font-style:italic}
.report-box{border-radius:14px;overflow:hidden;margin-bottom:24px;border:1px solid #DDE3EC}
.report-row{display:flex;padding:13px 18px;border-bottom:1px solid #F0F4FA;background:#FFFFFF}
.report-row:nth-child(even){background:#F7F9FC}
.report-row:last-child{border-bottom:none}
.report-label{font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:0.08em;color:#94A3B8;min-width:110px;padding-top:2px;flex-shrink:0}
.report-value{font-size:15px;font-weight:600;color:#0F172A;flex:1}
.report-value.desc{font-weight:400;font-style:italic;color:#475569}
.timer-box{background:#FEF3C7;border:1px solid #FCD34D;border-radius:14px;padding:20px 22px;margin-bottom:24px}
.timer-title{font-size:15px;font-weight:800;color:#92400E;margin-bottom:8px;display:flex;align-items:center;gap:8px}
.timer-body{font-size:14px;color:#78350F;line-height:1.75}
.timer-body strong{color:#92400E}
.transparency-box{background:#E8F5EE;border:1px solid #A7D4B8;border-radius:14px;padding:18px 22px;margin-bottom:28px}
.transparency-box p{font-size:14px;color:#1A4A30;line-height:1.75}
.transparency-box strong{color:#2D7A4F}
.btn{display:block;text-align:center;text-decoration:none;padding:16px 24px;border-radius:12px;font-weight:800;font-size:15px;margin-bottom:12px}
.btn-primary{background:#1A5EA8;color:white!important}
.btn-secondary{background:#FFFFFF;color:#1A5EA8!important;border:2px solid #1A5EA8}
.divider{height:1px;background:#F0F4FA;margin:24px 0}
.footer{padding:24px 32px;background:#F7F9FC;border-top:1px solid #DDE3EC}
.footer p{font-size:12px;color:#94A3B8;line-height:1.9;text-align:center}
.footer a{color:#1A5EA8;text-decoration:none}
</style>
</head>
<body>
<div class="wrap">
<div class="card">

  <div class="hdr">
    <img src="${appUrl}/logo-white.png" alt="We The People 39120" style="height:72px;margin-bottom:20px;display:block;margin-left:auto;margin-right:auto" />
    <h1>A New Civic Report Has Been Filed<br/>for Ward ${data.wardNumber}</h1>
    <p>Report #${data.reportId.slice(0,8).toUpperCase()} · We The People 39120 · Natchez, MS</p>
  </div>

  <div class="body">

    <p class="greeting">
      Dear <strong>${firstName}</strong>,<br><br>
      A resident of <strong>Ward ${data.wardNumber}</strong> has submitted a civic report through
      <em>We The People 39120</em> — a community platform designed to bridge the gap between
      Natchez residents and their elected officials. This report is now
      <strong>visible to the public</strong> on the community map.
    </p>

    <div class="collab-box">
      <p>
        "This platform exists not to criticize, but to collaborate. We elected you because
        we believe in you. This resident is reaching out through the proper civic channel —
        trusting that you will respond. Together, we can make Natchez better."
      </p>
    </div>

    <div class="report-box">
      <div class="report-row">
        <div class="report-label">Issue Type</div>
        <div class="report-value">${categoryLabel}</div>
      </div>
      <div class="report-row">
        <div class="report-label">Ward</div>
        <div class="report-value">Ward ${data.wardNumber} — Natchez, MS 39120</div>
      </div>
      <div class="report-row">
        <div class="report-label">Coordinates</div>
        <div class="report-value" style="font-size:13px;color:#64748B">${data.lat.toFixed(5)}, ${data.lng.toFixed(5)}</div>
      </div>
      ${data.description ? `
      <div class="report-row">
        <div class="report-label">Description</div>
        <div class="report-value desc">"${data.description}"</div>
      </div>` : ''}
      <div class="report-row">
        <div class="report-label">Submitted by</div>
        <div class="report-value">${data.isAnonymous ? 'An anonymous resident of Ward ' + data.wardNumber : 'A registered community member'}</div>
      </div>
      <div class="report-row">
        <div class="report-label">Status</div>
        <div class="report-value" style="color:#B45309;font-weight:700">Pending Response — Day 1 of 30</div>
      </div>
    ${data.photoUrl ? `
    <div style="margin-bottom:24px;border-radius:14px;overflow:hidden;border:1px solid #DDE3EC">
      <div style="padding:10px 16px;background:#F7F9FC;border-bottom:1px solid #DDE3EC;font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:0.08em;color:#94A3B8">Photo Evidence</div>
      <img src="${data.photoUrl}" alt="Report photo" style="width:100%;max-height:320px;object-fit:cover;display:block" />
    </div>` : ''}

    <div class="timer-box">
      <div class="timer-title">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#92400E" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
        30-Day Public Response Window
      </div>
      <div class="timer-body">
        From the moment this report was submitted, a <strong>30-day public window</strong> is now open.
        Responding publicly — even to acknowledge the issue — demonstrates your commitment to
        your constituents and strengthens public trust. Reports without a response after 30 days
        are <strong>flagged as "Pending Resolution"</strong> on the community map.
      </div>
    </div>

    <div class="transparency-box">
      <p>
        <strong>Your response becomes part of the public record.</strong> Click "View Report" below
        to respond directly on the platform. Residents will see your reply, and it will stand
        as evidence of your dedication to Ward ${data.wardNumber}. Transparency builds the trust
        that makes Natchez stronger.
      </p>
    </div>

    <a href="${reportUrl}" class="btn btn-primary">View Report &amp; Respond Publicly</a>
    <a href="${mapsUrl}" class="btn btn-secondary">View Location on Google Maps</a>

    <div class="divider"></div>

    <p style="font-size:13px;color:#94A3B8;text-align:center;line-height:1.8">
      If this report falls outside Ward ${data.wardNumber}, please forward it to the
      appropriate alderman. We appreciate your service to the people of Natchez.<br>
      Questions? Reply to this email or contact
      <a href="mailto:support@klickifyagency.com" style="color:#1A5EA8">support@klickifyagency.com</a>
    </p>

  </div>

  <div class="footer">
    <p>
      Sent on behalf of a Natchez resident by <strong>We The People 39120</strong><br>
      <a href="${appUrl}">we-the-people-39120.vercel.app</a> ·
      Built by <a href="https://klickifyagency.com">KlickifyAgency.com</a><br>
      This is an automated civic engagement notification. For emergencies, always call 911.
    </p>
  </div>

</div>
</div>
</body>
</html>`;

  try {
    const result = await resend.emails.send({
      from: 'We The People 39120 <onboarding@resend.dev>',
      to: ['gsmith0572@gmail.com'],
      replyTo: 'support@klickifyagency.com',
      subject: `Ward ${data.wardNumber} — New civic report filed: ${categoryLabel} (${firstName}, a resident needs your attention)`,
      html,
    });
    return { success: true, id: result.data?.id };
  } catch (err) {
    console.error('Email failed:', err);
    return { success: false, error: err };
  }
}
