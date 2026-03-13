import { NextRequest, NextResponse } from 'next/server';

const MAKE_WEBHOOK_URL = process.env.MAKE_WEBHOOK_URL ?? '';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { category, description, ward_number, id, photo_url } = body;

    const LABELS: Record<string, string> = {
      graffiti: 'Graffiti', dumping: 'Illegal Dumping',
      abandoned_vehicle: 'Abandoned Vehicle', property_neglect: 'Property Neglect',
      noise: 'Noise Complaint', street_issues: 'Street Issues',
      vegetation: 'Overgrown Vegetation', animal: 'Animal Issue',
      safety_hazard: 'Safety Hazard', water_drainage: 'Water/Drainage',
      public_safety: 'Public Safety',
    };

    const label = LABELS[category] ?? category;
    const wardText = ward_number ? `Ward ${ward_number}` : 'Natchez';
    const reportUrl = `https://we-the-people-39120.vercel.app/report/${id}`;

    const message = `🚨 NEW REPORT — ${label.toUpperCase()}

📍 ${wardText} — Natchez, MS 39120
${description ? `\n"${description.slice(0, 200)}${description.length > 200 ? '...' : ''}"` : ''}

⏱️ Your alderman has 30 days to respond publicly.
👉 View & support this report: ${reportUrl}

#WeThePeople39120 #Natchez #NatchezMS #CivicAction #Ward${ward_number} #Mississippi`;

    if (MAKE_WEBHOOK_URL) {
      await fetch(MAKE_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, photo_url, report_url: reportUrl, category: label, ward: wardText }),
      });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('Facebook post error:', err);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
