'use client';

import * as React from 'react';
import * as SwitchPrimitive from '@radix-ui/react-switch';

import { cn } from '@/lib/utils';

function Switch({ className, ...props }: React.ComponentProps<typeof SwitchPrimitive.Root>) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      className={cn(
        'peer inline-flex h-5 w-10 shrink-0 cursor-pointer items-center rounded-full border border-transparent bg-neutral-300 px-[2px] shadow-3xs transition-colors outline-none data-[state=checked]:bg-primary-700 data-[state=unchecked]:dark:bg-neutral-700 focus-visible:ring-2 disabled:cursor-not-allowed disabled:opacity-75',
        className
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className={cn(
          'pointer-events-none block h-4 w-4 rounded-full bg-neutral-100 ring-0 transition-transform data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0'
        )}
      />
    </SwitchPrimitive.Root>
  );
}

export { Switch };
