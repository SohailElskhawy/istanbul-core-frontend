import { useState } from 'react';
import type { GalleryImage } from '../../types/image';
import styles from './ImageCard.module.css';

export interface ImageCardProps {
  image: GalleryImage;
  onClick?: (image: GalleryImage) => void;
  aspectRatio?: '4/3' | '1/1' | '3/4' | '16/9';
}

export function ImageCard({ image, onClick, aspectRatio }: ImageCardProps) {
  const [hasError, setHasError] = useState(false);

  const handleClick = () => {
    onClick?.(image);
  };

  return (
    <button
      type="button"
      className={styles.card}
      onClick={handleClick}
      aria-label={`View image: ${image.title}`}
    >
      <div
        className={styles.imageContainer}
        style={aspectRatio ? { aspectRatio } : undefined}
      >
        {hasError ? (
          <div className={styles.fallback} role="img" aria-label="Image unavailable">
            <svg
              className={styles.fallbackIcon}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M3 3l18 18"
              />
            </svg>
            <span>Image unavailable</span>
          </div>
        ) : (
          <img
            src={image.src}
            alt={image.alt}
            className={styles.image}
            loading="lazy"
            onError={() => setHasError(true)}
          />
        )}
      </div>

      <div className={styles.content}>
        <span className={styles.category}>{image.category}</span>
        <h3 className={styles.title}>{image.title}</h3>
      </div>
    </button>
  );
}
