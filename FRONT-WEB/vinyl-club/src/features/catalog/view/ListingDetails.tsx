import styles from './ListingDetails.module.css';
import { catalogDetails } from '../api';
import Button from '@/components/ui/Button/Button';
import Gallery from './Gallery';
import { getCurrentUserFavoriteSelection } from '@/features/favorites/api';
import FavoriteToggleButton from '@/features/favorites/view/FavoriteToggleButton';

const stateLabels: Record<string, string> = {
  TRES_BON_ETAT: 'Tres bon etat',
  BON_ETAT: 'Bon etat',
  MAUVAIS_ETAT: 'Mauvais etat',
};

const formatLabels: Record<string, string> = {
  T33: '33 Tours',
  T45: '45 Tours',
  T78: '78 Tours',
};

const priceFormatter = new Intl.NumberFormat('fr-FR', {
  style: 'currency',
  currency: 'EUR',
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});

type Props = {
  id: string;
};

export default async function ListingDetails({ id }: Props) {
  const [listing, favoriteSelection] = await Promise.all([
    catalogDetails(id),
    getCurrentUserFavoriteSelection(),
  ]);
  const city = listing.user.address?.city?.trim() || 'Localisation';
  const productId = listing.product.id;
  const isFavorite = favoriteSelection.productIds.includes(productId);
  const price =
    typeof listing.product.price === 'number'
      ? priceFormatter.format(listing.product.price)
      : 'Prix EUR';

  return (
    <div className={styles['listing-details']}>
      <h1 className={styles['listing-details__title']}>{listing.product.title}</h1>

      <div className={styles['listing-details__card']}>
        <div className={styles['listing-details__content']}>
          <Gallery images={listing.product.images} title={listing.product.title} />

          <div className={styles['listing-details__info']}>
            <div className={styles['listing-details__summary']}>
              <div className={styles['listing-details__row']}>
                <p className={styles['listing-details__seller-name']}>
                  {listing.user.firstName} {listing.user.lastName}
                </p>
                <div className={styles['listing-details__price']}>{price}</div>
              </div>

              <div className={styles['listing-details__row']}>
                <p className={styles['listing-details__city']}>{city}</p>
                <p className={styles['listing-details__state']}>
                  {stateLabels[listing.product.state]}
                </p>
              </div>

              <p className={styles['listing-details__date']}>
                {new Date(listing.product.createdAt).toLocaleDateString()}
              </p>
            </div>

            <div className={styles['listing-details__details']}>
              <p className={styles['listing-details__artist-album']}>
                {listing.product.artist.name} / {listing.product.album.name}
              </p>

              <div className={styles['listing-details__description']}>
                <p className={styles['listing-details__description-label']}>Description :</p>
                <p className={styles['listing-details__description-text']}>
                  {listing.product.description}
                </p>
              </div>

              <p className={styles['listing-details__category']}>
                {listing.product.category.name}
              </p>
              <p className={styles['listing-details__format']}>
                {formatLabels[listing.product.format]}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className={styles['listing-details__actions']}>
        <FavoriteToggleButton
          productId={productId}
          title={listing.product.title}
          initialIsFavorite={isFavorite}
          isAuthenticated={favoriteSelection.isAuthenticated}
          variant="button"
          className={styles['listing-details__favorite-button']}
        />

        <Button type="button" variant="primary" fullWidth={false} isLoading={false}>
          Acheter
        </Button>
      </div>
    </div>
  );
}
