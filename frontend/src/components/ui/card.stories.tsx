import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import * as React from 'react';

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardAction,
  CardFooter,
} from './card';
import { Button } from '@/components/ui/button';

const meta: Meta<typeof Card> = {
  title: 'Components/Card',
  component: Card,
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof Card>;

export const Default: Story = {
  render: () => (
    <Card>
      <CardHeader>
        <CardTitle>Billing</CardTitle>
        <CardDescription>Manage your billing information and view invoices.</CardDescription>
        <CardAction>
          <Button variant="outline">Manage</Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <p className="text-sm leading-relaxed text-muted-foreground">
          You are currently on the Pro plan. Your next payment will be on Aug 1, 2025.
        </p>
      </CardContent>
      <CardFooter className="justify-end">
        <Button variant="default">Upgrade Plan</Button>
      </CardFooter>
    </Card>
  ),
};
