import { useState, useMemo } from 'react';
import type { GalleryImage, ImageCategory } from '../types/image';
import { mockImages } from '../data/images';
import { FilterButton } from '../components/FilterButton/FilterButton';
import { ImageGrid } from '../components/ImageGrid/ImageGrid';
import { ImageCard } from '../components/ImageCard/ImageCard';
import { ImageModal } from '../components/ImageModal/ImageModal';
import { EmptyState } from '../components/EmptyState/EmptyState';
import { Button } from '../components/Button/Button';
import styles from './GalleryPage.module.css';

const CATEGORIES: { label: string; value: ImageCategory | 'all' }[] = [
  { label: 'All', value: 'all' },
  { label: 'Nature', value: 'nature' },
  { label: 'City', value: 'city' },
  { label: 'Animals', value: 'animals' },
  { label: 'Travel', value: 'travel' },
];

export interface GalleryPageProps {
  initialImages?: GalleryImage[];
}

export function GalleryPage({ initialImages = mockImages }: GalleryPageProps) {
  const [selectedCategory, setSelectedCategory] = useState<ImageCategory | 'all'>('all');
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);

  // Compute category counts
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {
      all: initialImages.length,
      nature: 0,
      city: 0,
      animals: 0,
      travel: 0,
    };
    initialImages.forEach((img) => {
      if (counts[img.category] !== undefined) {
        counts[img.category] += 1;
      }
    });
    return counts;
  }, [initialImages]);

  // Filtered images
  const filteredImages = useMemo(() => {
    if (selectedCategory === 'all') {
      return initialImages;
    }
    return initialImages.filter((img) => img.category === selectedCategory);
  }, [initialImages, selectedCategory]);

  return (
    <main className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Image Gallery</h1>
        <p className={styles.subtitle}>Discover beautiful photography</p>
      </header>

      <nav className={styles.filterBar} aria-label="Category Filters">
        {CATEGORIES.map((cat) => (
          <FilterButton
            key={cat.value}
            active={selectedCategory === cat.value}
            count={categoryCounts[cat.value]}
            onClick={() => setSelectedCategory(cat.value)}
          >
            {cat.label}
          </FilterButton>
        ))}
      </nav>

      <section className={styles.gallerySection} aria-label="Photo Gallery">
        {filteredImages.length === 0 ? (
          <EmptyState
            title="No images found"
            description="Try selecting another category."
            action={
              <Button variant="secondary" onClick={() => setSelectedCategory('all')}>
                View all images
              </Button>
            }
          />
        ) : (
          <ImageGrid>
            {filteredImages.map((image) => (
              <ImageCard
                key={image.id}
                image={image}
                onClick={(img) => setSelectedImage(img)}
              />
            ))}
          </ImageGrid>
        )}
      </section>

      <ImageModal
        image={selectedImage}
        isOpen={Boolean(selectedImage)}
        onClose={() => setSelectedImage(null)}
      />
    </main>
  );
}
