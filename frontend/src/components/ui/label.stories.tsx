import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Label } from './label';

const meta: Meta<typeof Label> = {
  component: Label,
  title: 'Components/Label',
  tags: ['autodocs'],
  args: {
    children: 'Label Text',
  },
};

export default meta;

type Story = StoryObj<typeof Label>;

export const Default: Story = {};

export const Disabled: Story = {
  render: (args) => (
    <div className="flex flex-col gap-2">
      <input id="input" disabled />
      <Label htmlFor="input" {...args} />
    </div>
  ),
  args: {
    children: 'Disabled Input Label',
  },
};
