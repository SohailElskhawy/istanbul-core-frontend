import type { Meta, StoryObj } from '@storybook/react-vite';
import { ImageGrid } from './ImageGrid';
import { ImageCard } from '../ImageCard/ImageCard';
import { mockImages } from '../../data/images';

/**
 * Responsive CSS Grid container for gallery cards.
 * Automatically organizes items into 1 column on mobile, 2 columns on tablet,
 * and 3 to 4 columns on desktop and wide displays.
 */
const meta: Meta<typeof ImageGrid> = {
  title: 'Components/ImageGrid',
  component: ImageGrid,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const SingleImage: Story = {
  render: () => (
    <ImageGrid>
      <ImageCard image={mockImages[0]} />
    </ImageGrid>
  ),
};

export const ThreeImages: Story = {
  render: () => (
    <ImageGrid>
      {mockImages.slice(0, 3).map((img) => (
        <ImageCard key={img.id} image={img} />
      ))}
    </ImageGrid>
  ),
};

export const ManyImages: Story = {
  render: () => (
    <ImageGrid>
      {mockImages.map((img) => (
        <ImageCard key={img.id} image={img} />
      ))}
    </ImageGrid>
  ),
};

export const Empty: Story = {
  render: () => (
    <ImageGrid>
      <div
        style={{
          gridColumn: '1 / -1',
          padding: '48px',
          textAlign: 'center',
          color: 'var(--color-text-muted)',
          backgroundColor: 'var(--color-surface)',
          border: '1px dashed var(--color-border)',
          borderRadius: 'var(--radius-lg)',
        }}
      >
        No grid elements provided
      </div>
    </ImageGrid>
  ),
};
