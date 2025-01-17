import { ReactNode } from 'react';

interface PageSectionProps {
  children: ReactNode;
  className?: string;
}

export function PageSection({ children, className = '' }: PageSectionProps)Je vais ajuster la mise en page pour assurer une disposition cohérente sur tout le site. Voici les modifications nécessaires :

<boltArtifact id="fix-layout-consistency" title="Améliorer la cohérence de la mise en page">
<boltAction type="file" filePath="src/components/Layout.tsx">import { ReactNode } from 'react';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl py-8 sm:py-12">
        {children}
      </div>
    </div>
  );
}