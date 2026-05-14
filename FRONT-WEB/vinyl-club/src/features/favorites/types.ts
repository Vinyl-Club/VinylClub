import type { CatalogItem } from '@/features/catalog/types';

export interface FavoriteEntity {
  id?: string;
  userId?: number | null;
  productId?: string | null;
  createdAt?: string | null;
}

export interface FavoritesPageData {
  count: number;
  items: CatalogItem[];
  error: string | null;
}

export interface FavoriteSelectionData {
  isAuthenticated: boolean;
  productIds: number[];
}

export interface ToggleFavoriteResult {
  ok: boolean;
  isFavorite: boolean;
  requiresLogin: boolean;
  message: string | null;
}
