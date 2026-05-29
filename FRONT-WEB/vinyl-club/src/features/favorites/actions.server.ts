'use server';

import { revalidatePath } from 'next/cache';
import { API } from '@/lib/env';
import {
  buildAuthHeaders,
  extractApiMessage,
  getAuthenticatedProfileContext,
} from '@/features/profil/api';
import type { ToggleFavoriteResult } from './types';

async function submitFavoriteToggle(productId: number): Promise<ToggleFavoriteResult> {
  try {
    const { token, userId } = await getAuthenticatedProfileContext();

    const response = await fetch(`${API.favorites}/toggle`, {
      method: 'POST',
      headers: buildAuthHeaders(token, true),
      body: JSON.stringify({
        userId,
        productId: String(productId),
      }),
    });

    if (!response.ok) {
      const raw = await response.text();
      return {
        ok: false,
        isFavorite: false,
        requiresLogin: response.status === 401 || response.status === 403,
        message: extractApiMessage(raw) || 'Impossible de mettre a jour ce favori.',
      };
    }

    const data = (await response.json()) as { isFavorite?: boolean };

    revalidatePath('/favorite');
    revalidatePath('/catalog');

    return {
      ok: true,
      isFavorite: Boolean(data.isFavorite),
      requiresLogin: false,
      message: null,
    };
  } catch (error) {
    const message =
      error instanceof Error && error.message.trim()
        ? error.message.trim()
        : 'Impossible de mettre a jour ce favori.';

    return {
      ok: false,
      isFavorite: false,
      requiresLogin: message.toLowerCase().includes('connecte'),
      message,
    };
  }
}

function parseProductId(value: FormDataEntryValue | null) {
  const productIdValue = String(value ?? '').trim();
  const productId = Number.parseInt(productIdValue, 10);

  if (!Number.isFinite(productId)) {
    return null;
  }

  return productId;
}

export async function toggleFavoriteAction(productId: number): Promise<ToggleFavoriteResult> {
  if (!Number.isFinite(productId)) {
    return {
      ok: false,
      isFavorite: false,
      requiresLogin: false,
      message: 'Favori invalide.',
    };
  }

  return submitFavoriteToggle(productId);
}

export async function removeFavoriteAction(formData: FormData) {
  const productId = parseProductId(formData.get('productId'));

  if (productId === null) {
    throw new Error('Favori invalide.');
  }

  const result = await submitFavoriteToggle(productId);

  if (!result.ok) {
    throw new Error(result.message || 'Impossible de retirer ce favori.');
  }
}
