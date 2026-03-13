import type { Product } from '../types';
import Image from 'next/image';
import styles from './CatalogView.module.css';

export default function CatalogView({ items }: { items: Product[] }) {
  if (!items || items.length === 0) {
    return <p>Aucun produit pour le moment.</p>;
  }

  return (
    <div className={styles.grid}>
      {items.map((p) => {
        console.log("PRODUCT:", p);
        console.log("IMAGES:", p.images);

        const coverUrl =
          p.images && p.images.length > 0
            ? p.images[0]?.imageUrl
            : null;

        return (
          <div key={p.id} className={styles.card}>
            <div className={styles.left}>
              {coverUrl && (
                <Image
                  src={coverUrl}
                  alt={p.title}
                  width={110}
                  height={110}
                  className={styles.image}
                />
              )}

              <div className={styles.info}>
                <div className={styles.title}>{p.title}</div>
              </div>
            </div>

            <div className={styles.right}>
              <div className={styles.price}>{p.price} €</div>
              <button className={styles.button}>
                Voir le détail
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}