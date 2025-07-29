import * as React from 'react';

import { cn } from '@/lib/utils';

function Textarea({ className, ...props }: React.ComponentProps<'textarea'>) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        'flex field-sizing-content min-h-16 placeholder:text-neutral-500 w-full rounded-md border bg-transparent border-neutral-300 dark:border-neutral-700 px-md py-sm !text-small shadow-3xs transition-[color,box-shadow] outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 focus-visible:border-ring ring-primary-700 focus-visible:ring-ring/50 focus-visible:ring-[2px]',
        className
      )}
      {...props}
    />
  );
}

export { Textarea };
