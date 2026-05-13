import 'server-only';

import { API } from '@/lib/env';
import { getAuthToken, getSessionAuthUser } from '@/lib/auth.Server';
import {
  buildAuthHeaders,
  extractApiMessage,
  getAuthenticatedProfileContext,
} from '@/features/profil/api';
import type { CatalogItem } from '@/features/catalog/types';
import type { FavoriteEntity, FavoritesPageData, FavoriteSelectionData } from './types';

function normalizeFavoriteProductIds(favorites: FavoriteEntity[]) {
  return favorites
    .map((favorite) => Number.parseInt(favorite.productId ?? '', 10))
    .filter((productId) => Number.isFinite(productId));
}

export async function getUserFavorites(userId: number, token: string) {
  const response = await fetch(`${API.favorites}/${userId}`, {
    headers: buildAuthHeaders(token),
    cache: 'no-store',
  });

  if (!response.ok) {
    const raw = await response.text();
    throw new Error(extractApiMessage(raw) || 'Impossible de charger vos favoris.');
  }

  const data = (await response.json()) as FavoriteEntity[];
  return Array.isArray(data) ? data : [];
}

export async function getFavoriteAds(productIds: number[]) {
  if (productIds.length === 0) {
    return [];
  }

  const params = new URLSearchParams();

  for (const productId of productIds) {
    params.append('productIds', String(productId));
  }

  const response = await fetch(`${API.favoriteAds}?${params.toString()}`, {
    cache: 'no-store',
  });

  if (!response.ok) {
    const raw = await response.text();
    throw new Error(extractApiMessage(raw) || 'Impossible de charger vos annonces favorites.');
  }

  const data = (await response.json()) as CatalogItem[];
  return Array.isArray(data) ? data : [];
}

export async function getFavoritesPageData(): Promise<FavoritesPageData> {
  try {
    const { token, userId } = await getAuthenticatedProfileContext();
    const favorites = await getUserFavorites(userId, token);
    const productIds = normalizeFavoriteProductIds(favorites);

    if (productIds.length === 0) {
      return {
        count: 0,
        items: [],
        error: null,
      };
    }

    const ads = await getFavoriteAds(productIds);
    const adsByProductId = new Map<number, CatalogItem>();

    for (const ad of ads) {
      if (typeof ad.productId === 'number') {
        adsByProductId.set(ad.productId, ad);
      }
    }

    const items = productIds
      .map((productId) => adsByProductId.get(productId))
      .filter((item): item is CatalogItem => Boolean(item));

    return {
      count: items.length,
      items,
      error: null,
    };
  } catch (error) {
    const message =
      error instanceof Error && error.message.trim()
        ? error.message.trim()
        : 'Impossible de charger vos favoris.';

    return {
      count: 0,
      items: [],
      error: message,
    };
  }
}

export async function getCurrentUserFavoriteSelection(): Promise<FavoriteSelectionData> {
  const token = await getAuthToken();

  if (!token) {
    return {
      isAuthenticated: false,
      productIds: [],
    };
  }

  const currentUser = await getSessionAuthUser();

  if (!currentUser?.id) {
    return {
      isAuthenticated: false,
      productIds: [],
    };
  }

  try {
    const favorites = await getUserFavorites(currentUser.id, token);

    return {
      isAuthenticated: true,
      productIds: normalizeFavoriteProductIds(favorites),
    };
  } catch {
    return {
      isAuthenticated: true,
      productIds: [],
    };
  }
}
