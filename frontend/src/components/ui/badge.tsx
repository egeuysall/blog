import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'disabled:bg-neutral-700 disabled:dark:bg-neutral-300 disabled:dark:text-neutral-900 font-normal !text-small py-xs px-sm rounded-md !cursor-default',
  {
    variants: {
      variant: {
        default: 'bg-primary-700 text-neutral-100',
        destructive: 'bg-error-700 text-neutral-100',
        outline: 'border border-primary-700',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

function Badge({
  className,
  variant,
  asChild = false,
  ...props
}: React.ComponentProps<'span'> & VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : 'span';

  return (
    <Comp data-slot="badge" className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
