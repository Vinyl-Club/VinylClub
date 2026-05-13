'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { API } from '@/lib/env';
import { clearAuthCookie, setStoredAuthUser } from '@/lib/auth.Server';
import {
  buildAuthHeaders,
  extractApiMessage,
  getAuthenticatedProfileContext,
  getProfileAds,
  getProfileUser,
  getUserAddresses,
} from './api';
import type { ProfileDeleteState, ProfileFormState } from './types';

function emptyFormState(): ProfileFormState {
  return {
    fieldErrors: {},
    formError: '',
    successMessage: '',
  };
}

function emptyDeleteState(): ProfileDeleteState {
  return {
    formError: '',
  };
}

function readField(formData: FormData, key: string) {
  return String(formData.get(key) ?? '').trim();
}

function validateProfileForm(formData: FormData) {
  const fieldErrors: Record<string, string> = {};
  const firstName = readField(formData, 'firstName');
  const lastName = readField(formData, 'lastName');
  const email = readField(formData, 'email');
  const password = String(formData.get('password') ?? '');

  if (!lastName) {
    fieldErrors.lastName = 'Le nom est obligatoire.';
  }

  if (!firstName) {
    fieldErrors.firstName = 'Le prenom est obligatoire.';
  }

  if (!email) {
    fieldErrors.email = "L'email est obligatoire.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    fieldErrors.email = "Le format de l'email est invalide.";
  }

  if (password.trim() && password.trim().length < 8) {
    fieldErrors.password = 'Le mot de passe doit contenir au moins 8 caracteres.';
  }

  return fieldErrors;
}

async function ensureSuccessfulResponse(response: Response, fallbackMessage: string) {
  if (response.ok) {
    return;
  }

  const raw = await response.text();
  throw new Error(extractApiMessage(raw) || fallbackMessage);
}

export async function updateProfileAction(
  _prevState: ProfileFormState,
  formData: FormData,
): Promise<ProfileFormState> {
  const fieldErrors = validateProfileForm(formData);

  if (Object.keys(fieldErrors).length > 0) {
    return {
      ...emptyFormState(),
      fieldErrors,
    };
  }

  try {
    const { token, userId } = await getAuthenticatedProfileContext();
    const currentUser = await getProfileUser(userId, token);
    const addresses = await getUserAddresses(userId, token);
    const currentAddress = addresses[0] ?? null;

    const firstName = readField(formData, 'firstName');
    const lastName = readField(formData, 'lastName');
    const email = readField(formData, 'email');
    const password = String(formData.get('password') ?? '').trim();
    const street = readField(formData, 'street');
    const zipCode = readField(formData, 'zipCode');
    const city = readField(formData, 'city');
    const country = readField(formData, 'country');

    const userPayload = {
      id: userId,
      email,
      firstName,
      lastName,
      phone: currentUser.phone,
      password: password || undefined,
    };

    const updateUserResponse = await fetch(`${API.users}/${userId}`, {
      method: 'PUT',
      headers: buildAuthHeaders(token, true),
      body: JSON.stringify(userPayload),
      cache: 'no-store',
    });

    await ensureSuccessfulResponse(
      updateUserResponse,
      'Impossible de mettre a jour votre profil.',
    );

    const hasAddressContent = [street, zipCode, city, country].some(Boolean);

    if (hasAddressContent) {
      const addressPayload = {
        id: currentAddress?.id ?? undefined,
        street,
        zipCode,
        city,
        country,
        user: {
          id: userId,
        },
      };

      const addressUrl = currentAddress?.id
        ? `${API.addresses}/${currentAddress.id}`
        : API.addresses;
      const addressMethod = currentAddress?.id ? 'PUT' : 'POST';

      const addressResponse = await fetch(addressUrl, {
        method: addressMethod,
        headers: buildAuthHeaders(token, true),
        body: JSON.stringify(addressPayload),
        cache: 'no-store',
      });

      await ensureSuccessfulResponse(
        addressResponse,
        "Impossible d'enregistrer votre adresse.",
      );
    } else if (currentAddress?.id) {
      const deleteAddressResponse = await fetch(`${API.addresses}/${currentAddress.id}`, {
        method: 'DELETE',
        headers: buildAuthHeaders(token),
        cache: 'no-store',
      });

      await ensureSuccessfulResponse(
        deleteAddressResponse,
        "Impossible de supprimer l'adresse existante.",
      );
    }

    await setStoredAuthUser({
      id: userId,
      email,
      firstName,
      lastName,
      role: currentUser.role,
    });

    revalidatePath('/profile');

    return {
      ...emptyFormState(),
      successMessage: 'Profil mis a jour avec succes.',
    };
  } catch (error) {
    return {
      ...emptyFormState(),
      formError:
        error instanceof Error
          ? error.message
          : 'Une erreur est survenue pendant la mise a jour du profil.',
    };
  }
}

export async function deleteProfileAdAction(
  _prevState: ProfileDeleteState,
  formData: FormData,
): Promise<ProfileDeleteState> {
  try {
    const { token } = await getAuthenticatedProfileContext();
    const adId = Number(formData.get('adId') ?? '');

    if (!Number.isFinite(adId) || adId <= 0) {
      return {
        formError: 'Annonce introuvable.',
      };
    }

    const response = await fetch(`${API.ad}/${adId}`, {
      method: 'DELETE',
      headers: buildAuthHeaders(token),
      cache: 'no-store',
    });

    await ensureSuccessfulResponse(response, "Impossible de supprimer l'annonce.");

    revalidatePath('/profile');
    return emptyDeleteState();
  } catch (error) {
    return {
      formError:
        error instanceof Error
          ? error.message
          : "Une erreur est survenue pendant la suppression de l'annonce.",
    };
  }
}

export async function deleteAccountAction(
  prevState: ProfileDeleteState,
  formData: FormData,
): Promise<ProfileDeleteState> {
  void prevState;
  void formData;

  try {
    const { token, userId } = await getAuthenticatedProfileContext();
    const [ads, addresses] = await Promise.all([
      getProfileAds(token),
      getUserAddresses(userId, token),
    ]);

    for (const ad of ads) {
      const deleteAdResponse = await fetch(`${API.ad}/${ad.id}`, {
        method: 'DELETE',
        headers: buildAuthHeaders(token),
        cache: 'no-store',
      });

      await ensureSuccessfulResponse(
        deleteAdResponse,
        "Impossible de supprimer une de vos annonces avant la suppression du compte.",
      );
    }

    for (const address of addresses) {
      if (!address.id) {
        continue;
      }

      const deleteAddressResponse = await fetch(`${API.addresses}/${address.id}`, {
        method: 'DELETE',
        headers: buildAuthHeaders(token),
        cache: 'no-store',
      });

      await ensureSuccessfulResponse(
        deleteAddressResponse,
        "Impossible de supprimer votre adresse avant la suppression du compte.",
      );
    }

    const deleteUserResponse = await fetch(`${API.users}/${userId}`, {
      method: 'DELETE',
      headers: buildAuthHeaders(token),
      cache: 'no-store',
    });

    await ensureSuccessfulResponse(
      deleteUserResponse,
      'Impossible de supprimer votre compte.',
    );
  } catch (error) {
    return {
      formError:
        error instanceof Error
          ? error.message
          : 'Une erreur est survenue pendant la suppression du compte.',
    };
  }

  await clearAuthCookie();
  redirect('/login');
}
