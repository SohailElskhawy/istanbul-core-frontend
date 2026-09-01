import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { ImageModal } from './ImageModal';
import { mockImages } from '../../data/images';

const meta: Meta<typeof ImageModal> = {
  title: 'Components/ImageModal',
  component: ImageModal,
  tags: ['autodocs'],
  args: {
    isOpen: true,
    onClose: fn(),
  },
  argTypes: {
    isOpen: {
      control: 'boolean',
      description: 'Controls modal open state.',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    image: mockImages[0],
    isOpen: true,
  },
};

export const PortraitImage: Story = {
  args: {
    image: {
      id: 'img-portrait',
      src: 'https://images.unsplash.com/photo-1535268647677-300dbf3d78d1?auto=format&fit=crop&w=800&q=80',
      alt: 'Portrait view of an orange kitten',
      title: 'Curious Whisker Portrait',
      category: 'animals',
    },
    isOpen: true,
  },
};

export const LandscapeImage: Story = {
  args: {
    image: mockImages[1],
    isOpen: true,
  },
};

export const LongTitle: Story = {
  args: {
    image: {
      id: 'img-long',
      src: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
      alt: 'Dramatic panorama of mountain ranges during a vibrant orange and violet golden sunset',
      title: 'Breathtaking High Alpine Panorama with Vast Glacial Ridges, Deep Valleys, and Radiant Sunset Clouds Over the Horizon',
      category: 'nature',
    },
    isOpen: true,
  },
};
