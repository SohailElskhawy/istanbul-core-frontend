import { useEffect, useRef } from 'react';
import type { GalleryImage } from '../../types/image';
import styles from './ImageModal.module.css';

export interface ImageModalProps {
  image: GalleryImage | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ImageModal({ image, isOpen, onClose }: ImageModalProps) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const previousActiveElementRef = useRef<HTMLElement | null>(null);

  // Focus restoration & Escape listener & Body scroll locking
  useEffect(() => {
    if (!isOpen || !image) {
      return;
    }

    // Save previous active element to restore focus on close
    previousActiveElementRef.current = document.activeElement as HTMLElement | null;

    // Focus close button
    const timer = setTimeout(() => {
      closeButtonRef.current?.focus();
    }, 50);

    // Lock body scroll
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    // Keydown handler (Escape and basic Focus Trap)
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key === 'Tab') {
        // Simple trap to keep focus inside modal dialog
        const modalElement = document.getElementById('gallery-image-modal');
        if (!modalElement) return;

        const focusableElements = modalElement.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusableElements.length === 0) return;

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (event.shiftKey && document.activeElement === firstElement) {
          event.preventDefault();
          lastElement.focus();
        } else if (!event.shiftKey && document.activeElement === lastElement) {
          event.preventDefault();
          firstElement.focus();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      clearTimeout(timer);
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
      previousActiveElementRef.current?.focus();
    };
  }, [isOpen, image, onClose]);

  if (!isOpen || !image) {
    return null;
  }

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className={styles.overlay}
      onClick={handleBackdropClick}
      data-testid="modal-backdrop"
    >
      <div
        id="gallery-image-modal"
        className={styles.modal}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-image-title"
        aria-describedby="modal-image-category"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          ref={closeButtonRef}
          type="button"
          className={styles.closeButton}
          onClick={onClose}
          aria-label="Close image preview"
        >
          <svg
            className={styles.closeIcon}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        <div className={styles.imageWrapper}>
          <img
            src={image.src}
            alt={image.alt}
            className={styles.image}
          />
        </div>

        <div className={styles.details}>
          <div className={styles.metaRow}>
            <span id="modal-image-category" className={styles.category}>
              {image.category}
            </span>
          </div>
          <h2 id="modal-image-title" className={styles.title}>
            {image.title}
          </h2>
        </div>
      </div>
    </div>
  );
}
