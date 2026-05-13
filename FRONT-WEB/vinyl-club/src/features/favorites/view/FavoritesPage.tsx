import Image from 'next/image';
import Link from 'next/link';
import { Heart } from 'lucide-react';
import { API } from '@/lib/env';
import { removeFavoriteAction } from '../actions.server';
import type { FavoritesPageData } from '../types';
import EmptyState from './EmptyState';
import styles from './FavoritesPage.module.css';

type FavoritesPageProps = {
  pageData: FavoritesPageData;
};

const priceFormatter = new Intl.NumberFormat('fr-FR', {
  style: 'currency',
  currency: 'EUR',
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});

function resolveCoverUrl(imageUrl: string | null) {
  if (!imageUrl) {
    return null;
  }

  return imageUrl.startsWith('http') ? imageUrl : `${API.base}${imageUrl}`;
}

export default function FavoritesPage({ pageData }: FavoritesPageProps) {
  return (
    <section className={styles.favorites}>
      <div className={styles.favorites__inner}>
        <h1 className={styles.favorites__title}>Mes favoris ({pageData.count})</h1>

        {pageData.error ? (
          <div className={styles.errorBox} role="status">
            <p className={styles.errorBox__title}>Favoris indisponibles</p>
            <p className={styles.errorBox__message}>{pageData.error}</p>
          </div>
        ) : pageData.items.length === 0 ? (
          <EmptyState message="Vous n'avez aucune annonce de favorite" />
        ) : (
          <div className={styles.favoritesList}>
            {pageData.items.map((item) => {
              const coverUrl = resolveCoverUrl(item.imageUrl);
              const title = item.title?.trim() || "Titre de l'annonce";
              const artist = item.artistName?.trim() || "Nom de l'artiste";
              const category = item.categoryName?.trim() || 'Style de musique';
              const city = item.city?.trim() || 'Localisation';
              const price =
                typeof item.price === 'number' ? priceFormatter.format(item.price) : 'Prix EUR';

              return (
                <article key={`${item.id}-${item.productId ?? 'favorite'}`} className={styles.card}>
                  <div className={styles.card__media}>
                    <div className={styles.card__coverStack}>
                      {coverUrl ? (
                        <Image
                          src={coverUrl}
                          alt={title}
                          width={96}
                          height={96}
                          unoptimized
                          className={styles.card__image}
                        />
                      ) : (
                        <div className={styles.card__fallback} aria-hidden="true" />
                      )}
                      <div className={styles.card__vinyl} aria-hidden="true" />
                    </div>
                  </div>

                  <div className={styles.card__content}>
                    <div className={styles.card__details}>
                      <h2 className={styles.card__title}>{title}</h2>
                      <div className={styles.card__metaGroup}>
                        <p className={styles.card__meta}>{artist}</p>
                        <p className={styles.card__meta}>{category}</p>
                        <p className={styles.card__meta}>{city}</p>
                      </div>
                    </div>

                    <div className={styles.card__actions}>
                      <p className={styles.card__price}>{price}</p>

                      <div className={styles.card__ctaRow}>
                        {typeof item.productId === 'number' && (
                          <form action={removeFavoriteAction}>
                            <input type="hidden" name="productId" value={item.productId} />
                            <button
                              type="submit"
                              className={styles.card__favoriteButton}
                              aria-label={`Retirer ${title} des favoris`}
                              title="Retirer des favoris"
                            >
                              <Heart size={18} strokeWidth={2} fill="currentColor" />
                            </button>
                          </form>
                        )}

                        <Link href={`/details/${item.id}`} className={styles.card__detailLink}>
                          Voir le detail
                        </Link>
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
