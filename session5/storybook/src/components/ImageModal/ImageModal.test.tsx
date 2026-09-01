import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ImageModal } from './ImageModal';
import type { GalleryImage } from '../../types/image';

const mockImage: GalleryImage = {
  id: 'modal-test-1',
  src: 'https://example.com/lake.jpg',
  alt: 'Alpine Lake',
  title: 'Serene Alpine Waters',
  category: 'nature',
};

describe('ImageModal', () => {
  it('renders selected image, category, and title when open', () => {
    render(<ImageModal image={mockImage} isOpen={true} onClose={vi.fn()} />);

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Serene Alpine Waters')).toBeInTheDocument();
    expect(screen.getByText('nature')).toBeInTheDocument();
    expect(screen.getByRole('img', { name: 'Alpine Lake' })).toHaveAttribute(
      'src',
      'https://example.com/lake.jpg'
    );
  });

  it('does not render when isOpen is false', () => {
    render(<ImageModal image={mockImage} isOpen={false} onClose={vi.fn()} />);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', async () => {
    const user = userEvent.setup();
    const handleClose = vi.fn();
    render(<ImageModal image={mockImage} isOpen={true} onClose={handleClose} />);

    const closeBtn = screen.getByRole('button', { name: /close image preview/i });
    await user.click(closeBtn);

    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when Escape key is pressed', async () => {
    const user = userEvent.setup();
    const handleClose = vi.fn();
    render(<ImageModal image={mockImage} isOpen={true} onClose={handleClose} />);

    await user.keyboard('{Escape}');
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when clicking backdrop overlay', async () => {
    const user = userEvent.setup();
    const handleClose = vi.fn();
    render(<ImageModal image={mockImage} isOpen={true} onClose={handleClose} />);

    const backdrop = screen.getByTestId('modal-backdrop');
    await user.click(backdrop);

    expect(handleClose).toHaveBeenCalledTimes(1);
  });
});
