import { getCatalog } from '@/features/catalog/api';
import CatalogView from '@/features/catalog/view/CatalogView';

export default async function Page() {
  const { items, error } = await getCatalog();

  return <CatalogView items={items} error={error} />;
}
