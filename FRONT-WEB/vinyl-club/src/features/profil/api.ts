import 'server-only';

import { API } from '@/lib/env';
import { getAuthToken, getSessionAuthUser } from '@/lib/auth.Server';
import { getCurrentUser } from '@/features/auth/api';
import type {
  ProfileAddress,
  ProfileListing,
  ProfilePageData,
  ProfileTab,
  ProfileUser,
} from './types';

type AddressResponse = {
  id?: number | null;
  street?: string | null;
  zipCode?: string | null;
  city?: string | null;
  country?: string | null;
};

type UserResponse = {
  id?: number | null;
  email?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  phone?: string | null;
  role?: string | null;
};

function readString(value: unknown) {
  return typeof value === 'string' ? value.trim() : '';
}

function readNullableString(value: unknown) {
  const normalized = readString(value);
  return normalized || null;
}

export function extractApiMessage(raw: string) {
  try {
    const parsed: unknown = raw ? JSON.parse(raw) : null;

    if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
      const payload = parsed as Record<string, unknown>;

      if (typeof payload.message === 'string' && payload.message.trim()) {
        return payload.message.trim();
      }

      for (const value of Object.values(payload)) {
        if (typeof value === 'string' && value.trim()) {
          return value.trim();
        }

        if (Array.isArray(value) && value.length > 0) {
          return String(value[0] ?? '').trim();
        }
      }
    }
  } catch {
    // ignore invalid json
  }

  return raw.trim();
}

export async function getAuthenticatedProfileContext() {
  const token = await getAuthToken();

  if (!token) {
    throw new Error('Vous devez etre connecte pour acceder a votre profil.');
  }

  const sessionUser = await getSessionAuthUser();

  if (sessionUser?.id) {
    return {
      token,
      userId: sessionUser.id,
    };
  }

  const currentUser = await getCurrentUser();

  if (!currentUser?.id) {
    throw new Error('Session utilisateur introuvable.');
  }

  return {
    token,
    userId: currentUser.id,
  };
}

export function buildAuthHeaders(token: string, json = false) {
  const headers = new Headers({
    Authorization: `Bearer ${token}`,
    Cookie: `auth=${token}`,
  });

  if (json) {
    headers.set('Content-Type', 'application/json');
  }

  return headers;
}

function normalizeProfileUser(value: UserResponse): ProfileUser {
  const id = typeof value.id === 'number' ? value.id : Number(value.id ?? 0);

  return {
    id,
    email: readString(value.email),
    firstName: readString(value.firstName),
    lastName: readString(value.lastName),
    phone: readNullableString(value.phone),
    role: readNullableString(value.role),
  };
}

function normalizeAddress(value: AddressResponse): ProfileAddress {
  return {
    id: typeof value.id === 'number' ? value.id : null,
    street: readString(value.street),
    zipCode: readString(value.zipCode),
    city: readString(value.city),
    country: readString(value.country),
  };
}

export async function getProfileUser(userId: number, token: string) {
  const response = await fetch(`${API.users}/${userId}`, {
    headers: buildAuthHeaders(token),
    cache: 'no-store',
  });

  if (!response.ok) {
    const raw = await response.text();
    throw new Error(extractApiMessage(raw) || 'Impossible de charger votre profil.');
  }

  const data = (await response.json()) as UserResponse;
  return normalizeProfileUser(data);
}

export async function getUserAddresses(userId: number, token: string) {
  const response = await fetch(`${API.addresses}/users/${userId}`, {
    headers: buildAuthHeaders(token),
    cache: 'no-store',
  });

  if (!response.ok) {
    const raw = await response.text();
    throw new Error(extractApiMessage(raw) || 'Impossible de charger votre adresse.');
  }

  const data = (await response.json()) as AddressResponse[];
  return Array.isArray(data) ? data.map(normalizeAddress) : [];
}

export async function getProfileAds(token: string) {
  const response = await fetch(API.profileAds, {
    headers: buildAuthHeaders(token),
    cache: 'no-store',
  });

  if (!response.ok) {
    const raw = await response.text();
    throw new Error(extractApiMessage(raw) || 'Impossible de charger vos annonces.');
  }

  const data = (await response.json()) as ProfileListing[];
  return Array.isArray(data) ? data : [];
}

export async function getProfilePageData(activeTab: ProfileTab = 'profile'): Promise<ProfilePageData> {
  const { token, userId } = await getAuthenticatedProfileContext();

  const [user, addresses, ads] = await Promise.all([
    getProfileUser(userId, token),
    getUserAddresses(userId, token),
    activeTab === 'ads' ? getProfileAds(token) : Promise.resolve([]),
  ]);

  return {
    user,
    address: addresses[0] ?? null,
    ads,
  };
}
