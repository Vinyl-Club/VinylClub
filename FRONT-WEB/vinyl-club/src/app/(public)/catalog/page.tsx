import { catalog } from '@/features/catalog/api';
import CatalogView from '@/features/catalog/view/CatalogView';

export default async function Page() {
  const items = await catalog();

  return <CatalogView items={items} />;
}
