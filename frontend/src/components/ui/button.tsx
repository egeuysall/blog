import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'transition-colors duration-200 ease-in-out disabled:bg-neutral-700 disabled:dark:bg-neutral-300 disabled:dark:text-neutral-900 font-semibold',
  {
    variants: {
      variant: {
        default: 'bg-primary-700 hover:bg-primary-900 text-neutral-100',
        destructive: 'bg-error-700 hover:bg-error-900 text-neutral-100',
        outline: 'border border-primary-700 hover:bg-primary-300 hover:dark:bg-primary-900',
        ghost: 'hover:opacity-75 transition-opacity',
      },
      size: {
        default: 'py-xs px-lg rounded-md',
        icon: 'p-sm rounded-md',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : 'button';

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
