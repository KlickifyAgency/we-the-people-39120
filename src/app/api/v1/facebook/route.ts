import { NextRequest, NextResponse } from 'next/server';
export async function POST(req: NextRequest) {
  const { message, photo_url } = await req.json();
  const makeUrl = process.env.MAKE_WEBHOOK_URL;
  if (!makeUrl) return NextResponse.json({ error: 'Webhook not configured' }, { status: 500 });
  try {
    await fetch(makeUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, photo_url: photo_url ?? null, image_url: photo_url ?? null, has_photo: !!photo_url }),
    });
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: 'Webhook failed' }, { status: 500 });
  }
}
