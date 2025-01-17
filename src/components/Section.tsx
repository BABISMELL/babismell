import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface SectionProps {
  children: ReactNode;
  className?: string;
}

export function Section({ children, className }: SectionProps) {
  return (
    <div className={cn("py-6 sm:py-8 md:py-12 lg:py-16", className)}>
      {children}
    </div>
  );
}