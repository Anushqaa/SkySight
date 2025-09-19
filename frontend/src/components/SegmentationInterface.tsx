import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Download, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

interface SegmentationInterfaceProps {
  selectedImage: { id: number; src: string; title: string };
  onBack: () => void;
}

// Mock segmentation classes with colors
const segmentationClasses = [
  { name: "Vegetation", color: "rgba(34, 197, 94, 0.7)", position: { x: 25, y: 30 } },
  { name: "Dirt", color: "rgba(168, 85, 247, 0.7)", position: { x: 60, y: 70 } },
  { name: "Water", color: "rgba(59, 130, 246, 0.7)", position: { x: 80, y: 20 } },
  { name: "Buildings", color: "rgba(239, 68, 68, 0.7)", position: { x: 15, y: 80 } },
  { name: "Roads", color: "rgba(245, 158, 11, 0.7)", position: { x: 45, y: 50 } },
];

export const SegmentationInterface = ({ selectedImage, onBack }: SegmentationInterfaceProps) => {
  const [isSegmenting, setIsSegmenting] = useState(false);
  const [isSegmented, setIsSegmented] = useState(false);
  const [hoveredClass, setHoveredClass] = useState<string | null>(null);

  const handleSegment = async () => {
    setIsSegmenting(true);
    // Simulate segmentation processing
    await new Promise(resolve => setTimeout(resolve, 3000));
    setIsSegmenting(false);
    setIsSegmented(true);
  };

  const handleDownload = () => {
    // Create a download link for the segmented image
    const link = document.createElement('a');
    link.href = selectedImage.src; // In real app, this would be the segmented image
    link.download = `segmented-${selectedImage.title.toLowerCase().replace(/\s+/g, '-')}.png`;
    link.click();
  };

  return (
    <div className="w-full max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <Button
          variant="ghost"
          onClick={onBack}
          className="text-foreground hover:text-primary"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Gallery
        </Button>
        <h2 className="text-2xl font-bold text-center">{selectedImage.title} - Segmentation Analysis</h2>
        <div className="w-32" /> {/* Spacer for centering */}
      </div>

      {/* Action Button */}
      {!isSegmented && (
        <div className="flex justify-center mb-8">
          <Button
            variant="hero"
            size="xl"
            onClick={handleSegment}
            disabled={isSegmenting}
            className={cn(
              "relative overflow-hidden",
              isSegmenting && "animate-pulse"
            )}
          >
            {isSegmenting ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                Processing Segmentation...
              </>
            ) : (
              <>
                <Zap className="mr-2 h-5 w-5" />
                Segment Image
              </>
            )}
          </Button>
        </div>
      )}

      {/* Image Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Original Image */}
        <div className="glass-panel p-6 animate-fade-in">
          <h3 className="text-lg font-semibold mb-4 text-center">Original Image</h3>
          <div className="relative rounded-lg overflow-hidden">
            <img
              src={selectedImage.src}
              alt={`Original ${selectedImage.title}`}
              className="w-full h-80 object-cover"
            />
          </div>
        </div>

        {/* Segmented Image */}
        <div className={cn(
          "glass-panel p-6 transition-all duration-500",
          isSegmented ? "animate-scale-in" : "opacity-50"
        )}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Segmented Result</h3>
            {isSegmented && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleDownload}
              >
                <Download className="mr-2 h-4 w-4" />
                Download
              </Button>
            )}
          </div>
          <div className="relative rounded-lg overflow-hidden">
            <img
              src={selectedImage.src}
              alt={`Segmented ${selectedImage.title}`}
              className="w-full h-80 object-cover"
            />
            
            {/* Segmentation Overlays */}
            {isSegmented && (
              <div className="absolute inset-0">
                {segmentationClasses.map((segClass, index) => (
                  <div
                    key={segClass.name}
                    className="absolute cursor-pointer transition-all duration-300 hover:scale-110"
                    style={{
                      left: `${segClass.position.x}%`,
                      top: `${segClass.position.y}%`,
                      width: '60px',
                      height: '60px',
                      backgroundColor: segClass.color,
                      borderRadius: '50%',
                      border: '2px solid white',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                      animation: `fade-in 0.5s ease-out ${index * 0.2}s both`,
                    }}
                    onMouseEnter={() => setHoveredClass(segClass.name)}
                    onMouseLeave={() => setHoveredClass(null)}
                  >
                    {/* Tooltip */}
                    {hoveredClass === segClass.name && (
                      <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-black/80 text-white px-3 py-1 rounded-lg text-sm font-medium whitespace-nowrap animate-fade-in">
                        {segClass.name}
                        <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-black/80" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Legend */}
      {isSegmented && (
        <div className="mt-8 glass-panel p-6 animate-slide-up">
          <h4 className="text-lg font-semibold mb-4">Segmentation Classes</h4>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {segmentationClasses.map((segClass) => (
              <div key={segClass.name} className="flex items-center space-x-2">
                <div
                  className="w-4 h-4 rounded-full border border-white/50"
                  style={{ backgroundColor: segClass.color }}
                />
                <span className="text-sm font-medium">{segClass.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};