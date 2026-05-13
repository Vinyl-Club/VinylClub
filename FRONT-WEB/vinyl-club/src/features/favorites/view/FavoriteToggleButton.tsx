'use client';

import { Heart } from 'lucide-react';
import { useFavorites } from '../useFavorites';
import styles from './FavoriteToggleButton.module.css';

type FavoriteToggleButtonProps = {
  productId: number | null | undefined;
  title: string;
  initialIsFavorite: boolean;
  isAuthenticated: boolean;
  variant?: 'icon' | 'button';
  className?: string;
};

export default function FavoriteToggleButton({
  productId,
  title,
  initialIsFavorite,
  isAuthenticated,
  variant = 'icon',
  className = '',
}: FavoriteToggleButtonProps) {
  const { isFavorite, isPending, error, toggleFavorite } = useFavorites({
    productId,
    initialIsFavorite,
    isAuthenticated,
  });

  const isButtonVariant = variant === 'button';
  const label = isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris';

  return (
    <div className={styles['favorite-toggle']}>
      <button
        type="button"
        onClick={toggleFavorite}
        disabled={isPending}
        aria-pressed={isFavorite}
        aria-label={`${label} : ${title}`}
        title={label}
        className={[
          styles['favorite-toggle__button'],
          isButtonVariant
            ? styles['favorite-toggle__button--action']
            : styles['favorite-toggle__button--icon'],
          isFavorite ? styles['favorite-toggle__button--active'] : '',
          isPending ? styles['favorite-toggle__button--pending'] : '',
          className,
        ]
          .filter(Boolean)
          .join(' ')}
      >
        <Heart
          size={isButtonVariant ? 18 : 24}
          strokeWidth={2.1}
          fill={isFavorite ? 'currentColor' : 'none'}
        />
        {isButtonVariant ? <span className={styles['favorite-toggle__label']}>{label}</span> : null}
      </button>

      {error ? <p className={styles['favorite-toggle__error']}>{error}</p> : null}
    </div>
  );
}
