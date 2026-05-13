import type { CatalogItem } from '@/features/catalog/types';

export type ProfileTab = 'profile' | 'ads';

export interface ProfileUser {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  phone: string | null;
  role: string | null;
}

export interface ProfileAddress {
  id: number | null;
  street: string;
  zipCode: string;
  city: string;
  country: string;
}

export type ProfileListing = CatalogItem;

export interface ProfilePageData {
  user: ProfileUser;
  address: ProfileAddress | null;
  ads: ProfileListing[];
}

export type ProfileFormState = {
  fieldErrors: Record<string, string>;
  formError: string;
  successMessage: string;
};

export type ProfileDeleteState = {
  formError: string;
};
