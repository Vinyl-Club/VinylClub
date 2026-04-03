'use server';

import { API } from '@/lib/env';
import { getAuthToken } from '@/lib/auth.Server';
import type { Album, Artist, CreatedAd, State } from './types';

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

function emptyState(): State {
  return {
    fieldErrors: {},
    formError: '',
    successMessage: '',
  };
}

function extractMessage(raw: string): string {
  try {
    const parsed: unknown = raw ? JSON.parse(raw) : null;

    if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
      const payload = parsed as Record<string, unknown>;

      if (typeof payload.message === 'string' && payload.message.trim()) {
        return payload.message;
      }

      for (const value of Object.values(payload)) {
        if (Array.isArray(value) && value.length > 0) {
          return String(value[0]);
        }
      }
    }
  } catch {
    // not json
  }

  return raw;
}

function mapBackendFieldErrors(raw: string): Record<string, string> | null {
  try {
    const parsed: unknown = raw ? JSON.parse(raw) : null;

    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
      return null;
    }

    const apiErrors = parsed as Record<string, unknown>;
    const fieldErrors: Record<string, string> = {};

    for (const [field, messages] of Object.entries(apiErrors)) {
      const firstMessage =
        Array.isArray(messages) && messages.length > 0
          ? String(messages[0])
          : String(messages ?? '');

      let cleanField = field;

      if (cleanField.startsWith('product.')) {
        cleanField = cleanField.replace('product.', '');
      }

      if (cleanField === 'title') cleanField = 'titre';
      if (cleanField === 'artist' || cleanField === 'artist.id') cleanField = 'artiste';
      if (cleanField === 'album' || cleanField === 'album.id') cleanField = 'album';
      if (cleanField === 'category' || cleanField === 'category.id') cleanField = 'style';
      if (cleanField === 'state') cleanField = 'etat';
      if (cleanField === 'price') cleanField = 'prix';

      if (!fieldErrors[cleanField]) {
        fieldErrors[cleanField] = firstMessage;
      }
    }

    return fieldErrors;
  } catch {
    return null;
  }
}

function getImageFiles(formData: FormData): File[] {
  return formData
    .getAll('images')
    .filter((entry): entry is File => entry instanceof File && entry.size > 0);
}

async function uploadImages(productId: number, files: File[], token: string) {
  for (const file of files) {
    if (!file.type.startsWith('image/')) {
      throw new Error('Chaque fichier doit etre une image.');
    }

    if (file.size > MAX_IMAGE_SIZE) {
      throw new Error('Chaque image doit faire moins de 5 Mo.');
    }

    const uploadFormData = new FormData();
    uploadFormData.append('file', file, file.name || `image-${Date.now()}.jpg`);

    const response = await fetch(`${API.images}upload?productId=${productId}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        Cookie: `auth=${token}`,
      },
      body: uploadFormData,
      cache: 'no-store',
    });

    if (!response.ok) {
      const raw = await response.text();
      throw new Error(extractMessage(raw) || `Impossible d'uploader ${file.name}.`);
    }
  }
}

export async function findOrCreateArtistId(name: string): Promise<number> {
  const trimmedArtistName = name.trim();

  if (!trimmedArtistName) {
    throw new Error("L'artiste est obligatoire.");
  }

  const searchArtist = await fetch(
    `${API.searchArtist}?query=${encodeURIComponent(trimmedArtistName)}`,
    {
      method: 'GET',
      cache: 'no-store',
    },
  );

  if (!searchArtist.ok) {
    throw new Error("Impossible de rechercher l'artiste.");
  }

  const artists: Artist[] = await searchArtist.json();

  const exactMatch = artists.find(
    (artist) => artist.name.trim().toLowerCase() === trimmedArtistName.toLowerCase(),
  );

  if (exactMatch) {
    return exactMatch.id;
  }

  const token = await getAuthToken();

  const createResponse = await fetch(API.artist, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Cookie: `auth=${token}`,
    },
    body: JSON.stringify({ name: trimmedArtistName }),
    cache: 'no-store',
  });

  const raw = await createResponse.text();

  if (!createResponse.ok) {
    throw new Error(extractMessage(raw) || "Impossible de creer l'artiste.");
  }

  const contentType = createResponse.headers.get('content-type');
  if (!contentType || !contentType.includes('application/json')) {
    throw new Error('Reponse serveur invalide pour la creation artiste.');
  }

  const createdArtist: Artist = raw ? JSON.parse(raw) : null;
  if (!createdArtist?.id) {
    throw new Error('Reponse invalide : id artiste manquant.');
  }

  return createdArtist.id;
}

export async function findOrCreateAlbumId(name: string): Promise<number> {
  const trimmedAlbumName = name.trim();

  if (!trimmedAlbumName) {
    throw new Error("L'album est obligatoire.");
  }

  const searchAlbum = await fetch(
    `${API.searchAlbum}?query=${encodeURIComponent(trimmedAlbumName)}`,
    {
      method: 'GET',
      cache: 'no-store',
    },
  );

  if (!searchAlbum.ok) {
    throw new Error("Impossible de rechercher l'album.");
  }

  const albums: Album[] = await searchAlbum.json();

  const exactMatch = albums.find(
    (album) => album.name.trim().toLowerCase() === trimmedAlbumName.toLowerCase(),
  );

  if (exactMatch) {
    return exactMatch.id;
  }

  const token = await getAuthToken();

  const createResponse = await fetch(API.album, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Cookie: `auth=${token}`,
    },
    body: JSON.stringify({ name: trimmedAlbumName }),
    cache: 'no-store',
  });

  const raw = await createResponse.text();

  if (!createResponse.ok) {
    throw new Error(extractMessage(raw) || "Impossible de creer l'album.");
  }

  const contentType = createResponse.headers.get('content-type');
  if (!contentType || !contentType.includes('application/json')) {
    throw new Error('Reponse serveur invalide pour la creation album.');
  }

  const createdAlbum: Album = raw ? JSON.parse(raw) : null;
  if (!createdAlbum?.id) {
    throw new Error('Reponse invalide : id album manquant.');
  }

  return createdAlbum.id;
}

export async function createAdAction(
  prevState: State,
  formData: FormData,
): Promise<State> {
  try {
    const title = String(formData.get('titre') ?? '').trim();
    const artistName = String(formData.get('artiste') ?? '').trim();
    const albumName = String(formData.get('album') ?? '').trim();
    const categoryId = Number(formData.get('style') ?? '');
    const description = String(formData.get('description') ?? '').trim();
    const state = String(formData.get('etat') ?? '').trim();
    const price = Number(formData.get('prix') ?? '');
    const format = String(formData.get('format') ?? '').trim();
    const imageFiles = getImageFiles(formData);

    const artistId = await findOrCreateArtistId(artistName);
    const albumId = await findOrCreateAlbumId(albumName);
    const token = await getAuthToken();

    if (!token) {
      return {
        ...emptyState(),
        formError: 'Vous devez etre connecte pour creer une annonce.',
      };
    }

    const payload = {
      product: {
        title,
        description,
        price,
        state,
        format,
        artist: { id: artistId },
        category: { id: categoryId },
        album: { id: albumId },
      },
    };

    const response = await fetch(API.createAd, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
        Cookie: `auth=${token}`,
      },
      body: JSON.stringify(payload),
      cache: 'no-store',
    });

    if (!response.ok) {
      const raw = await response.text();
      const fieldErrors = mapBackendFieldErrors(raw);

      if (fieldErrors) {
        return {
          fieldErrors,
          formError: '',
          successMessage: '',
        };
      }

      return {
        ...emptyState(),
        formError: extractMessage(raw) || "Erreur lors de la creation de l'annonce",
      };
    }

    const createdAd = (await response.json()) as CreatedAd;

    if (!createdAd?.productId) {
      return {
        ...emptyState(),
        formError: 'Reponse invalide du serveur : productId manquant.',
      };
    }

    if (imageFiles.length > 0) {
      try {
        await uploadImages(createdAd.productId, imageFiles, token);
      } catch (error) {
        return {
          ...emptyState(),
          successMessage:
            error instanceof Error
              ? `Annonce creee, mais l'upload des images a echoue : ${error.message}`
              : "Annonce creee, mais l'upload des images a echoue.",
        };
      }
    }

    return {
      ...emptyState(),
      successMessage:
        imageFiles.length > 0
          ? 'Annonce et images enregistrees avec succes.'
          : 'Annonce enregistree avec succes.',
    };
  } catch (error) {
    return {
      ...emptyState(),
      formError: error instanceof Error ? error.message : 'Une erreur est survenue',
    };
  }
}
