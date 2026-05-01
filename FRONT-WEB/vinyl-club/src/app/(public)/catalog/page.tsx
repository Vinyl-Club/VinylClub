import { getCatalog, type CatalogFilters } from '@/features/catalog/api';
import CatalogView from '@/features/catalog/view/CatalogView';

type CatalogPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

function getParam(
  params: Record<string, string | string[] | undefined>,
  key: keyof CatalogFilters,
) {
  const value = params[key];
  return Array.isArray(value) ? value[0] : value;
}

export default async function Page({ searchParams }: CatalogPageProps) {
  const params = searchParams ? await searchParams : {};
  const filters: CatalogFilters = {
    q: getParam(params, 'q'),
    genre: getParam(params, 'genre'),
    state: getParam(params, 'state'),
    format: getParam(params, 'format'),
    minPrice: getParam(params, 'minPrice'),
    maxPrice: getParam(params, 'maxPrice'),
  };

  const { items, error } = await getCatalog(filters);

  return <CatalogView items={items} error={error} />;
}
