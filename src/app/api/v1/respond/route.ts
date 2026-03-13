import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { sendAldermanResponseEmail } from '@/lib/email';

const ALDERMEN: Record<number,string> = {1:'Valencia Hall',2:'Billie Joe Frazier',3:'Sarah Carter-Smith',4:'Felicia Bridgewater-Irving',5:'Benjamin Davis',6:'Curtis Moroney'};

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get('token');
  if (!token) return NextResponse.json({ error: 'No token' }, { status: 400 });
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
  const { data, error } = await supabase.from('reports').select('*').eq('respond_token', token).single();
  if (error || !data) return NextResponse.json({ error: 'Invalid token' }, { status: 404 });
  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  const { token, response } = await req.json();
  if (!token || !response) return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

  // Get report first to notify citizen
  const { data: report } = await supabase.from('reports').select('*').eq('respond_token', token).single();
  if (!report) return NextResponse.json({ error: 'Invalid token' }, { status: 404 });

  const { error } = await supabase.from('reports')
    .update({ alderman_response: response, alderman_responded_at: new Date().toISOString(), status: 'acknowledged' })
    .eq('respond_token', token);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Notify citizen if report has a user
  if (report.user_id) {
    try {
      const { data: authUser } = await supabase.auth.admin.getUserById(report.user_id);
      const { data: profile } = await supabase.from('profiles').select('full_name').eq('id', report.user_id).single();
      if (authUser?.user?.email) {
        const wardNum = report.ward_number ?? report.ward?.ward_number;
        const aldermanName = ALDERMEN[Number(wardNum)] ?? 'Your Alderman';
        await sendAldermanResponseEmail({
          to: authUser.user.email,
          citizenName: profile?.full_name ?? 'Resident',
          aldermanName,
          wardNumber: wardNum ?? '?',
          reportId: report.id.slice(0,8).toUpperCase(),
          category: report.category,
          aldermanResponse: response,
          reportUrl: `${process.env.NEXT_PUBLIC_APP_URL ?? 'https://we-the-people-39120.vercel.app'}/report/${report.id}`,
        });
      }
    } catch(e) { console.error('Failed to send citizen notification:', e); }
  }

  // Post alderman response to Facebook via Make webhook
  try {
    const makeUrl = process.env.MAKE_WEBHOOK_URL;
    if (makeUrl) {
      const wardNum = report.ward_number ?? '?';
      const aldermanName = ALDERMEN[Number(wardNum)] ?? 'Your Alderman';
      const aldermanPhoto = wardNum && wardNum !== '?' ? `https://natchez.ms.us/ImageRepository/Document?documentId=${[0,1411,1406,1410,1408,1405,1407][Number(wardNum)]}` : null;
      const reportUrl = `${process.env.NEXT_PUBLIC_APP_URL ?? 'https://we-the-people-39120.vercel.app'}/report/${report.id}`;
      const LABELS: Record<string,string> = { graffiti:'Graffiti / Vandalism',dumping:'Illegal Dumping',abandoned_vehicle:'Abandoned Vehicle',property_neglect:'Property Neglect',noise:'Noise Complaint',street_issues:'Street / Pothole Issues',vegetation:'Overgrown Vegetation',animal:'Animal Issues',safety_hazard:'Safety Hazard',water_drainage:'Water / Drainage',public_safety:'Public Safety' };
      const label = LABELS[report.category] ?? report.category;
      const message = `✅ OFFICIAL RESPONSE — ${label.toUpperCase()}

🏛️ Ward ${wardNum} Alderman ${aldermanName} has officially responded:

"${response.slice(0, 300)}${response.length > 300 ? '...' : ''}"

👉 View the full report & response: ${reportUrl}

#WeThePeople39120 #Natchez #NatchezMS #Ward${wardNum} #Mississippi #CivicEngagement`;
      await fetch(makeUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message,
          photo_url: aldermanPhoto,
          image_url: aldermanPhoto,
          report_url: reportUrl,
          category: label,
          ward: `Ward ${wardNum}`,
          has_photo: !!aldermanPhoto,
          alderman_name: aldermanName,
          alderman_photo: aldermanPhoto,
          ward_number: wardNum,
          type: 'alderman_response',
        }),
      }).catch(e => console.error('Make webhook failed:', e));
    }
  } catch(e) { console.error('Facebook post failed:', e); }

  return NextResponse.json({ success: true });
}
