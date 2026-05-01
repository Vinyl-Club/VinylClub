import 'server-only';

import { API } from '@/lib/env';
import {
  getAuthToken,
  getStoredAuthUser,
  getTokenUserSnapshot,
  normalizeAuthSessionUser,
  type AuthSessionUser,
} from '@/lib/auth.Server';

export type AuthenticatedUser = AuthSessionUser;

export async function getCurrentUser(): Promise<AuthenticatedUser | null> {
  const token = await getAuthToken();

  if (!token) {
    return null;
  }

  try {
    const response = await fetch(API.authMe, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: 'no-store',
    });

    if (response.ok) {
      const data: unknown = await response.json();
      return normalizeAuthSessionUser(data) ?? getTokenUserSnapshot(token);
    }

    if (response.status === 401 || response.status === 403) {
      return null;
    }

    console.error(
      `Current user request failed: ${response.status} ${response.statusText}`,
    );
  } catch (error) {
    console.error('Current user request failed:', error);
  }

  return (await getStoredAuthUser()) ?? getTokenUserSnapshot(token);
}
