import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

const cookieOptions = {
  httpOnly: true,
  samesite: 'lax',
  secure: process.env.NODE_ENV === 'production',
  path: '/',
};

export async function getAuthToken() {
  const cookieStore = await cookies();
  return cookieStore.get('auth')?.value;
}

export async function requireAuth() {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth')?.value;

  if (!token) {
    redirect('/login');
  }

  return token;
}

export async function setAuthCookie(accessToken: string, refreshToken: string) {
  const cookieStore = await cookies();

  cookieStore.set('auth', accessToken, cookieOptions);
  cookieStore.set('refresh', refreshToken, cookieOptions);
}

export async function clearAuthCookie() {
  const cookieStore = await cookies();

  cookieStore.delete('auth');
  cookieStore.delete('refresh');
}
