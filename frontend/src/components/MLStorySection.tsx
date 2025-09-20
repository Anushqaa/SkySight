import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MLStorySectionProps {
  title: string;
  subtitle: string;
  content: string[];
  // backgroundImage is used only for the section background (string or array)
  backgroundImage: string | string[];
  // slideImages are the images shown inside the image/card area (carousel/dual/single)
  slideImages?: string[];
  imagePosition?: "left" | "right";
  accentColor?: string;
  layout?: "single" | "dual" | "carousel";
}

export const MLStorySection = ({
  title,
  subtitle,
  content,
  backgroundImage,
  slideImages = [],
  imagePosition = "left",
  accentColor = "primary",
  layout = "single"
}: MLStorySectionProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const sectionRef = useRef<HTMLDivElement>(null);
  
  // background(s) remain sourced from backgroundImage prop
  const imagesFromBackground = Array.isArray(backgroundImage) ? backgroundImage : [backgroundImage];
  const mainBackground = Array.isArray(backgroundImage) ? backgroundImage[0] : backgroundImage;

  // slides used for the image/card area — prefer explicit slideImages, fall back to background images
  const slides = (slideImages && slideImages.length > 0) ? slideImages : imagesFromBackground;

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % slides.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const renderImageSection = () => {
    if (layout === "carousel") {
      return (
        <div className="relative">
          {/* Carousel container: centered & constrained */}
          <div className="w-auto max-w-3xl mx-auto rounded-2xl overflow-hidden shadow-2xl hover-lift relative">
            <div 
              className="flex transition-transform duration-500 ease-out"
              style={{ transform: `translateX(-${currentImageIndex * 100}%)` }}
            >
              {slides.map((img, index) => (
                <div key={index} className="w-full h-80 flex items-center justify-center flex-shrink-0 bg-transparent">
                  <img
                    src={img}
                    alt={`${title} ${index + 1}`}
                    className="max-w-full max-h-full object-contain"
                  />
                </div>
              ))}
            </div>

            {/* overlay gradient */}
            <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/50 via-transparent to-transparent" />
            
            {slides.length > 1 && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute left-4 top-1/2 -translate-y-1/2 glass-button text-white hover:text-primary"
                  onClick={prevImage}
                >
                  <ChevronLeft className="h-5 w-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-4 top-1/2 -translate-y-1/2 glass-button text-white hover:text-primary"
                  onClick={nextImage}
                >
                  <ChevronRight className="h-5 w-5" />
                </Button>
              </>
            )}
          </div>
        </div>
      );
    }

    if (layout === "dual") {
      return (
        <div className="space-y-4">
          {slides.slice(0, 2).map((img, index) => (
            <div key={index} className="relative rounded-2xl overflow-hidden shadow-2xl hover-lift h-64 flex items-center justify-center">
              <img
                src={img}
                alt={`${title} ${index + 1}`}
                className="max-w-full max-h-full object-contain"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
            </div>
          ))}
        </div>
      );
    }

    // Single image layout
    return (
      <div className="relative rounded-2xl overflow-hidden shadow-2xl hover-lift h-80 flex items-center justify-center">
        <img
          src={slides[0]}
          alt={title}
          className="max-w-full max-h-full object-contain"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
      </div>
    );
  };

  return (
    <div
      ref={sectionRef}
      className="relative min-h-screen flex items-center justify-center py-20 overflow-hidden"
      style={{
        backgroundImage: `url(${mainBackground})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      }}
    >
      {/* Background overlay */}
      <div className="absolute inset-0 bg-black/40" />
      
      {/* Content container */}
      <div className="relative z-10 max-w-6xl mx-auto px-6">
        <div className={cn(
          "glass-panel p-12 transition-all duration-1000",
          isVisible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-8 scale-95"
        )}>
          <div className={cn(
            "grid gap-12 items-start",
            layout === "carousel"
              ? "lg:grid-cols-1 text-center" // stack vertically & center carousel above text
              : imagePosition === "left"
                ? "lg:grid-cols-[2fr,1fr]"
                : "lg:grid-cols-[1fr,2fr]"
          )}>
            {/* Image section */}
            <div className={cn(
              "relative",
              layout === "carousel" && "flex items-center justify-center",
              imagePosition === "right" && "lg:order-2"
            )}>
              {renderImageSection()}
            </div>

            {/* Content section */}
            <div className={cn(
              "space-y-6",
              imagePosition === "right" && "lg:order-1",
              layout === "carousel" && "max-w-3xl mx-auto text-left"
            )}>
              <div className="space-y-4">
                <div className={cn(
                  "inline-block px-4 py-2 rounded-full text-sm font-medium animate-float",
                  accentColor === "primary" ? "bg-primary/20 text-primary" : "bg-secondary/20 text-secondary-foreground"
                )}>
                  {subtitle}
                </div>
                <h2 className={cn(
                  "text-3xl lg:text-4xl font-bold leading-tight transition-all duration-700",
                  isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-4"
                )}>
                  {title}
                </h2>
              </div>

              <div className="space-y-4">
                {content.map((paragraph, index) => (
                  <p
                    key={index}
                    className={cn(
                      "text-base leading-relaxed text-muted-foreground transition-all duration-700 hover:text-foreground",
                      isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                    )}
                    style={{ transitionDelay: `${index * 200}ms` }}
                  >
                    {paragraph}
                  </p>
                ))}
              </div>

              {/* Decorative element with pulse animation */}
              <div className="flex space-x-2 pt-4">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className={cn(
                      "w-12 h-1 rounded-full transition-all duration-500 animate-pulse",
                      accentColor === "primary" ? "bg-primary" : "bg-secondary",
                      isVisible ? "scale-x-100" : "scale-x-0"
                    )}
                    style={{ 
                      transitionDelay: `${800 + i * 100}ms`,
                      animationDelay: `${i * 500}ms`
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
