import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface StackProps {
  children: ReactNode;
  className?: string;
  spacing?: 'sm' | 'md' | 'lg';
}

export function Stack({ 
  children, 
  className,
  spacing = 'md'
}: StackProps) {
  return (
    <div className={cn(
      'flex flex-col',
      {
        'space-y-4': spacing === 'sm',
        'space-y-6': spacing === 'md',
        'space-y-8': spacing === 'lg',
      },
      className
    )}>
      {children}
    </div>
  );
}