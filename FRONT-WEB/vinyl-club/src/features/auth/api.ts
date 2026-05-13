import 'server-only';

import { API } from '@/lib/env';
import {
  getAuthToken,
  getStoredAuthUser,
  getTokenUserSnapshot,
  isTokenExpired,
  normalizeAuthSessionUser,
  type AuthSessionUser,
} from '@/lib/auth.Server';

export type AuthenticatedUser = AuthSessionUser;

export async function getCurrentUser(): Promise<AuthenticatedUser | null> {
  const token = await getAuthToken();

  if (!token) {
    return null;
  }

  if (isTokenExpired(token)) {
    return null;
  }

  const storedUser = await getStoredAuthUser();
  const tokenSnapshot = getTokenUserSnapshot(token);

  try {
    const response = await fetch(API.authMe, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: 'no-store',
    });

    if (response.ok) {
      const data: unknown = await response.json();
      return normalizeAuthSessionUser(data) ?? storedUser ?? tokenSnapshot;
    }

    if (response.status === 400 || response.status === 401 || response.status === 403) {
      return null;
    }

    console.warn(
      `Current user request failed: ${response.status} ${response.statusText}`,
    );
  } catch (error) {
    console.warn('Current user request failed:', error);
  }

  return storedUser ?? tokenSnapshot;
}
