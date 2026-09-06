import { NextRequest, NextResponse } from 'next/server';
import { ADMIN_COOKIE, SESSION_TTL_MS, isAuthed, issueSession, passwordMatches } from '@/lib/admin-auth';

// GET — does this browser already hold a valid session?
export async function GET(req: NextRequest) {
  return NextResponse.json({ authed: await isAuthed(req) });
}

export async function POST(req: NextRequest) {
  if (!process.env.ADMIN_PASSWORD || !process.env.ADMIN_SESSION_SECRET) {
    return NextResponse.json({ error: 'Admin auth is not configured' }, { status: 500 });
  }
  const { password } = await req.json().catch(() => ({ password: '' }));
  if (!passwordMatches(String(password ?? ''))) {
    return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
  }
  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_COOKIE, await issueSession(), {
    httpOnly: true, secure: true, sameSite: 'strict', path: '/', maxAge: SESSION_TTL_MS / 1000,
  });
  return res;
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_COOKIE, '', { httpOnly: true, secure: true, sameSite: 'strict', path: '/', maxAge: 0 });
  return res;
}
