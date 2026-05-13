import styles from './FavoritesPage.module.css';

type EmptyStateProps = {
  message: string;
};

export default function EmptyState({ message }: EmptyStateProps) {
  return <p className={styles.emptyState}>{message}</p>;
}
