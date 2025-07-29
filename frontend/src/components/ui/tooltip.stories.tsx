'use client';

import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Button } from './button';

import { Tooltip, TooltipTrigger, TooltipContent } from './tooltip';

const meta: Meta<typeof Tooltip> = {
  title: 'Components/Tooltip',
  component: Tooltip,
  parameters: {
    layout: 'centered',
  },
};

export default meta;

type Story = StoryObj<typeof Tooltip>;

export const Default: Story = {
  render: () => (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button>Hover me</Button>
      </TooltipTrigger>
      <TooltipContent>Tooltip content goes here</TooltipContent>
    </Tooltip>
  ),
};
