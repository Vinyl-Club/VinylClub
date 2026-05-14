'use client'

import type { CatalogItem } from '../types';
import Image from 'next/image';
import Button from '@/components/ui/Button/Button';
import { API } from '@/lib/env';
import FavoriteToggleButton from '@/features/favorites/view/FavoriteToggleButton';
import styles from './CatalogView.module.css';
import Link from 'next/link';


type CatalogViewProps = {
  items: CatalogItem[];
  error?: string | null;
  favoriteProductIds?: number[];
  isAuthenticated?: boolean;
};

const priceFormatter = new Intl.NumberFormat('fr-FR', {
  style: 'currency',
  currency: 'EUR',
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});

export default function CatalogView({
  items,
  error,
  favoriteProductIds = [],
  isAuthenticated = false,
}: CatalogViewProps) {
  const favoriteIds = new Set(favoriteProductIds);
  
  if (error) {
    return (
      <div className={styles.catalog__error} role="status">
        <p className={styles['catalog__error-title']}>Catalogue indisponible</p>
        <p className={styles['catalog__error-message']}>{error}</p>
      </div>
    );
  }

  if (!items || items.length === 0) {
    return <p className={styles.catalog__empty}>Aucun produit pour le moment.</p>;
  }

  return (
    <div className={styles.catalog__grid}>
      {items.map((item) => {
        const coverUrl = item.imageUrl
          ? item.imageUrl.startsWith('http')
            ? item.imageUrl
            : `${API.base}${item.imageUrl}`
          : null;
        const title = item.title?.trim() || "Titre de l'annonce";
        const artist = item.artistName?.trim() || "Nom de l'artiste";
        const category = item.categoryName?.trim() || 'Style de musique';
        const city = item.city?.trim() || 'Localisation';
        const price =
          typeof item.price === 'number'
            ? priceFormatter.format(item.price)
            : 'Prix \u20AC';
        const initialIsFavorite =
          typeof item.productId === 'number' && favoriteIds.has(item.productId);

        return (
          <article key={item.id} className={styles['catalog-card']}>
            <h2 className={styles['catalog-card__title']}>{title}</h2>

            <div className={styles['catalog-card__body']}>
              <div className={styles['catalog-card__media']}>
                <div className={styles['catalog-card__cover-stack']}>
                  {coverUrl ? (
                    <Image
                      src={coverUrl}
                      alt={title}
                      width={132}
                      height={87}
                      unoptimized
                      className={styles['catalog-card__image']}
                    />
                  ) : (
                    <div className={styles['catalog-card__fallback']} aria-hidden="true" />
                  )}
                </div>
              </div>

              <div className={styles['catalog-card__info']}>
                <div className={styles['catalog-card__artist']}>{artist}</div>
                <div className={styles['catalog-card__category']}>{category}</div>
                <div className={styles['catalog-card__city']}>{city}</div>
              </div>
            </div>

            <div className={styles['catalog-card__actions']}>
              <div className={styles['catalog-card__price']}>{price}</div>

              <div className={styles['catalog-card__favorite-shell']}>
                <FavoriteToggleButton
                  productId={item.productId}
                  title={title}
                  initialIsFavorite={initialIsFavorite}
                  isAuthenticated={isAuthenticated}
                  className={styles['catalog-card__favorite']}
                />
              </div>

              <Link
                href={`/details/${item.id}`}
                className={styles['catalog-card__detail-link']}
              >
                <Button
                  type="button"
                  variant="soft"
                  size="xs"
                  className={styles['catalog-card__detail-button']}
                >
                  {'Voir le d\u00e9tail'}
                </Button>
              </Link>
            </div>
          </article>
        );
      })}
    </div>
  );
}
