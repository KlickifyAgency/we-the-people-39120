import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase';
import { ReportCategory } from '@/lib/types';
import { sendAldermanNotification } from '@/lib/email';
import { detectWardServer } from '@/lib/ward-detection-server';
import { MAYOR } from '@/lib/constants';

export async function GET(req: NextRequest) {
  const supabase = createClient();
  const { searchParams } = req.nextUrl;
  const category  = searchParams.get('category') as ReportCategory | null;
  const status    = searchParams.get('status');
  const timeRange = searchParams.get('timeRange');
  const ward      = searchParams.get('ward');

  let query = supabase
    .from('reports')
    .select('*, ward:wards(ward_number)')
    .order('created_at', { ascending: false })
    .limit(100);

  if (category) query = query.eq('category', category);
  if (status)   query = query.eq('status', status);
  if (ward && ward !== 'all') query = query.eq('ward_id', ward);

  if (timeRange && timeRange !== 'all') {
    const hours: Record<string, number> = { '24h': 24, '7d': 168, '30d': 720 };
    const h = hours[timeRange];
    if (h) {
      const since = new Date(Date.now() - h * 3600 * 1000).toISOString();
      query = query.gte('created_at', since);
    }
  }

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  // Award points to user if not anonymous
  if (userId) {
    fetch(`${process.env.NEXT_PUBLIC_APP_URL ?? 'https://we-the-people-39120.vercel.app'}/api/v1/points`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: userId, action: 'report_submitted' })
    }).catch(() => {});
  }
  return NextResponse.json(data ?? []);
}

export async function POST(req: NextRequest) {
  const supabase  = createClient();
  const formData  = await req.formData();
  const category  = formData.get('category') as ReportCategory;
  const lat       = parseFloat(formData.get('lat') as string);
  const lng       = parseFloat(formData.get('lng') as string);
  const description = (formData.get('description') as string) || null;
  const anonymous   = formData.get('anonymous') === 'true';
  const photoFile   = formData.get('photo') as File | null;
  const { data: { user } } = await supabase.auth.getUser();
  const userId = user?.id ?? null;

  if (!category || isNaN(lat) || isNaN(lng)) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  let photo_url: string | null = null;
  if (photoFile && photoFile.size > 0) {
    const ext      = photoFile.name.split('.').pop() ?? 'jpg';
    const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('report-photos')
      .upload(fileName, photoFile, { contentType: photoFile.type });
    if (uploadError) return NextResponse.json({ error: 'Photo upload failed' }, { status: 500 });
    const { data: urlData } = supabase.storage.from('report-photos').getPublicUrl(uploadData.path);
    photo_url = urlData.publicUrl;
  }

  const respondToken = crypto.randomUUID();
  const { data: report, error } = await supabase
    .from('reports')
    .insert({ category, lat, lng, description, anonymous, photo_url, status: 'pending', respond_token: respondToken })
    .select('*, ward:wards(ward_number)')
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  // Award points to user if not anonymous
  if (userId) {
    fetch(`${process.env.NEXT_PUBLIC_APP_URL ?? 'https://we-the-people-39120.vercel.app'}/api/v1/points`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: userId, action: 'report_submitted' })
    }).catch(() => {});
  }

  try {
    const wardInfo = detectWardServer(lat, lng);
    if (wardInfo) {
      await sendAldermanNotification({
        aldermanName:  wardInfo.alderman,
        aldermanEmail: wardInfo.email,
        wardNumber:    wardInfo.ward,
        category, description: description ?? undefined,
        lat, lng, reportId: report.id,
        photoUrl: photo_url ?? undefined,
        isAnonymous: anonymous,
        respondToken,
      });
    } else {
      await sendAldermanNotification({
        aldermanName:  MAYOR.name,
        aldermanEmail: MAYOR.email,
        wardNumber:    0,
        category, description: description ?? undefined,
        lat, lng, reportId: report.id,
        photoUrl: photo_url ?? undefined,
        isAnonymous: anonymous,
        respondToken,
      });
    }
  } catch (emailErr) {
    console.error('Email failed (non-blocking):', emailErr);
  }

  // Post to Facebook via Make webhook
  console.log('MAKE_WEBHOOK_URL:', process.env.MAKE_WEBHOOK_URL ? 'SET' : 'NOT SET');
  try {
    const makeUrl = process.env.MAKE_WEBHOOK_URL;
    if (makeUrl) {
      const LABELS: Record<string, string> = {
        graffiti: 'Graffiti', dumping: 'Illegal Dumping',
        abandoned_vehicle: 'Abandoned Vehicle', property_neglect: 'Property Neglect',
        noise: 'Noise Complaint', street_issues: 'Street Issues',
        vegetation: 'Overgrown Vegetation', animal: 'Animal Issue',
        safety_hazard: 'Safety Hazard', water_drainage: 'Water/Drainage',
        public_safety: 'Public Safety',
      };
      const label = LABELS[category] ?? category;
      const wardNum = report.ward?.ward_number ?? detectWardServer(lat, lng)?.ward ?? '?';
      const reportUrl = `https://we-the-people-39120.vercel.app/report/${report.id}`;
      const message = `🚨 NEW REPORT — ${label.toUpperCase()}\n\n📍 Ward ${wardNum} — Natchez, MS 39120${description ? `\n\n"${description.slice(0, 200)}${description.length > 200 ? '...' : ''}"` : ''}\n\n⏱️ The alderman has 30 days to respond publicly.\n👉 View & support this report: ${reportUrl}\n\n#WeThePeople39120 #Natchez #NatchezMS #Ward${wardNum} #Mississippi`;
      await fetch(makeUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, photo_url: photo_url ?? null, image_url: photo_url ?? null, report_url: reportUrl, category: label, ward: `Ward ${wardNum}`, has_photo: !!photo_url }),
      }).catch(e => console.error('Make webhook failed:', e));
    }
  } catch (fbErr) {
    console.error('Facebook post failed (non-blocking):', fbErr);
  }

  return NextResponse.json(report, { status: 201 });
}
