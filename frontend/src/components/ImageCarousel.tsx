import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// Import sample images
import sampleImage1 from "@/assets/sample-image-1.jpg";
import sampleImage2 from "@/assets/sample-image-2.jpg";
import sampleImage3 from "@/assets/sample-image-3.jpg";
import sampleImage4 from "@/assets/sample-image-4.jpg";

const sampleImages = [
  { id: 1, src: sampleImage1, title: "Agricultural Field", description: "Crop rows with clear segmentation boundaries" },
  { id: 2, src: sampleImage2, title: "Urban Landscape", description: "Buildings, roads, and green spaces" },
  { id: 3, src: sampleImage3, title: "Coastal Area", description: "Beach, water, and vegetation zones" },
  { id: 4, src: sampleImage4, title: "Forest Area", description: "Trees, clearings, and dirt paths" },
];

interface ImageCarouselProps {
  onImageSelect: (image: { id: number; src: string; title: string }) => void;
  selectedImageId?: number;
}

export const ImageCarousel = ({ onImageSelect, selectedImageId }: ImageCarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % sampleImages.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + sampleImages.length) % sampleImages.length);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  const handleImageSelect = () => {
    const selectedImage = sampleImages[currentIndex];
    onImageSelect(selectedImage);
  };

  return (
    <div className="relative w-full max-w-4xl mx-auto">
      {/* Main carousel */}
      <div className="relative overflow-hidden rounded-2xl glass-panel">
        <div 
          className="flex transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {sampleImages.map((image, index) => (
            <div key={image.id} className="w-full flex-shrink-0 relative">
              <img
                src={image.src}
                alt={image.title}
                className="w-full h-96 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 text-white">
                <h3 className="text-2xl font-bold mb-2">{image.title}</h3>
                <p className="text-white/80">{image.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation arrows */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute left-4 top-1/2 -translate-y-1/2 glass-button text-white hover:text-primary"
          onClick={prevSlide}
        >
          <ChevronLeft className="h-6 w-6" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-4 top-1/2 -translate-y-1/2 glass-button text-white hover:text-primary"
          onClick={nextSlide}
        >
          <ChevronRight className="h-6 w-6" />
        </Button>
      </div>

      {/* Dots indicator */}
      <div className="flex justify-center mt-6 space-x-2">
        {sampleImages.map((_, index) => (
          <button
            key={index}
            className={cn(
              "w-3 h-3 rounded-full transition-all duration-300",
              index === currentIndex 
                ? "bg-primary scale-125" 
                : "bg-primary/30 hover:bg-primary/50"
            )}
            onClick={() => goToSlide(index)}
          />
        ))}
      </div>

      {/* Select button */}
      <div className="flex justify-center mt-8">
        <Button
          variant="elegant"
          size="xl"
          onClick={handleImageSelect}
          className="animate-float"
        >
          Select This Image for Segmentation
        </Button>
      </div>
    </div>
  );
};