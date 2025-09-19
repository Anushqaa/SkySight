import { useState } from "react";
import { ImageCarousel } from "@/components/ImageCarousel";
import { SegmentationInterface } from "@/components/SegmentationInterface";
import { MLStorySection } from "@/components/MLStorySection";

// Import background images
import heroBackground from "@/assets/hero-background.jpg";
import storyBackground1 from "@/assets/story-background-1.jpg";
import storyBackground2 from "@/assets/story-background-2.jpg";
import storyBackground3 from "@/assets/story-background-3.jpg";

interface SelectedImage {
  id: number;
  src: string;
  title: string;
}

const Index = () => {
  const [selectedImage, setSelectedImage] = useState<SelectedImage | null>(null);

  const handleImageSelect = (image: SelectedImage) => {
    setSelectedImage(image);
  };

  const handleBack = () => {
    setSelectedImage(null);
  };

  const storyContent = {
    section1: {
      title: "The Vision Behind Drone Intelligence",
      subtitle: "AI-Powered Analysis",
      content: [
        "Our cutting-edge drone image segmentation technology revolutionizes how we understand and analyze aerial imagery. By combining the power of artificial intelligence with advanced computer vision, we unlock insights that were previously impossible to obtain.",
        "Each pixel tells a story. Our sophisticated algorithms can distinguish between vegetation, soil, water bodies, infrastructure, and countless other features with remarkable precision. This level of detail enables applications ranging from precision agriculture to urban planning and environmental monitoring.",
        "The journey from raw aerial footage to actionable intelligence happens in seconds, transforming vast landscapes into comprehensible, analyzable data that drives better decision-making across industries."
      ]
    },
    section2: {
      title: "Precision Meets Innovation",
      subtitle: "Advanced Segmentation",
      content: [
        "Our machine learning models have been trained on millions of drone images, learning to recognize patterns and features across diverse terrains and conditions. The result is unprecedented accuracy in image segmentation that adapts to various environments.",
        "From detecting crop health variations in agricultural fields to identifying infrastructure elements in urban environments, our technology provides the granular detail needed for informed decision-making.",
        "The interactive overlay system allows users to explore segmented regions with intuitive hover interactions, making complex AI analysis accessible and understandable to professionals across different fields."
      ]
    },
    section3: {
      title: "Transforming Industries",
      subtitle: "Real-World Impact",
      content: [
        "Agriculture professionals use our technology to optimize crop yields, detect plant diseases early, and manage irrigation systems more effectively. The precision of our segmentation enables targeted treatments that reduce costs and environmental impact.",
        "Urban planners and environmental scientists leverage our analysis to monitor land use changes, assess environmental health, and plan sustainable development projects with unprecedented detail and accuracy.",
        "The future of aerial intelligence is here, and it's accessible through a simple, elegant interface that puts the power of advanced AI analysis at your fingertips."
      ]
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section
        className="relative min-h-screen flex items-center justify-center"
        style={{
          backgroundImage: `url(${heroBackground})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
        }}
      >
        <div className="absolute inset-0 bg-black/30" />
        
        <div className="relative z-10 w-full max-w-7xl mx-auto px-6">
          {!selectedImage ? (
            <div className="text-center mb-16 animate-fade-in">
              <div className="space-y-8 mb-16">
                <h1 className="text-6xl lg:text-8xl font-bold text-white leading-tight animate-float">
                  <span className="block">Drone</span>
                  <span className="block bg-gradient-to-r from-primary via-white to-primary-glow bg-clip-text text-transparent animate-pulse">
                    Intelligence
                  </span>
                </h1>
                <div className="max-w-4xl mx-auto space-y-6">
                  <p className="text-2xl lg:text-3xl font-light text-white/90 leading-relaxed">
                    Transform aerial imagery into 
                    <span className="font-semibold text-primary-glow"> actionable insights</span>
                  </p>
                  <p className="text-lg lg:text-xl text-white/70 leading-relaxed">
                    Cutting-edge AI segmentation that reveals hidden patterns in every pixel
                  </p>
                </div>
              </div>
              
              <div className="glass-panel p-8 rounded-3xl animate-slide-up mx-4 lg:mx-0">
                <ImageCarousel onImageSelect={handleImageSelect} />
              </div>
            </div>
          ) : (
            <div className="animate-scale-in">
              <SegmentationInterface 
                selectedImage={selectedImage} 
                onBack={handleBack} 
              />
            </div>
          )}
        </div>
      </section>

      {/* ML Story Sections */}
      {!selectedImage && (
        <>
          <MLStorySection
            title={storyContent.section1.title}
            subtitle={storyContent.section1.subtitle}
            content={storyContent.section1.content}
            backgroundImage={[storyBackground1, storyBackground2, storyBackground3]}
            imagePosition="left"
            accentColor="primary"
            layout="carousel"
          />
          
          <MLStorySection
            title={storyContent.section2.title}
            subtitle={storyContent.section2.subtitle}
            content={storyContent.section2.content}
            backgroundImage={[storyBackground2, storyBackground3]}
            imagePosition="right"
            accentColor="secondary"
            layout="dual"
          />
          
          <MLStorySection
            title={storyContent.section3.title}
            subtitle={storyContent.section3.subtitle}
            content={storyContent.section3.content}
            backgroundImage={[storyBackground3, storyBackground1]}
            imagePosition="left"
            accentColor="primary"
            layout="dual"
          />
        </>
      )}
    </div>
  );
};

export default Index;