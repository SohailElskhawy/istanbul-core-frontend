import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { FilterButton } from './FilterButton';

/**
 * Filter pill button for category navigation in the image gallery.
 * Indicates active selection through both color, border weight, indicator dot,
 * and the `aria-pressed` accessibility attribute.
 */
const meta: Meta<typeof FilterButton> = {
  title: 'Components/FilterButton',
  component: FilterButton,
  tags: ['autodocs'],
  args: {
    onClick: fn(),
  },
  argTypes: {
    active: {
      control: 'boolean',
      description: 'Whether this category filter is currently active.',
      table: {
        defaultValue: { summary: 'false' },
      },
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the filter button is disabled.',
      table: {
        defaultValue: { summary: 'false' },
      },
    },
    children: {
      control: 'text',
      description: 'Category label text.',
    },
    count: {
      control: 'number',
      description: 'Optional count of items in this category.',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    active: false,
    children: 'Nature',
  },
};

export const Active: Story = {
  args: {
    active: true,
    children: 'All',
  },
};

export const WithCount: Story = {
  args: {
    active: true,
    children: 'Travel',
    count: 12,
  },
};

export const Disabled: Story = {
  args: {
    active: false,
    disabled: true,
    children: 'Archived',
    count: 0,
  },
};
