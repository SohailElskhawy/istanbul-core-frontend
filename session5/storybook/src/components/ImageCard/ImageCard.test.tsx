import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ImageCard } from './ImageCard';
import type { GalleryImage } from '../../types/image';

const mockImage: GalleryImage = {
  id: 'test-1',
  src: 'https://example.com/test.jpg',
  alt: 'Test mountain lake',
  title: 'Test Mountain Lake Title',
  category: 'nature',
};

describe('ImageCard', () => {
  it('renders title, category, and image attributes correctly', () => {
    render(<ImageCard image={mockImage} />);

    expect(screen.getByText('Test Mountain Lake Title')).toBeInTheDocument();
    expect(screen.getByText('nature')).toBeInTheDocument();

    const img = screen.getByRole('img', { name: 'Test mountain lake' });
    expect(img).toHaveAttribute('src', 'https://example.com/test.jpg');
  });

  it('triggers onClick callback with image data when clicked', async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();
    render(<ImageCard image={mockImage} onClick={handleClick} />);

    const cardButton = screen.getByRole('button', {
      name: /View image: Test Mountain Lake Title/i,
    });
    await user.click(cardButton);

    expect(handleClick).toHaveBeenCalledTimes(1);
    expect(handleClick).toHaveBeenCalledWith(mockImage);
  });

  it('triggers onClick callback via keyboard Enter key', async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();
    render(<ImageCard image={mockImage} onClick={handleClick} />);

    const cardButton = screen.getByRole('button', {
      name: /View image: Test Mountain Lake Title/i,
    });
    cardButton.focus();
    await user.keyboard('{Enter}');

    expect(handleClick).toHaveBeenCalledTimes(1);
    expect(handleClick).toHaveBeenCalledWith(mockImage);
  });

  it('renders fallback state gracefully when image fails to load', () => {
    render(<ImageCard image={mockImage} />);

    const img = screen.getByRole('img', { name: 'Test mountain lake' });
    fireEvent.error(img);

    expect(screen.getByText('Image unavailable')).toBeInTheDocument();
    expect(screen.queryByRole('img', { name: 'Test mountain lake' })).not.toBeInTheDocument();
  });
});
