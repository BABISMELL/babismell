import { HeroSlide } from '@/types';

export function validateHeroSlide(slide: HeroSlide): boolean {
  return (
    !!slide.title &&
    !!slide.description &&
    !!slide.mediaUrl &&
    !!slide.buttonText &&
    !!slide.buttonLink &&
    typeof slide.order === 'number' &&
    typeof slide.active === 'boolean'
  );
}

export function getDefaultHeroSlides(): HeroSlide[] {
  return [
    {
      id: '1',
      title: "Floral Elegance",
      description: "Découvrez la délicatesse des parfums floraux",
      mediaType: 'image',
      mediaUrl: "https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?q=80&w=2070",
      buttonText: "Découvrir",
      buttonLink: "/parfums",
      order: 0,
      active: true
    },
    {
      id: '2',
      title: "Oriental Mystique",
      description: "Laissez-vous envoûter par nos fragrances orientales",
      mediaType: 'image',
      mediaUrl: "https://images.unsplash.com/photo-1615634260167-c8cdede054de?q=80&w=2070",
      buttonText: "Explorer",
      buttonLink: "/parfums",
      order: 1,
      active: true
    }
  ];
}