import type { Meta, StoryObj } from '@storybook/react-vite';
import { EmptyState } from './EmptyState';
import { Button } from '../Button/Button';

const meta: Meta<typeof EmptyState> = {
  title: 'Components/EmptyState',
  component: EmptyState,
  tags: ['autodocs'],
  argTypes: {
    title: { control: 'text' },
    description: { control: 'text' },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: 'No images found',
    description: 'Try selecting another category.',
  },
};

export const WithAction: Story = {
  args: {
    title: 'No images found',
    description: 'There are no images in this selected filter category.',
    action: <Button variant="secondary">Reset Filters</Button>,
  },
};
