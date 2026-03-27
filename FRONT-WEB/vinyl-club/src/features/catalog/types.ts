export interface CatalogItem {
  id: number;
  title: string;
  artistName: string | null;
  categoryName: string | null;
  price: number | null;
  city: string | null;
  imageUrl: string | null;
}
