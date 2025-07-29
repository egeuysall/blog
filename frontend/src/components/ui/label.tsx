'use client';

import * as React from 'react';
import * as LabelPrimitive from '@radix-ui/react-label';

import { cn } from '@/lib/utils';

function Label({ className, ...props }: React.ComponentProps<typeof LabelPrimitive.Root>) {
  return (
    <LabelPrimitive.Root
      data-slot="label"
      className={cn(
        'flex items-center gap-sm text-small font-semibold select-none peer-disabled:cursor-not-allowed peer-disabled:text-neutral-700 peer-disabled:dark:text-neutral-300 ',
        className
      )}
      {...props}
    />
  );
}

export { Label };
