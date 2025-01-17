import { useNavigate } from 'react-router-dom';
import { Section } from '@/components/Section';
import { HeroCarousel } from '@/components/HeroCarousel';
import { Categories } from '@/components/Categories';
import { FeaturedProducts } from '@/components/FeaturedProducts';
import { Shield, Truck, Sparkles } from "lucide-react";

export default function Home() {
  const navigate = useNavigate();
  const handleDiscoverClick = () => navigate('/parfums');

  return (
    <>
      {/* Hero Section */}
      <HeroCarousel onDiscoverClick={handleDiscoverClick} />

      {/* Categories Section */}
      <Section>
        <Categories onDiscoverClick={handleDiscoverClick} />
      </Section>

      {/* Features Section */}
      <Section className="bg-purple-50">
        <div className="container mx-auto px-4">
          <div className="grid gap-12 md:grid-cols-3">
            {[
              { icon: Shield, title: "Authenticité Garantie", description: "Tous nos parfums sont authentiques et certifiés" },
              { icon: Truck, title: "Livraison Rapide", description: "Livraison express disponible en Côte d'Ivoire" },
              { icon: Sparkles, title: "Qualité Premium", description: "Une sélection des meilleures fragrances" }
            ].map(({ icon: Icon, title, description }, index) => (
              <div key={title} className="flex flex-col items-center text-center space-y-2">
                <div className="rounded-full bg-purple-100 p-3">
                  <Icon className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold">{title}</h3>
                <p className="text-sm text-muted-foreground">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* Featured Products Section */}
      <Section>
        <FeaturedProducts onDiscoverClick={handleDiscoverClick} />
      </Section>
    </>
  );
}