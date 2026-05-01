import type { CatalogItem } from '../types';
import Image from 'next/image';
import { Heart } from 'lucide-react';
import Button from '@/components/ui/Button/Button';
import { API } from '@/lib/env';
import styles from './CatalogView.module.css';
import Link from 'next/link';

type CatalogViewProps = {
  items: CatalogItem[];
  error?: string | null;
};

const priceFormatter = new Intl.NumberFormat('fr-FR', {
  style: 'currency',
  currency: 'EUR',
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});

export default function CatalogView({ items, error }: CatalogViewProps) {
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

        return (
          <article
            key={item.id}
            className={`${styles['catalog-card']} ${
              !coverUrl ? styles['catalog-card--no-image'] : ''
            }`}
          >
            <div className={styles['catalog-card__content']}>
              {coverUrl && (
                <div className={styles['catalog-card__media']}>
                  <div className={styles['catalog-card__cover-stack']}>
                    <div className={styles['catalog-card__vinyl']} aria-hidden="true" />
                    <Image
                      src={coverUrl}
                      alt={title}
                      width={87}
                      height={87}
                      unoptimized
                      className={styles['catalog-card__image']}
                    />
                  </div>
                </div>
              )}

              <div className={styles['catalog-card__info']}>
                <div className={styles['catalog-card__title']}>{title}</div>
                <div className={styles['catalog-card__meta']}>{artist}</div>
                <div className={styles['catalog-card__meta']}>{category}</div>
                <div className={styles['catalog-card__meta']}>{city}</div>
              </div>
            </div>

            <div className={styles['catalog-card__actions']}>
              <div className={styles['catalog-card__price']}>{price}</div>

              <div className={styles['catalog-card__cta-row']}>
                <button
                  type="button"
                  className={styles['catalog-card__favorite']}
                  aria-label={`Ajouter ${title} aux favoris`}
                >
                  <Heart size={24} strokeWidth={2.1} />
                </button>

                <Button
                  type="button"
                  variant="soft"
                  size="xs"
                  className={styles['catalog-card__detail-button']}
                >
                  {'Voir le d\u00e9tail'}
                </Button>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}
