import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const report_id = formData.get('report_id') as string;
  const content = formData.get('content') as string;
  const photoFile = formData.get('photo') as File | null;

  if (!report_id || !content?.trim()) return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
  if (content.trim().length < 5) return NextResponse.json({ error: 'Too short' }, { status: 400 });

  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

  let photo_url: string | null = null;
  if (photoFile && photoFile.size > 0) {
    const ext = photoFile.name.split('.').pop() ?? 'jpg';
    const fileName = `comments/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('report-photos')
      .upload(fileName, photoFile, { contentType: photoFile.type });
    if (!uploadError) {
      const { data: urlData } = supabase.storage.from('report-photos').getPublicUrl(uploadData.path);
      photo_url = urlData.publicUrl;
    }
  }

  const { data, error } = await supabase.from('comments')
    .insert({ report_id, content: content.trim(), photo_url })
    .select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Get report info for Facebook post
  const { data: report } = await supabase.from('reports').select('category, ward_number, id').eq('id', report_id).single();

  // Post to Facebook via Make webhook
  const makeUrl = process.env.MAKE_WEBHOOK_URL;
  if (makeUrl && report) {
    const LABELS: Record<string,string> = {
      graffiti:'Graffiti / Vandalism', dumping:'Illegal Dumping', abandoned_vehicle:'Abandoned Vehicle',
      property_neglect:'Property Neglect', noise:'Noise Complaint', street_issues:'Street / Pothole Issues',
      vegetation:'Overgrown Vegetation', animal:'Animal Issues', safety_hazard:'Safety Hazard',
      water_drainage:'Water / Drainage', public_safety:'Public Safety',
    };
    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://we-the-people-39120.vercel.app';
    const label = LABELS[report.category] ?? report.category;
    const reportUrl = `${appUrl}/report/${report.id}`;
    const message = `📢 COMMUNITY UPDATE — ${label.toUpperCase()}\n\nWard ${report.ward_number} — A neighbor has submitted a community update:\n\n"${content.trim().slice(0, 300)}${content.trim().length > 300 ? '...' : ''}"\n\n👉 View the full report: ${reportUrl}\n\n#WeThePeople39120 #Natchez #NatchezMS #Ward${report.ward_number} #CommunityUpdate`;
    fetch(makeUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message,
        photo_url: photo_url ?? null,
        image_url: photo_url ?? null,
        has_photo: !!photo_url,
        type: 'community_update',
      }),
    }).catch(e => console.error('Make webhook failed:', e));
  }

  return NextResponse.json(data);
}

export async function GET(req: NextRequest) {
  const report_id = req.nextUrl.searchParams.get('report_id');
  if (!report_id) return NextResponse.json({ error: 'Missing report_id' }, { status: 400 });
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
  const { data, error } = await supabase.from('comments').select('*').eq('report_id', report_id).order('created_at', { ascending: true });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data ?? []);
}
