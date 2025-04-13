import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import minimalTheme from '../assets/minimal-theme.svg';

interface Slide {
  image?: string; // Making this optional to allow using our minimal theme
  title: string;
  description: string;
}

interface FitnessSliderProps {
  slides: Slide[];
  autoPlayInterval?: number; // in milliseconds
  showControls?: boolean;
}

export function FitnessSlider({ 
  slides, 
  autoPlayInterval = 5000,
  showControls = true
}: FitnessSliderProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  useEffect(() => {
    if (!isPlaying) return;
    
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, autoPlayInterval);
    
    return () => clearInterval(interval);
  }, [isPlaying, slides.length, autoPlayInterval]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    setIsPlaying(false);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    setIsPlaying(false);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
    setIsPlaying(false);
  };

  return (
    <div className="fitness-slider relative overflow-hidden rounded-lg">
      {slides.map((slide, index) => (
        <div 
          key={index} 
          className={`slide ${index === currentSlide ? 'active' : ''}`}
          style={{
            backgroundImage: `url(${minimalTheme})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          <div className="absolute inset-0 flex flex-col justify-center items-center p-6 md:p-8 text-center">
            <h3 className="text-xl md:text-2xl font-bold text-primary-dark mb-3">{slide.title}</h3>
            <p className="text-sm md:text-base text-dark-text max-w-md">{slide.description}</p>
          </div>
        </div>
      ))}
      
      {showControls && (
        <>
          <Button 
            variant="ghost" 
            size="icon" 
            className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-white/80 text-primary-dark hover:bg-white hover:text-primary rounded-full shadow-sm"
            onClick={prevSlide}
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          
          <Button 
            variant="ghost" 
            size="icon" 
            className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-white/80 text-primary-dark hover:bg-white hover:text-primary rounded-full shadow-sm"
            onClick={nextSlide}
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
          
          <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex gap-1.5">
            {slides.map((_, index) => (
              <button
                key={index}
                className={`h-2 rounded-full transition-all ${
                  index === currentSlide ? 'bg-primary w-6' : 'bg-primary/30 w-2'
                }`}
                onClick={() => goToSlide(index)}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}