import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Alert, AlertTitle, AlertDescription } from './alert';

const meta = {
  title: 'Components/Alert',
  component: Alert,
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['default', 'destructive'],
    },
  },
  args: {
    variant: 'default',
    className: '',
  },
} satisfies Meta<typeof Alert>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: ({ variant }) => {
    const title = 'Default Alert Title';
    const description = 'This is the alert description.';
    return (
      <Alert variant={variant} className="">
        <AlertTitle>{title}</AlertTitle>
        <AlertDescription>{description}</AlertDescription>
      </Alert>
    );
  },
};

export const Destructive: Story = {
  render: ({ variant }) => {
    const title = 'Default Alert Title';
    const description = 'This is the alert description.';
    return (
      <Alert variant={variant}>
        <AlertTitle>{title}</AlertTitle>
        <AlertDescription>{description}</AlertDescription>
      </Alert>
    );
  },
};
