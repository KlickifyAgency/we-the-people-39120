import { Resend } from 'resend';


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
  respondToken?: string;
}

export async function sendAldermanNotification(data: ReportEmailData) {
  const resend = new Resend(process.env.RESEND_API_KEY);
  const categoryLabel = CATEGORY_LABELS[data.category] ?? data.category;
  const mapsUrl = `https://maps.google.com/?q=${data.lat},${data.lng}`;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://we-the-people-39120.vercel.app';
  const reportUrl = `${appUrl}/report/${data.reportId}`;
  const respondUrl = data.respondToken ? `${appUrl}/respond/${data.respondToken}` : null;
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
.hdr{padding:36px 32px 28px;background:linear-gradient(135deg,#1A5EA8 0%,#2D7A4F 100%);text-align:center}
.hdr img{height:80px;margin-bottom:18px;display:block;margin-left:auto;margin-right:auto}
.hdr h1{color:white;font-size:22px;font-weight:800;line-height:1.4;margin-bottom:8px}
.hdr p{color:rgba(255,255,255,0.8);font-size:13px;font-weight:500}
.body{padding:32px}
.greeting{font-size:15px;line-height:1.9;color:#475569;margin-bottom:24px}
.greeting strong{color:#0F172A}
.collab-box{background:#EBF2FB;border:1px solid #C3D4EE;border-left:4px solid #1A5EA8;border-radius:12px;padding:18px 20px;margin-bottom:24px}
.collab-box p{font-size:14px;color:#1E3A5F;line-height:1.8;font-style:italic}
.report-box{border-radius:14px;overflow:hidden;margin-bottom:24px;border:1px solid #DDE3EC}
.report-row{display:flex;padding:13px 18px;border-bottom:1px solid #F0F4FA;background:#FFFFFF}
.report-row:nth-child(even){background:#F7F9FC}
.report-row:last-child{border-bottom:none}
.lbl{font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:0.08em;color:#94A3B8;min-width:110px;padding-top:2px;flex-shrink:0}
.val{font-size:14px;font-weight:600;color:#0F172A;flex:1}
.photo-box{margin-bottom:24px;border-radius:14px;overflow:hidden;border:1px solid #DDE3EC}
.photo-lbl{padding:10px 16px;background:#F7F9FC;border-bottom:1px solid #DDE3EC;font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:0.08em;color:#94A3B8}
.timer-box{background:#FEF3C7;border:1px solid #FCD34D;border-radius:14px;padding:20px 22px;margin-bottom:24px}
.timer-title{font-size:15px;font-weight:800;color:#92400E;margin-bottom:8px}
.timer-body{font-size:13px;color:#78350F;line-height:1.8}
.timer-body strong{color:#92400E}
.respond-box{background:#E8F5EE;border:2px solid #2D7A4F;border-radius:14px;padding:22px;margin-bottom:24px;text-align:center}
.respond-box h3{font-size:16px;font-weight:800;color:#1A4A30;margin-bottom:8px}
.respond-box p{font-size:13px;color:#2D5A3D;line-height:1.7;margin-bottom:18px}
.btn{display:block;text-align:center;text-decoration:none;padding:16px 24px;border-radius:12px;font-weight:800;font-size:15px;margin-bottom:12px}
.btn-green{background:#2D7A4F;color:white!important}
.btn-blue{background:#1A5EA8;color:white!important}
.btn-outline{background:#FFFFFF;color:#1A5EA8!important;border:2px solid #1A5EA8}
.divider{height:1px;background:#F0F4FA;margin:24px 0}
.footer{padding:24px 32px;background:#F7F9FC;border-top:1px solid #DDE3EC}
.footer p{font-size:12px;color:#94A3B8;line-height:1.9;text-align:center}
.footer a{color:#1A5EA8;text-decoration:none}
</style>
</head>
<body>
<div class="wrap"><div class="card">
  <div class="hdr">
    <div style="text-align:center;margin-bottom:4px"><span style="font-size:30px;font-weight:900;color:#ffffff;font-family:Georgia,serif">We The People</span><br/><span style="font-size:24px;font-weight:900;color:#ffffff;letter-spacing:4px;font-family:Georgia,serif">39120</span></div>
    <h1>New Civic Report Filed<br/>for Ward ${data.wardNumber}</h1>
    <p>Report #${data.reportId.slice(0,8).toUpperCase()} &nbsp;&middot;&nbsp; Natchez, MS 39120</p>
  </div>
  <div class="body">
    <p class="greeting">Dear <strong>${firstName}</strong>,<br><br>
      A resident of <strong>Ward ${data.wardNumber}</strong> has submitted a civic report through <em>We The People 39120</em>. This report is now <strong>publicly visible</strong> to the Natchez community.
    </p>
    <div class="collab-box"><p>"This platform exists not to criticize, but to collaborate. We elected you because we believe in you. This resident is reaching out through the proper civic channel — trusting that you will respond. Together, we can make Natchez better."</p></div>
    <div class="report-box">
      <div class="report-row"><div class="lbl">Issue Type</div><div class="val">${categoryLabel}</div></div>
      <div class="report-row"><div class="lbl">Ward</div><div class="val">Ward ${data.wardNumber} — Natchez, MS 39120</div></div>
      <div class="report-row"><div class="lbl">Coordinates</div><div class="val" style="font-size:13px;color:#64748B">${data.lat.toFixed(5)}, ${data.lng.toFixed(5)}</div></div>
      ${data.description ? `<div class="report-row"><div class="lbl">Description</div><div class="val" style="font-weight:400;font-style:italic;color:#475569">"${data.description}"</div></div>` : ''}
      <div class="report-row"><div class="lbl">Submitted by</div><div class="val">${data.isAnonymous ? 'Anonymous resident of Ward ' + data.wardNumber : 'A registered community member'}</div></div>
      <div class="report-row"><div class="lbl">Status</div><div class="val" style="color:#B45309;font-weight:700">Pending Response — Day 1 of 30</div></div>
    </div>
    ${data.photoUrl ? `<div class="photo-box"><div class="photo-lbl">Photo Evidence</div><img src="${data.photoUrl}" alt="Report photo" style="width:100%;max-height:320px;object-fit:cover;display:block" /></div>` : ''}
    <div class="timer-box">
      <div class="timer-title">30-Day Public Response Window</div>
      <div class="timer-body">From the moment this report was submitted, a <strong>30-day public window</strong> is now open. Responding publicly — even to acknowledge the issue — demonstrates your commitment to your constituents. Reports without a response after 30 days are flagged as <strong>"Pending Resolution"</strong> on the community map.</div>
    </div>
    ${respondUrl ? `
    <div class="respond-box">
      <h3>Your Official Response Portal</h3>
      <p>This private link is <strong>exclusively for you</strong> as the alderman of Ward ${data.wardNumber}. Use it to post an official public response. Do not share this link.</p>
      <a href="${respondUrl}" class="btn btn-green">Post Your Official Response</a>
    </div>` : ''}
    <a href="${reportUrl}" class="btn btn-blue">View Report on Platform</a>
    <a href="${mapsUrl}" class="btn btn-outline">View Location on Google Maps</a>
    <div class="divider"></div>
    <p style="font-size:13px;color:#94A3B8;text-align:center;line-height:1.8">If this report falls outside Ward ${data.wardNumber}, please forward to the appropriate alderman.<br>Questions? <a href="mailto:support@klickifyagency.com" style="color:#1A5EA8">support@klickifyagency.com</a></p>
  </div>
  <div class="footer"><p>Sent on behalf of a Natchez resident by <strong>We The People 39120</strong><br>
    <a href="${appUrl}">we-the-people-39120.vercel.app</a> &middot; Built by <a href="https://klickifyagency.com">KlickifyAgency.com</a><br>
    This is an automated civic engagement notification. For emergencies, always call 911.</p></div>
</div></div>
</body></html>`;

  try {
    const result = await resend.emails.send({
      from: 'We The People 39120 <onboarding@resend.dev>',
      to: ['gsmith0572@gmail.com'],
      replyTo: 'support@klickifyagency.com',
      subject: `Ward ${data.wardNumber} — New civic report: ${categoryLabel} · ${firstName}, a resident needs your attention`,
      html,
    });
    return { success: true, id: result.data?.id };
  } catch (err) {
    console.error('Email failed:', err);
    return { success: false, error: err };
  }
}

export interface AldermanResponseEmailData {
  to: string;
  citizenName: string;
  aldermanName: string;
  wardNumber: string | number;
  reportId: string;
  category: string;
  aldermanResponse: string;
  reportUrl: string;
}

export async function sendAldermanResponseEmail(data: AldermanResponseEmailData) {
  const resend = new Resend(process.env.RESEND_API_KEY);
  const LABELS: Record<string,string> = { graffiti:'Graffiti / Vandalism',dumping:'Illegal Dumping',abandoned_vehicle:'Abandoned Vehicle',property_neglect:'Property Neglect',noise:'Noise Complaint',street_issues:'Street / Pothole Issues',vegetation:'Overgrown Vegetation',animal:'Animal Issues',safety_hazard:'Safety Hazard',water_drainage:'Water / Drainage Problem',public_safety:'Public Safety Concern' };
  const label = LABELS[data.category] ?? data.category;
  await resend.emails.send({
    from: 'We The People 39120 <noreply@wethepeople39120.com>',
    to: data.to,
    subject: `Official Response from ${data.aldermanName} — Report #${data.reportId}`,
    html: `
    <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;max-width:600px;margin:0 auto;background:#F7F9FC">
      <div style="background:linear-gradient(135deg,#1A5EA8,#2D7A4F);padding:36px 24px 28px;text-align:center;border-radius:16px 16px 0 0">
        <div style="text-align:center;margin-bottom:16px">
          <span style="font-size:28px;font-weight:900;color:#ffffff;font-family:Georgia,serif">We The People</span><br/>
          <span style="font-size:22px;font-weight:900;color:#ffffff;letter-spacing:4px;font-family:Georgia,serif">39120</span>
        </div>
        <h1 style="color:white;font-size:22px;font-weight:800;margin:0">Official Alderman Response</h1>
        <p style="color:rgba(255,255,255,0.85);font-size:14px;margin-top:8px">Your report received an official response</p>
      </div>
      <div style="background:#ffffff;padding:32px 28px">
        <p style="font-size:16px;color:#0F172A">Dear <strong>${data.citizenName}</strong>,</p>
        <p style="font-size:15px;color:#475569;line-height:1.7"><strong>${data.aldermanName}</strong>, Alderman for <strong>Ward ${data.wardNumber}</strong>, has officially responded to your civic report.</p>
        <div style="background:#E8F5EE;border:1px solid #2D7A4F;border-radius:14px;padding:20px 24px;margin:24px 0">
          <div style="font-size:11px;font-weight:800;color:#2D7A4F;text-transform:uppercase;letter-spacing:0.08em;margin-bottom:10px">Official Response from ${data.aldermanName}</div>
          <p style="font-size:15px;color:#0F172A;line-height:1.75;font-style:italic;margin:0">"${data.aldermanResponse}"</p>
          <div style="font-size:12px;color:#64748B;margin-top:12px">${data.aldermanName} · Ward ${data.wardNumber} Alderman · Natchez, MS</div>
        </div>
        <div style="background:#EBF2FB;border-radius:12px;padding:16px 20px;margin-bottom:24px">
          <div style="font-size:12px;color:#475569"><strong>Report:</strong> ${label} · #${data.reportId}</div>
        </div>
        <div style="text-align:center;margin:28px 0">
          <a href="${data.reportUrl}" style="display:inline-block;background:#1A5EA8;color:white;font-weight:800;font-size:15px;padding:14px 32px;border-radius:12px;text-decoration:none">View Full Report</a>
        </div>
        <p style="font-size:13px;color:#94A3B8;text-align:center">We The People 39120 · Natchez, Mississippi · Built by KlickifyAgency.com</p>
      </div>
    </div>`
  });
}
