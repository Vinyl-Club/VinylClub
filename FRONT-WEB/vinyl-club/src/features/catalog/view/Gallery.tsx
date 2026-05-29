'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import styles from './ListingDetails.module.css';
import type { ProductImage } from '../types';

type Props = {
  images: ProductImage[];
  title: string;
};

export default function Gallery({ images, title }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const selectedImage = images[currentIndex]?.imageUrl;

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'ArrowRight') {
        setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
      }

      if (event.key === 'ArrowLeft') {
        setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
      }
    }

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [images.length]);

  return (
    <div className={styles['listing-details__gallery']}>
      {images.length > 0 && selectedImage ? (
        <>
          <Image
            src={selectedImage}
            alt={title}
            width={420}
            height={420}
            className={styles['listing-details__main-image']}
          />

          {images.length > 1 && (
            <div className={styles['listing-details__thumbnail-list']}>
              {images.map((img, index) => (
                <Image
                  key={img.id}
                  src={img.imageUrl}
                  alt={title}
                  width={90}
                  height={90}
                  className={[
                    styles['listing-details__thumbnail'],
                    currentIndex === index ? styles['listing-details__thumbnail--active'] : '',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                  onClick={() => setCurrentIndex(index)}
                />
              ))}
            </div>
          )}
        </>
      ) : (
        <div className={styles['listing-details__image-placeholder']}>Aucune image</div>
      )}
    </div>
  );
}
