'use client';

import Image from 'next/image';
import { Heart } from 'lucide-react';
import { useState } from 'react';
import Button from '@/components/ui/Button/Button';
import type { CatalogItem } from '@/features/catalog/types';
import { API } from '@/lib/env';
import styles from './ProfilPage.module.css';

type ProfilPageProps = {
  greeting: string;
  items: CatalogItem[];
  catalogError?: string | null;
};

const priceFormatter = new Intl.NumberFormat('fr-FR', {
  style: 'currency',
  currency: 'EUR',
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});

function resolveCoverUrl(imageUrl: string | null) {
  if (!imageUrl) return null;

  return imageUrl.startsWith('http') ? imageUrl : `${API.base}${imageUrl}`;
}

export default function ProfilPage({ greeting, items, catalogError }: ProfilPageProps) {
  const [favoriteIds, setFavoriteIds] = useState<number[]>([]);

  const toggleFavorite = (id: number) => {
    setFavoriteIds((current) =>
      current.includes(id) ? current.filter((itemId) => itemId !== id) : [...current, id]
    );
  };

  return (
    <section className={styles.profile}>
      <div className={styles.profile__inner}>
        <h1 className={styles.profile__title}>{greeting}</h1>

        {catalogError ? (
          <div className={styles.profile__error} role="status">
            <p className={styles['profile__error-title']}>Catalogue indisponible</p>
            <p className={styles['profile__error-message']}>{catalogError}</p>
          </div>
        ) : items.length === 0 ? (
          <p className={styles.profile__empty}>Aucun vinyle pour le moment.</p>
        ) : (
          <div className={styles.profile__grid}>
            {items.map((item) => {
              const coverUrl = resolveCoverUrl(item.imageUrl);
              const title = item.title?.trim() || "Titre de l'annonce";
              const artist = item.artistName?.trim() || "Nom de l'artiste";
              const category = item.categoryName?.trim() || 'Style de musique';
              const city = item.city?.trim() || 'Localisation';
              const isFavorite = favoriteIds.includes(item.id);
              const price =
                typeof item.price === 'number'
                  ? priceFormatter.format(item.price)
                  : 'Prix EUR';

              return (
                <article key={item.id} className={styles.card}>
                  <div className={styles.card__main}>
                    <div className={styles.card__media}>
                      {coverUrl ? (
                        <div className={styles['card__cover-stack']}>
                          <div className={styles.card__vinyl} aria-hidden="true" />
                          <Image
                            src={coverUrl}
                            alt={title}
                            width={87}
                            height={87}
                            unoptimized
                            className={styles.card__image}
                          />
                        </div>
                      ) : (
                        <div className={styles.card__placeholder} aria-hidden="true" />
                      )}
                    </div>

                    <div className={styles.card__body}>
                      <div className={styles.card__details}>
                        <p className={styles.card__title}>{title}</p>
                        <p className={styles.card__meta}>{artist}</p>
                        <p className={styles.card__meta}>{category}</p>
                        <p className={styles.card__meta}>{city}</p>
                      </div>

                      <p className={styles.card__price}>{price}</p>

                      <div className={styles.card__actions}>
                        <button
                          type="button"
                          className={`${styles.card__favorite} ${
                            isFavorite ? styles['card__favorite--active'] : ''
                          }`}
                          aria-label={`Ajouter ${title} aux favoris`}
                          aria-pressed={isFavorite}
                          onClick={() => toggleFavorite(item.id)}
                        >
                          <Heart
                            size={24}
                            strokeWidth={2.1}
                            fill={isFavorite ? 'currentColor' : 'none'}
                          />
                        </button>

                        <Button
                          type="button"
                          variant="soft"
                          size="xs"
                          className={styles['card__detail-button']}
                        >
                          Voir le detail
                        </Button>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
