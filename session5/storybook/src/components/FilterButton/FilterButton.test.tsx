import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FilterButton } from './FilterButton';

describe('FilterButton', () => {
  it('renders label and inactive aria-pressed state', () => {
    render(<FilterButton active={false}>Nature</FilterButton>);
    const button = screen.getByRole('button', { name: 'Nature' });
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute('aria-pressed', 'false');
  });

  it('renders active state correctly with aria-pressed="true" and active class', () => {
    render(<FilterButton active={true}>City</FilterButton>);
    const button = screen.getByRole('button', { name: 'City' });
    expect(button).toHaveAttribute('aria-pressed', 'true');
    expect(button.className).toContain('active');
  });

  it('displays count badge when count is provided', () => {
    render(
      <FilterButton active={false} count={5}>
        Animals
      </FilterButton>
    );
    expect(screen.getByText('5')).toBeInTheDocument();
  });

  it('handles click callback', async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();
    render(
      <FilterButton active={false} onClick={handleClick}>
        Travel
      </FilterButton>
    );

    await user.click(screen.getByRole('button', { name: 'Travel' }));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('does not fire click when disabled', async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();
    render(
      <FilterButton active={false} disabled onClick={handleClick}>
        Disabled
      </FilterButton>
    );

    const button = screen.getByRole('button', { name: 'Disabled' });
    await user.click(button);
    expect(handleClick).not.toHaveBeenCalled();
  });
});
