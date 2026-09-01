import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { EmptyState } from './EmptyState';
import { Button } from '../Button/Button';

describe('EmptyState', () => {
  it('renders default title and description', () => {
    render(<EmptyState />);
    expect(screen.getByText('No images found')).toBeInTheDocument();
    expect(
      screen.getByText('Try selecting another category or check back later.')
    ).toBeInTheDocument();
  });

  it('renders custom title, description, and action button', () => {
    render(
      <EmptyState
        title="Custom Empty Title"
        description="Custom description text"
        action={<Button>Reset</Button>}
      />
    );
    expect(screen.getByText('Custom Empty Title')).toBeInTheDocument();
    expect(screen.getByText('Custom description text')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Reset' })).toBeInTheDocument();
  });
});
