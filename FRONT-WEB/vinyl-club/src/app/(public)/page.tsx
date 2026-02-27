import { catalog } from '@/features/catalog/api';
import CatalogView from '@/features/catalog/view/CatalogView';

export default async function Page() {
  const items = await catalog();

  return (
    <>
      <h1 style={{ fontSize: '40px', marginBottom: '30px' }}>
        BONJOUR TEST
      </h1>

      <CatalogView items={items} />
    </>
  );
}