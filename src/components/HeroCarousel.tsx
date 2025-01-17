import { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Play, Pause } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAdmin } from '@/contexts/AdminContext';
import { HeroSlide } from '@/types';
import { motion, AnimatePresence } from 'framer-motion';

interface HeroCarouselProps {
  onDiscoverClick: () => void;
}

export function HeroCarousel({ onDiscoverClick }: HeroCarouselProps) {
  const { heroSlides } = useAdmin();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const activeSlides = heroSlides.filter(slide => slide.active).sort((a, b) => a.order - b.order);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (activeSlides.length === 0) return;
    if (!isPlaying) return;

    const currentMedia = activeSlides[currentSlide];
    if (currentMedia.mediaType === 'video' && videoRef.current) {
      videoRef.current.play();
      return;
    }

    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % activeSlides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [activeSlides.length, currentSlide, isPlaying]);

  const nextSlide = () => {
    if (videoRef.current) {
      videoRef.current.pause();
    }
    setCurrentSlide((prev) => (prev + 1) % activeSlides.length);
  };

  const prevSlide = () => {
    if (videoRef.current) {
      videoRef.current.pause();
    }
    setCurrentSlide((prev) => (prev - 1 + activeSlides.length) % activeSlides.length);
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
    }
  };

  if (activeSlides.length === 0) {
    return null;
  }

  return (
    <div className="relative h-[600px] w-full overflow-hidden">
      <AnimatePresence mode="wait">
        {activeSlides.map((slide, index) => (
          <motion.div
            key={slide.id}
            initial={{ opacity: 0 }}
            animate={{ 
              opacity: index === currentSlide ? 1 : 0,
              transition: { duration: 0.5 }
            }}
            exit={{ opacity: 0 }}
            className={`absolute inset-0 ${index === currentSlide ? 'z-10' : 'z-0'}`}
          >
            <div className="absolute inset-0 bg-black/40 z-20" />
            
            {slide.mediaType === 'video' ? (
              <video
                ref={videoRef}
                src={slide.mediaUrl}
                className="h-full w-full object-cover"
                loop
                muted
                playsInline
                onEnded={() => nextSlide()}
              />
            ) : (
              <img
                src={slide.mediaUrl}
                alt={slide.title}
                className="h-full w-full object-cover"
              />
            )}

            <div className="absolute inset-0 z-30 flex flex-col items-center justify-center text-white">
              <motion.h2 
                className="text-5xl font-bold mb-4 text-center"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                {slide.title}
              </motion.h2>
              <motion.p 
                className="text-xl mb-8 text-center max-w-2xl"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                {slide.description}
              </motion.p>
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                <Button 
                  className="bg-white text-purple-600 hover:bg-white/90"
                  onClick={onDiscoverClick}
                >
                  {slide.buttonText}
                </Button>
              </motion.div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      {activeSlides.length > 1 && (
        <>
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20 z-40"
            onClick={prevSlide}
          >
            <ChevronLeft className="h-8 w-8" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20 z-40"
            onClick={nextSlide}
          >
            <ChevronRight className="h-8 w-8" />
          </Button>
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-4 z-40">
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/20"
              onClick={togglePlayPause}
            >
              {isPlaying ? (
                <Pause className="h-6 w-6" />
              ) : (
                <Play className="h-6 w-6" />
              )}
            </Button>
            <div className="flex gap-2">
              {activeSlides.map((_, index) => (
                <button
                  key={index}
                  className={`h-2 w-2 rounded-full transition-all ${
                    index === currentSlide ? 'bg-white w-4' : 'bg-white/50'
                  }`}
                  onClick={() => setCurrentSlide(index)}
                />
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}