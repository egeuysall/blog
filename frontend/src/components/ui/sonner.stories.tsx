'use client';

import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Button } from '@/components/ui/button';
import { Toaster } from './sonner';
import { toast } from 'sonner';

const meta: Meta<typeof Toaster> = {
  title: 'Components/Toaster',
  component: Toaster,
  parameters: {
    layout: 'centered',
  },
};

export default meta;

type Story = StoryObj<typeof Toaster>;

export const Default: Story = {
  render: () => (
    <>
      <Button onClick={() => toast('This is a toast!')}>Show Toast</Button>
      <Toaster />
    </>
  ),
};
