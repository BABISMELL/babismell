import { useAdmin } from '@/contexts/AdminContext';
import { Container } from '@/components/Container';
import { PageHeader } from '@/components/PageHeader';
import { ProductGrid } from '@/components/ProductGrid';
import { PerfumeCard } from '@/components/PerfumeCard';
import { Section } from '@/components/Section';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState } from 'react';

export default function Nouveautes() {
  const { products } = useAdmin();
  const [email, setEmail] = useState('');
  
  const newProducts = products.filter(product => product.isNew);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle newsletter subscription
    setEmail('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white py-6 sm:py-12">
      <Container>
        <PageHeader
          title="Nouveautés"
          description="Découvrez nos dernières fragrances et laissez-vous séduire par des parfums d'exception"
          className="mb-6 sm:mb-12"
        />

        <Section className="py-4 sm:py-8">
          {newProducts.length > 0 ? (
            <ProductGrid>
              {newProducts.map((perfume) => (
                <PerfumeCard key={perfume.id} {...perfume} />
              ))}
            </ProductGrid>
          ) : (
            <div className="text-center py-12">
              <h3 className="text-lg font-semibold mb-2">Aucune nouveauté pour le moment</h3>
              <p className="text-gray-600 mb-4">
                Revenez bientôt pour découvrir nos nouvelles fragrances
              </p>
            </div>
          )}
        </Section>

        <Section className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-12 text-center mt-8 sm:mt-12">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-xl sm:text-3xl font-bold mb-4 sm:mb-6">
              Restez informé de nos nouveautés
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground mb-6 sm:mb-8">
              Inscrivez-vous à notre newsletter pour être le premier à découvrir nos nouvelles fragrances
            </p>
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 sm:gap-4 max-w-md mx-auto">
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Votre adresse email"
                className="flex-1"
                required
              />
              <Button type="submit">
                S'inscrire
              </Button>
            </form>
          </div>
        </Section>
      </Container>
    </div>
  );
}