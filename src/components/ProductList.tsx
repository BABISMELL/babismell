import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface ProductListProps {
  children: ReactNode;
  className?: string;
}

export function ProductList({ children, className }: ProductListProps) {
  return (
    <div className={cn(
      'grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6',
      className
    )}>
      {children}
    </div>
  );
}