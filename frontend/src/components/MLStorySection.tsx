import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MLStorySectionProps {
  title: string;
  subtitle: string;
  content: string[];
  backgroundImage: string | string[];
  imagePosition?: "left" | "right";
  accentColor?: string;
  layout?: "single" | "dual" | "carousel";
}

export const MLStorySection = ({
  title,
  subtitle,
  content,
  backgroundImage,
  imagePosition = "left",
  accentColor = "primary",
  layout = "single"
}: MLStorySectionProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const sectionRef = useRef<HTMLDivElement>(null);
  
  const images = Array.isArray(backgroundImage) ? backgroundImage : [backgroundImage];
  const mainBackground = Array.isArray(backgroundImage) ? backgroundImage[0] : backgroundImage;

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
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const renderImageSection = () => {
    if (layout === "carousel") {
      return (
        <div className="relative">
          <div className="relative rounded-2xl overflow-hidden shadow-2xl hover-lift">
            <div 
              className="flex transition-transform duration-500 ease-out"
              style={{ transform: `translateX(-${currentImageIndex * 100}%)` }}
            >
              {images.map((img, index) => (
                <img
                  key={index}
                  src={img}
                  alt={`${title} ${index + 1}`}
                  className="w-full h-80 object-cover flex-shrink-0"
                />
              ))}
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
            
            {images.length > 1 && (
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
          {images.slice(0, 2).map((img, index) => (
            <div key={index} className="relative rounded-2xl overflow-hidden shadow-2xl hover-lift">
              <img
                src={img}
                alt={`${title} ${index + 1}`}
                className="w-full h-64 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
            </div>
          ))}
        </div>
      );
    }

    // Single image layout
    return (
      <div className="relative rounded-2xl overflow-hidden shadow-2xl hover-lift">
        <img
          src={images[0]}
          alt={title}
          className="w-full h-80 object-cover"
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
            imagePosition === "left" ? "lg:grid-cols-[2fr,1fr]" : "lg:grid-cols-[1fr,2fr]"
          )}>
            {/* Image section - More space for images */}
            <div className={cn(
              "relative",
              imagePosition === "right" && "lg:order-2"
            )}>
              {renderImageSection()}
            </div>

            {/* Content section - Less space for text */}
            <div className={cn(
              "space-y-6",
              imagePosition === "right" && "lg:order-1"
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