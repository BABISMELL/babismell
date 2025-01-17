import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface GridProps {
  children: ReactNode;
  className?: string;
  cols?: 1 | 2 | 3 | 4;
  gap?: 'sm' | 'md' | 'lg';
}

export function Grid({ 
  children, 
  className,
  cols = 1,
  gap = 'md'
}: GridProps) {
  return (
    <div className={cn(
      'grid',
      {
        'grid-cols-1': cols === 1,
        'grid-cols-1 sm:grid-cols-2': cols === 2,
        'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3': cols === 3,
        'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4': cols === 4,
        'gap-4': gap === 'sm',
        'gap-6': gap === 'md',
        'gap-8': gap === 'lg',
      },
      className
    )}>
      {children}
    </div>
  );
}