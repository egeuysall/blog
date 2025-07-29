import * as React from 'react';
import { cn } from '@/lib/utils';

function Input({ className, type, ...props }: React.ComponentProps<'input'>) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        'file:text-neutral-700 file:dark:text-neutral-300 placeholder:text-neutral-500 flex h-9 w-full min-w-0 rounded-md border bg-transparent border-neutral-300 dark:border-neutral-700 px-md py-lg !text-small shadow-3xs transition-[border-color,box-shadow,border-width] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-small file:font-semibold disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50',
        'focus-visible:border-ring ring-primary-700 focus-visible:ring-ring/50 focus-visible:ring-[2px]',
        'invalid:border-[2px] invalid:border-error-700 invalid:focus-visible:ring-error-700',
        className
      )}
      {...props}
    />
  );
}

export { Input };
