import { catalog } from '@/features/catalog/api';
import CatalogView from '@/features/catalog/view/CatalogView';

export default async function Page() {
  const items = await catalog();   // appel à ton backend
  return <CatalogView items={items} />; // affichage
}