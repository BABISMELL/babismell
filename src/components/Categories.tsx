import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CategoriesProps {
  onDiscoverClick: () => void;
}

const categories = [
  {
    title: 'Pour Elle',
    description: 'Des fragrances délicates et envoûtantes',
    image: 'https://images.unsplash.com/photo-1615634260167-c8cdede054de?q=80&w=2070',
    gradient: 'from-pink-500/50 to-purple-500/50'
  },
  {
    title: 'Pour Lui',
    description: 'Des parfums au caractère unique',
    image: 'https://images.unsplash.com/photo-1595425970377-c9703cf48b6d?q=80&w=2070',
    gradient: 'from-blue-500/50 to-indigo-500/50'
  },
  {
    title: 'Unisexe',
    description: 'Des créations sans frontières',
    image: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?q=80&w=2070',
    gradient: 'from-violet-500/50 to-fuchsia-500/50'
  }
];

export function Categories({ onDiscoverClick }: CategoriesProps) {
  return (
    <section className="w-full py-8 sm:py-12 md:py-24 bg-gray-50">
      <div className="container px-4 md:px-6">
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8 sm:mb-12 animate-on-scroll">
          Nos Collections
        </h2>
        <div className="grid gap-4 sm:gap-6 md:grid-cols-3">
          {categories.map((category, index) => (
            <div
              key={category.title}
              className="group relative overflow-hidden rounded-2xl h-[250px] sm:h-[300px] md:h-[400px] animate-on-scroll"
              style={{animationDelay: `${index * 200}ms`}}
            >
              <div className={`absolute inset-0 bg-gradient-to-b ${category.gradient} transition-opacity group-hover:opacity-70`} />
              <img
                alt={`Collection ${category.title}`}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                src={category.image}
              />
              <div className="absolute inset-0 flex flex-col justify-end p-4 sm:p-6 text-white">
                <h3 className="text-xl sm:text-2xl font-bold transform transition-transform group-hover:-translate-y-2">
                  {category.title}
                </h3>
                <p className="text-sm sm:text-base/relaxed opacity-0 transform translate-y-4 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0 mb-2 sm:mb-4">
                  {category.description}
                </p>
                <Button 
                  variant="outline" 
                  className="w-full text-white border-white hover:bg-white hover:text-gray-900 transition-colors text-sm sm:text-base py-2"
                  onClick={onDiscoverClick}
                >
                  Découvrir <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}