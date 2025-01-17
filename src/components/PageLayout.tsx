import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface PageLayoutProps {
  children: ReactNode;
  className?: string;
  sidebar?: ReactNode;
}

export function PageLayout({ children, className, sidebar }: PageLayoutProps) {
  return (
    <div className={cn('flex-1', className)}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl py-8 sm:py-12">
        {sidebar ? (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <aside className="md:col-span-1">
              {sidebar}
            </aside>
            <main className="md:col-span-3">
              {children}
            </main>
          </div>
        ) : (
          <main>{children}</main>
        )}
      </div>
    </div>
  );
}