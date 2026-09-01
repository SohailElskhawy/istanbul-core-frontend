export type ImageCategory = 'nature' | 'city' | 'animals' | 'travel';

export interface GalleryImage {
  id: string;
  src: string;
  alt: string;
  title: string;
  category: ImageCategory;
}
