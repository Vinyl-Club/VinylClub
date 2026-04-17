export interface CatalogItem {
  id: number;
  title: string;
  artistName: string | null;
  categoryName: string | null;
  price: number | null;
  city: string | null;
  imageUrl: string | null;
}

export interface CatalogDetails {
  id: number;
  product: Product;
  user: User;
}

export interface Product {
  id: number;
  title: string;
  description: string;
  price: number | null;
  status: ProductStatus;
  state: ProductState;
  format: ProductFormat;
  artist: Artist;
  category: Category;
  album: Album;
  images: ProductImage[];
  createdAt: string;
  updatedAt: string;
}

export type ProductStatus =
  | 'AVAILABLE'
  | 'OUT_OF_STOCK';

export type ProductState =
  | 'TRES_BON_ETAT'
  | 'BON_ETAT'
  | 'MAUVAIS_ETAT';

export type ProductFormat =
  | 'T33'
  | 'T45'
  | 'T78';

export interface Artist {
  id: number;
  name: string;
}

export interface Category {
  id: number;
  name: string;
}

export interface Album {
  id: number;
  name: string;
}

export interface ProductImage {
  id: number;
  productId: number | null;
  imageUrl: string;
}

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  address: Address;
}

export interface Address {
  id: number | null;
  city: string;
}
