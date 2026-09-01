import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { Button } from './Button';

/**
 * Reusable action button supporting multiple visual variants, disabled states,
 * and keyboard accessibility.
 */
const meta: Meta<typeof Button> = {
  title: 'Components/Button',
  component: Button,
  tags: ['autodocs'],
  args: {
    onClick: fn(),
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'danger'],
      description: 'Visual style hierarchy for the button.',
      table: {
        defaultValue: { summary: 'primary' },
      },
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the button is interactive.',
      table: {
        defaultValue: { summary: 'false' },
      },
    },
    children: {
      control: 'text',
      description: 'Content to display within the button.',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    variant: 'primary',
    children: 'Primary Action',
  },
};

export const Secondary: Story = {
  args: {
    variant: 'secondary',
    children: 'Secondary Action',
  },
};

export const Danger: Story = {
  args: {
    variant: 'danger',
    children: 'Delete Photo',
  },
};

export const Disabled: Story = {
  args: {
    variant: 'primary',
    disabled: true,
    children: 'Unavailable',
  },
};

export const LongText: Story = {
  args: {
    variant: 'secondary',
    children: 'Click here to discover all fine art photographs in high resolution',
  },
};
