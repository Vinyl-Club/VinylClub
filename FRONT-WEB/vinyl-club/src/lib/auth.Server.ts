import 'server-only';

import { Buffer } from 'node:buffer';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

const AUTH_USER_COOKIE = 'auth_user';

const cookieOptions = {
  httpOnly: true,
  sameSite: 'lax' as const,
  secure: process.env.NODE_ENV === 'production',
  path: '/',
};

export type AuthSessionUser = {
  id: number | null;
  email: string | null;
  firstName: string | null;
  lastName: string | null;
  role: string | null;
};

function readString(value: unknown) {
  return typeof value === 'string' && value.trim() ? value.trim() : null;
}

function readNumber(value: unknown) {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === 'string' && value.trim()) {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }

  return null;
}

export function normalizeAuthSessionUser(value: unknown): AuthSessionUser | null {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return null;
  }

  const record = value as Record<string, unknown>;
  const user = {
    id: readNumber(record.id ?? record.userId ?? record.sub),
    email: readString(record.email),
    firstName: readString(record.firstName),
    lastName: readString(record.lastName),
    role: readString(record.role),
  };

  if (!user.id && !user.email && !user.firstName && !user.lastName && !user.role) {
    return null;
  }

  return user;
}

function serializeAuthUser(user: AuthSessionUser) {
  return Buffer.from(JSON.stringify(user), 'utf8').toString('base64url');
}

function parseAuthUser(value: string | undefined) {
  if (!value) return null;

  try {
    const raw = Buffer.from(value, 'base64url').toString('utf8');
    return normalizeAuthSessionUser(JSON.parse(raw));
  } catch {
    return null;
  }
}

function decodeJwtPayload(token: string) {
  const [, payload] = token.split('.');

  if (!payload) {
    return null;
  }

  try {
    const raw = Buffer.from(payload, 'base64url').toString('utf8');
    const parsed: unknown = JSON.parse(raw);
    return parsed && typeof parsed === 'object' && !Array.isArray(parsed)
      ? (parsed as Record<string, unknown>)
      : null;
  } catch {
    return null;
  }
}

export function isTokenExpired(token: string, now = Date.now()) {
  const payload = decodeJwtPayload(token);

  if (!payload || !('exp' in payload)) {
    return false;
  }

  const expiration = readNumber(payload.exp);

  if (expiration === null) {
    return false;
  }

  return expiration * 1000 <= now;
}

export function getTokenUserSnapshot(token: string): AuthSessionUser | null {
  const payload = decodeJwtPayload(token);

  if (!payload) {
    return null;
  }

  return normalizeAuthSessionUser({
    id: payload.userId ?? payload.sub,
    role: payload.role,
  });
}

export async function getAuthToken() {
  const cookieStore = await cookies();
  return cookieStore.get('auth')?.value?.trim();
}

export async function getStoredAuthUser() {
  const cookieStore = await cookies();
  return parseAuthUser(cookieStore.get(AUTH_USER_COOKIE)?.value);
}

export async function getSessionAuthUser() {
  const token = await getAuthToken();

  if (!token || isTokenExpired(token)) {
    return null;
  }

  return (await getStoredAuthUser()) ?? getTokenUserSnapshot(token);
}

export async function requireAuth() {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth')?.value?.trim();

  if (!token || isTokenExpired(token)) {
    redirect('/login');
  }

  return token;
}

export async function setAuthCookie(
  accessToken: string,
  refreshToken: string,
  user?: unknown,
) {
  const cookieStore = await cookies();
  const authUser = normalizeAuthSessionUser(user) ?? getTokenUserSnapshot(accessToken);

  cookieStore.set('auth', accessToken, cookieOptions);
  cookieStore.set('refresh', refreshToken, cookieOptions);

  if (authUser) {
    cookieStore.set(AUTH_USER_COOKIE, serializeAuthUser(authUser), cookieOptions);
  } else {
    cookieStore.delete(AUTH_USER_COOKIE);
  }
}

export async function setStoredAuthUser(user: unknown) {
  const cookieStore = await cookies();
  const authUser = normalizeAuthSessionUser(user);

  if (authUser) {
    cookieStore.set(AUTH_USER_COOKIE, serializeAuthUser(authUser), cookieOptions);
  } else {
    cookieStore.delete(AUTH_USER_COOKIE);
  }
}

export async function clearAuthCookie() {
  const cookieStore = await cookies();

  cookieStore.delete('auth');
  cookieStore.delete('refresh');
  cookieStore.delete(AUTH_USER_COOKIE);
}
