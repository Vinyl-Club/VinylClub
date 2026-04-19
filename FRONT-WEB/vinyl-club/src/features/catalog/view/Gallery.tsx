'use client';

import { useState } from 'react';
import Image from 'next/image';
import styles from './ListingDetails.module.css';
import type { ProductImage } from '../types';

type Props = {
  images: ProductImage[];
  title: string;
};

export default function Gallery({ images, title }: Props) {
  const [selectedImage, setSelectedImage] = useState(images[0]?.imageUrl);

  return (
    <div className={styles.imageSection}>
      {images.length > 0 && selectedImage ? (
        <>
          <Image
            src={selectedImage}
            alt={title}
            width={420}
            height={420}
            className={styles.mainImage}
          />

          {images.length > 1 && (
            <div className={styles.thumbnailList}>
              {images.map((img) => (
                <Image
                  key={img.id}
                  src={img.imageUrl}
                  alt={title}
                  width={90}
                  height={90}
                  className={styles.thumbnail}
                  onClick={() => setSelectedImage(img.imageUrl)}
                />
              ))}
            </div>
          )}
        </>
      ) : (
        <div className={styles.imagePlaceholder}>Aucune image</div>
      )}
    </div>
  );
}