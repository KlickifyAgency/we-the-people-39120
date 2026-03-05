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

  const { data: report, error } = await supabase
    .from('reports')
    .insert({ category, lat, lng, description, anonymous, photo_url, status: 'pending' })
    .select('*, ward:wards(ward_number)')
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

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
      });
    }
  } catch (emailErr) {
    console.error('Email failed (non-blocking):', emailErr);
  }

  return NextResponse.json(report, { status: 201 });
}
