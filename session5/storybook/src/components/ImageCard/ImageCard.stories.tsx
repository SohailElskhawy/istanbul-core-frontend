import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { ImageCard } from './ImageCard';
import { mockImages } from '../../data/images';

/**
 * An interactive image presentation card displaying the photograph, its category tag,
 * and title. Built as a native semantic button to guarantee keyboard accessibility.
 * Gracefully renders a clean fallback graphic if the image fails to load.
 */
const meta: Meta<typeof ImageCard> = {
  title: 'Components/ImageCard',
  component: ImageCard,
  tags: ['autodocs'],
  args: {
    onClick: fn(),
  },
  argTypes: {
    aspectRatio: {
      control: 'select',
      options: ['4/3', '1/1', '3/4', '16/9'],
      description: 'Force an explicit aspect ratio for the media container.',
    },
    image: {
      description: 'Gallery image entity containing src, alt, title, and category.',
    },
  },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: '360px', padding: '16px' }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    image: mockImages[0],
  },
};

export const LongTitle: Story = {
  args: {
    image: {
      id: 'img-long',
      src: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
      alt: 'Dramatic panorama of mountain ranges during a vibrant orange and violet golden sunset',
      title: 'Breathtaking High Alpine Panorama with Vast Glacial Ridges, Deep Valleys, and Radiant Sunset Clouds',
      category: 'nature',
    },
  },
};

export const PortraitImage: Story = {
  args: {
    aspectRatio: '3/4',
    image: {
      id: 'img-portrait',
      src: 'https://images.unsplash.com/photo-1535268647677-300dbf3d78d1?auto=format&fit=crop&w=800&q=80',
      alt: 'Portrait view of an orange kitten resting on a cozy knit blanket',
      title: 'Kitten in Sunlight',
      category: 'animals',
    },
  },
};

export const LandscapeImage: Story = {
  args: {
    aspectRatio: '16/9',
    image: {
      id: 'img-landscape',
      src: 'https://images.unsplash.com/photo-1477959858617-67f30bc75b82?auto=format&fit=crop&w=1200&q=80',
      alt: 'Wide panorama of modern illuminated city skyscrapers at dusk',
      title: 'Chicago Skyline from Waterfront',
      category: 'city',
    },
  },
};

export const ImageError: Story = {
  args: {
    image: {
      id: 'img-broken',
      src: 'https://invalid-domain-that-does-not-exist.example.com/broken-photo.jpg',
      alt: 'Non-existent photo resource',
      title: 'Missing Archive Photograph',
      category: 'travel',
    },
  },
};
