export type State = {
  fieldErrors: Record<string, string>;
  formError: string;
  successMessage: string;
};

export type Category = {
  id: number;
  name: string;
};

export type Artist = {
  id: number;
  name: string;
};

export type Album = {
  id: number;
  name: string;
};

export type CreatedAd = {
  id: number;
  productId: number;
  userId: number;
};
