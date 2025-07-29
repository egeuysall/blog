'use client';

import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Skeleton } from '@/components/ui/skeleton';

const meta: Meta<typeof Skeleton> = {
  title: 'Components/Skeleton',
  component: Skeleton,
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof Skeleton>;

export const ComplexCard: Story = {
  render: () => (
    <div className="w-80 space-y-4">
      {/* Avatar */}
      <Skeleton className="h-12 w-12" />

      {/* Title */}
      <Skeleton className="h-6 w-3/4" />

      {/* Subtitle */}
      <Skeleton className="h-4 w-1/2" />

      {/* Content lines */}
      <div className="space-y-2">
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-5/6" />
      </div>

      {/* Button placeholder */}
      <Skeleton className="h-10 w-24" />
    </div>
  ),
};
