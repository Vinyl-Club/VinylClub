import styles from './ListingDetails.module.css';
import { catalogDetails } from '../api';
import Button from '@/components/ui/Button/Button';
import Gallery from './Gallery';

const stateLabels: Record<string, string> = {
  TRES_BON_ETAT: 'Très bon état',
  BON_ETAT: 'Bon état',
  MAUVAIS_ETAT: 'Mauvais état',
};

const formatLabels: Record<string, string> = {
  T33: '33 Tours',
  T45: '45 Tours',
  T78: '78 Tours',
};

type Props = {
  id: string;
};

export default async function ListingDetails({ id }: Props) {
  const listing = await catalogDetails(id);

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>{listing.product.title}</h1>

      <div className={styles.containerCard}>
        <div className={styles.contentGrid}>
          <Gallery
            images={listing.product.images}
            title={listing.product.title}
          />

          <div className={styles.infoSection}>
            <div className={styles.infoBlock1}>
              <div className={styles.rowBetween}>
                <p className={styles.sellerName}>
                  {listing.user.firstName} {listing.user.lastName}
                </p>
                <div className={styles.priceBlock}>
                  {listing.product.price} €
                </div>
              </div>

              <div className={styles.rowBetween}>
                <p className={styles.city}>{listing.user.address.city}</p>
                <p className={styles.state}>
                  {stateLabels[listing.product.state]}
                </p>
              </div>

              <p className={styles.date}>
                {new Date(listing.product.createdAt).toLocaleDateString()}
              </p>
            </div>

            <div className={styles.infoBlock2}>
              <p className={styles.artistAlbum}>
                {listing.product.artist.name} / {listing.product.album.name}
              </p>

              <div className={styles.descriptionBlock}>
                <p className={styles.label}>Description :</p>
                <p className={styles.descriptionText}>
                  {listing.product.description}
                </p>
              </div>

              <p className={styles.category}>{listing.product.category.name}</p>
              <p className={styles.format}>
                {formatLabels[listing.product.format]}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.containerNav}>
        <Button type="button" variant="primary" fullWidth={false} isLoading={false}>
          Ajouter aux favoris
        </Button>

        <Button type="button" variant="primary" fullWidth={false} isLoading={false}>
          Acheter
        </Button>
      </div>
    </div>
  );
}