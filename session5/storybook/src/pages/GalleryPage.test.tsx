import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { GalleryPage } from './GalleryPage';
import type { GalleryImage } from '../types/image';

const testImages: GalleryImage[] = [
  {
    id: 'test-1',
    src: 'https://example.com/nature1.jpg',
    alt: 'Green Forest',
    title: 'Green Forest Mountain',
    category: 'nature',
  },
  {
    id: 'test-2',
    src: 'https://example.com/city1.jpg',
    alt: 'Tokyo Tower',
    title: 'Tokyo Tower at Night',
    category: 'city',
  },
];

describe('GalleryPage', () => {
  it('renders page title, subtitle, and all initial images', () => {
    render(<GalleryPage initialImages={testImages} />);

    expect(screen.getByRole('heading', { level: 1, name: 'Image Gallery' })).toBeInTheDocument();
    expect(screen.getByText('Discover beautiful photography')).toBeInTheDocument();
    expect(screen.getByText('Green Forest Mountain')).toBeInTheDocument();
    expect(screen.getByText('Tokyo Tower at Night')).toBeInTheDocument();
  });

  it('filters gallery images when category filter button is clicked', async () => {
    const user = userEvent.setup();
    render(<GalleryPage initialImages={testImages} />);

    // Click Nature filter
    const natureFilter = screen.getByRole('button', { name: /nature/i });
    await user.click(natureFilter);

    expect(screen.getByText('Green Forest Mountain')).toBeInTheDocument();
    expect(screen.queryByText('Tokyo Tower at Night')).not.toBeInTheDocument();

    // Click City filter
    const cityFilter = screen.getByRole('button', { name: /city/i });
    await user.click(cityFilter);

    expect(screen.queryByText('Green Forest Mountain')).not.toBeInTheDocument();
    expect(screen.getByText('Tokyo Tower at Night')).toBeInTheDocument();
  });

  it('shows empty state when selecting an empty category and allows resetting', async () => {
    const user = userEvent.setup();
    render(<GalleryPage initialImages={testImages} />);

    // Animals has 0 items in testImages
    const animalsFilter = screen.getByRole('button', { name: /animals/i });
    await user.click(animalsFilter);

    expect(screen.getByText('No images found')).toBeInTheDocument();
    expect(screen.getByText('Try selecting another category.')).toBeInTheDocument();

    // Click view all images reset button
    const viewAllBtn = screen.getByRole('button', { name: /view all images/i });
    await user.click(viewAllBtn);

    expect(screen.getByText('Green Forest Mountain')).toBeInTheDocument();
    expect(screen.getByText('Tokyo Tower at Night')).toBeInTheDocument();
  });

  it('opens preview modal when an image card is clicked and closes it on Escape', async () => {
    const user = userEvent.setup();
    render(<GalleryPage initialImages={testImages} />);

    const cardButton = screen.getByRole('button', {
      name: /View image: Green Forest Mountain/i,
    });
    await user.click(cardButton);

    // Modal dialog should now be open
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2, name: 'Green Forest Mountain' })).toBeInTheDocument();

    // Press Escape to close
    await user.keyboard('{Escape}');
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
});
