import { getCatalog, type CatalogFilters } from '@/features/catalog/api';
import { getCurrentUserFavoriteSelection } from '@/features/favorites/api';
import { getCurrentUser } from '@/features/auth/api';
import CatalogView from '@/features/catalog/view/CatalogView';
import styles from './page.module.css';

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

  const [{ items, error }, favoriteSelection, currentUser] = await Promise.all([
    getCatalog(filters),
    getCurrentUserFavoriteSelection(),
    getCurrentUser(),
  ]);
  const greetingName =
    currentUser?.firstName?.trim() ||
    currentUser?.lastName?.trim() ||
    null;
  const pageClassName = [
    styles.page,
    !greetingName ? styles['page--guest'] : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <section className={pageClassName}>
      <div className={styles.content}>
        {greetingName ? (
          <h1 className={styles.title}>{`Bonjour : ${greetingName} !`}</h1>
        ) : null}

        <div className={styles.catalogWrap}>
          <CatalogView
            items={items}
            error={error}
            favoriteProductIds={favoriteSelection.productIds}
            isAuthenticated={favoriteSelection.isAuthenticated}
          />
        </div>
      </div>
    </section>
  );
}
