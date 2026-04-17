import styles from './ListingDetails.module.css';
import { catalogDetails } from '../api';

type Props = {
  id: string;
};

export default async function ListingDetails({ id }: Props) {
  const listing = await catalogDetails(id);

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>{listing.product.title}</h1>
    </div>
  );
}