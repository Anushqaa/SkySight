import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// Import sample images
import sampleImage0 from "@/assets/images/image_0.png";
import sampleImage1 from "@/assets/images/image_1.png";
import sampleImage2 from "@/assets/images/image_2.png";
import sampleImage3 from "@/assets/images/image_3.png";
import sampleImage4 from "@/assets/images/image_4.png";
import sampleImage5 from "@/assets/images/image_5.png";
import sampleImage6 from "@/assets/images/image_6.png";
import sampleImage7 from "@/assets/images/image_7.png";
import sampleImage8 from "@/assets/images/image_8.png";
import sampleImage9 from "@/assets/images/image_9.png";
import sampleImage10 from "@/assets/images/image_10.png";
import sampleImage11 from "@/assets/images/image_11.png";

const sampleImages = [
  { id: 0, src: sampleImage0, title: "Roads", description: "You can see me cycling" },
  { id: 1, src: sampleImage1, title: "Roads again", description: "The red car, yeah" },
  { id: 2, src: sampleImage2, title: "Yard", description: "Peculiar shape" },
  { id: 3, src: sampleImage3, title: "Ground", description: "Trees, clearings, and dirt paths" },
  { id: 4, src: sampleImage4, title: "Roads still", description: "Humans have made a dense concrete jungle" },
  { id: 5, src: sampleImage5, title: "Yard", description: "Speak of the devil, what a lovely pair" },
  { id: 6, src: sampleImage6, title: "Yard", description: "Thats my grandma, nu-uh" },
  { id: 7, src: sampleImage7, title: "Yard", description: "Or a road, whatever" },
  { id: 8, src: sampleImage8, title: "Ground", description: "Whats that in red, I wonder?" },
  { id: 9, src: sampleImage9, title: "Ground", description: "I wanted to say graveyard" },
  { id: 10, src: sampleImage10, title: "Ground", description: "Only because I hate roads" },
  { id: 11, src: sampleImage11, title: "Yard", description: "A kid cycling, free of any tethers" },
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