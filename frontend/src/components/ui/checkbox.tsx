'use client';

import * as React from 'react';
import * as CheckboxPrimitive from '@radix-ui/react-checkbox';
import { CheckIcon } from 'lucide-react';

import { cn } from '@/lib/utils';

function Checkbox({ className, ...props }: React.ComponentProps<typeof CheckboxPrimitive.Root>) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn(
        'flex items-center justify-center border-neutral-300 dark:border-neutral-700 data-[state=checked]:bg-primary-700 data-[state=checked]:text-neutral-100 dark:data-[state=checked]:bg-primary-700 data-[state=checked]:border-none size-lg shrink-0 rounded-sm border shadow-3xs transition-shadow outline-none focus-visible:ring-2xs disabled:cursor-not-allowed disabled:bg-neutral-500',
        className
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        data-slot="checkbox-indicator"
        className="flex items-center justify-center text-current transition-none"
      >
        <CheckIcon className="size-lg" />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
}

export { Checkbox };
