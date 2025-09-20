import { useState } from "react";
import { ImageCarousel } from "@/components/ImageCarousel";
import { SegmentationInterface } from "@/components/SegmentationInterface";
import { MLStorySection } from "@/components/MLStorySection";

// Import background images
import heroBackground from "@/assets/ocean_rocks.jpg";
import storyBackground1 from "@/assets/surreal_farmer.png";
import storyBackground2 from "@/assets/forest.jpg";
import storyBackground3 from "@/assets/buildings.jpg";

import slide0Image0 from "@/assets/distribution_pixel_percentage_by_class.png";
import slide0Image1 from "@/assets/at_least_one.png";
import slide0Image2 from "@/assets/distribution_grayscale_brightness.png";
import slide0Image3 from "@/assets/mean_dist.png";
import slide0Image4 from "@/assets/median_dist.png";

import slide1Image0 from "@/assets/models_experiment.png";
import slide1Image1 from "@/assets/final_training_metrics.png";

import slide2Image0 from "@/assets/model_iou.png";
import slide2Image1 from "@/assets/inference_demo.png";

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
      title: "Understanding Aerial Landscapes",
      subtitle: "Turning drone imagery into insightful data",
      content: [
        "Every drone captures thousands of pixels, but which ones matter? I tackled semantic segmentation of high-resolution aerial images to identify 24 distinct landscape features—from vegetation and water bodies to buildings and roads.",
        "Working with just 400 images presented real challenges. Class imbalance was severe—some features appeared in 37% of pixels while others barely reached 0.02%. I resized images to optimal dimensions while preserving aspect ratios and conducted thorough exploratory data analysis.",
        "The solution? Custom data augmentation pipeline and strategic loss function selection. With limited data, every pixel counts."
      ]
    },
    section2: {
      title: "Computer Vision Model Deep Dive",
      subtitle: "Seven models, one winner",
      content: [
        "I systematically tested seven different architectures: UNet variants with ResNet34, VGG16, and MobileNetV2 backbones, plus UNet++, LinkNet, and DeepLabV3+.",
        "Each model trained for 5 epochs across 2 GPUs for fair comparison. The winner came out to be DeepLabV3+ with its superior handling of multi-scale features through ASPP modules.",
        "Final training: 63 epochs with custom dice loss and mean IoU metrics. Early stopping kicked in when validation stopped improving. Result: 0.508 IoU on test set—solid performance for complex aerial segmentation."
      ]
    },
    section3: {
      title: "Model to Full Stack Application",
      subtitle: "Complete ML pipeline in production",
      content: [
        "I built a complete full-stack application to showcase the entire ML workflow.",
        "Backend: FastAPI service with async inference, base64 mask responses, and deployed on Render. The API handles image uploads, preprocessing, and returns segmented masks with class metadata.",
        "Frontend: React application with dynamic visualization, interactive legends, and real-time mask overlays. Users can explore different drone images and see segmentation results instantly. Thankyou lovable.dev.",
        "And came SkySight, production-ready Drone Image Semantic Segmentation system, demonstrating end-to-end ML engineering skills."
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
                  <span className="block"><br></br>SkySight</span>
                </h1>
                <div className="max-w-4xl mx-auto space-y-6">
                  <p className="text-2xl lg:text-3xl font-light text-white/90 leading-relaxed">
                    See the Unseen: 
                    <span className="font-semibold text-primary-glow">AI-Powered Drone Insights </span>
                  </p>
                  <p className="text-lg lg:text-xl text-white/70 leading-relaxed">
                    Use AI to instantly extract roads, buildings, water, and vegetation from high-resolution drone images—turning pixels into actionable maps
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
            backgroundImage={storyBackground1}
            slideImages={[slide0Image0, slide0Image1, slide0Image2, slide0Image3, slide0Image4]}
            imagePosition="left"
            accentColor="primary"
            layout="carousel"
          />
          
          <MLStorySection
            title={storyContent.section2.title}
            subtitle={storyContent.section2.subtitle}
            content={storyContent.section2.content}
            backgroundImage={storyBackground2}
            slideImages={[slide1Image0, slide1Image1]}
            imagePosition="right"
            accentColor="secondary"
            layout="dual"
          />
          
          <MLStorySection
            title={storyContent.section3.title}
            subtitle={storyContent.section3.subtitle}
            content={storyContent.section3.content}
            backgroundImage={storyBackground3}
            slideImages={[slide2Image0, slide2Image1]}
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
