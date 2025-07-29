import { cn } from '@/lib/utils';

function Skeleton({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="skeleton"
      className={cn('bg-neutral-300 dark:bg-neutral-700 animate-pulse rounded-full', className)}
      {...props}
    />
  );
}

export { Skeleton };
