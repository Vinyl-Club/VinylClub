import type { CatalogItem } from '../types';
import Image from 'next/image';
import { API } from '@/lib/env';
import styles from './CatalogView.module.css';

export default function CatalogView({ items }: { items: CatalogItem[] }) {
  if (!items || items.length === 0) {
    return <p>Aucun produit pour le moment.</p>;
  }

  return (
    <div className={styles.grid}>
      {items.map((item) => {
        const coverUrl = item.imageUrl
          ? item.imageUrl.startsWith('http')
            ? item.imageUrl
            : `${API.base}${item.imageUrl}`
          : null;

        return (
          <div key={item.id} className={styles.card}>
            <div className={styles.left}>
              {coverUrl && (
                <Image
                  src={coverUrl}
                  alt={item.title}
                  width={110}
                  height={110}
                  unoptimized
                  className={styles.image}
                />
              )}

              <div className={styles.info}>
                <div className={styles.title}>{item.title}</div>
                {item.artistName && <div>{item.artistName}</div>}
                {item.categoryName && <div>{item.categoryName}</div>}
                <div>{item.city || 'Ville inconnue'}</div>
              </div>
            </div>

            <div className={styles.right}>
              <div className={styles.price}>{item.price ?? 0} €</div>
              <button className={styles.button}>Voir le détail</button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
