import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

const ACCESS_COOKIE = 'startech_admin_token';
const REFRESH_COOKIE = 'startech_admin_refresh_token';
const USER_COOKIE = 'startech_admin_user';
const ACCESS_MAX_AGE = 60 * 60 * 12;
const REFRESH_MAX_AGE = 60 * 60 * 24 * 14;

function normalizeApiBaseUrl(value: string) {
  const trimmed = value.trim().replace(/\/$/, '');

  if (trimmed.endsWith('/api/v1')) return trimmed;
  if (trimmed.endsWith('/api')) return `${trimmed}/v1`;
  return `${trimmed}/api/v1`;
}

function resolveApiBaseUrl() {
  return normalizeApiBaseUrl(process.env.API_BASE_URL || process.env.NEXT_PUBLIC_API_BASE_URL || 'http://127.0.0.1:3001');
}

function getCookieOptions(maxAge: number, httpOnly = true) {
  return {
    httpOnly,
    maxAge,
    path: '/',
    sameSite: 'lax' as const,
    secure: process.env.NODE_ENV === 'production',
  };
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);

  if (!body?.email || !body?.password) {
    return NextResponse.json({ message: 'Email va mat khau la bat buoc.' }, { status: 400 });
  }

  const response = await fetch(`${resolveApiBaseUrl()}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
    cache: 'no-store',
  });

  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    return NextResponse.json(payload ?? { message: 'Dang nhap that bai.' }, { status: response.status });
  }

  const cookieStore = await cookies();
  cookieStore.set(ACCESS_COOKIE, payload.data.accessToken, getCookieOptions(ACCESS_MAX_AGE));
  cookieStore.set(REFRESH_COOKIE, payload.data.refreshToken, getCookieOptions(REFRESH_MAX_AGE));
  cookieStore.set(
    USER_COOKIE,
    encodeURIComponent(
      JSON.stringify({
        id: payload.data.user.id,
        email: payload.data.user.email,
        fullName: payload.data.user.fullName,
        role: payload.data.user.role,
      }),
    ),
    getCookieOptions(ACCESS_MAX_AGE, false),
  );

  return NextResponse.json(payload);
}

export async function DELETE() {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get(REFRESH_COOKIE)?.value;

  if (refreshToken) {
    await fetch(`${resolveApiBaseUrl()}/auth/logout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refreshToken }),
      cache: 'no-store',
    }).catch(() => null);
  }

  cookieStore.delete(ACCESS_COOKIE);
  cookieStore.delete(REFRESH_COOKIE);
  cookieStore.delete(USER_COOKIE);

  return NextResponse.json({ success: true });
}
