import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface ProductGridProps {
  children: ReactNode;
  className?: string;
}

export function ProductGrid({ children, className }: ProductGridProps) {
  return (
    <div className={cn(
      'grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 sm:gap-4 md:gap-6',
      className
    )}>
      {children}
    </div>
  );
}