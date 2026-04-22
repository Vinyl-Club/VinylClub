import type { CatalogItem } from '../types';
import Image from 'next/image';
import { Heart } from 'lucide-react';
import Button from '@/components/ui/Button/Button';
import { API } from '@/lib/env';
import styles from './CatalogView.module.css';

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
      <div className={styles.errorState} role="status">
        <p className={styles.errorTitle}>Catalogue indisponible</p>
        <p className={styles.errorMessage}>{error}</p>
      </div>
    );
  }

  if (!items || items.length === 0) {
    return <p className={styles.emptyState}>Aucun produit pour le moment.</p>;
  }

  return (
    <div className={styles.grid}>
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
            className={`${styles.card} ${!coverUrl ? styles.cardNoImage : ''}`}
          >
            <div className={styles.content}>
              {coverUrl && (
                <div className={styles.media}>
                  <Image
                    src={coverUrl}
                    alt={title}
                    width={132}
                    height={87}
                    unoptimized
                    className={styles.image}
                  />
                </div>
              )}

              <div className={styles.info}>
                <div className={styles.title}>{title}</div>
                <div className={styles.artist}>{artist}</div>
                <div className={styles.category}>{category}</div>
                <div className={styles.city}>{city}</div>
              </div>
            </div>

            <div className={styles.actions}>
              <div className={styles.price}>{price}</div>

              <div className={styles.ctaRow}>
                <button
                  type="button"
                  className={styles.favoriteButton}
                  aria-label={`Ajouter ${title} aux favoris`}
                >
                  <Heart size={24} strokeWidth={2.1} />
                </button>

                <Button type="button" variant="soft" size="xs">
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
