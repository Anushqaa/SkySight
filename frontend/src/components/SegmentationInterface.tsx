import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Download } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ClassInfo {
  id: number;
  name: string;
  rgb: [number, number, number];
}

interface SegmentationResponse {
  mask_png_base64: string;
  width: number;
  height: number;
  classes: ClassInfo[];
}

interface SegmentationInterfaceProps {
  selectedImage: { id: number; src: string; title: string };
  onBack: () => void;
}

export const SegmentationInterface: React.FC<SegmentationInterfaceProps> = ({
  selectedImage,
  onBack,
}) => {
  const [segmentationData, setSegmentationData] = useState<SegmentationResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadSegmentation = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await import(`@/assets/responses/response_${selectedImage.id}.json`);
        setSegmentationData(response.default);
      } catch (err) {
        console.error(err);
        setError(`Could not load segmentation data for ${selectedImage.title}.`);
      } finally {
        setLoading(false);
      }
    };
    loadSegmentation();
  }, [selectedImage.id]);

  const maskSrc = segmentationData ? `data:image/png;base64,${segmentationData.mask_png_base64}` : null;

  const handleDownload = () => {
    if (!maskSrc) return;
    const link = document.createElement('a');
    link.href = maskSrc;
    link.download = `mask_${selectedImage.title}.png`;
    link.click();
  };

  return (
    <div className="w-full max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <Button
          variant="ghost"
          onClick={onBack}
          className="text-foreground hover:text-primary"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Gallery
        </Button>
        <h2 className="text-2xl font-bold text-center">
          {selectedImage.title} - Segmentation Analysis
        </h2>
        <div className="w-32" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="glass-panel p-6">
          <h3 className="text-lg font-semibold mb-4 text-center">Original Image</h3>
          <img
            src={selectedImage.src}
            alt={`Original ${selectedImage.title}`}
            className="w-full rounded-lg"
          />
        </div>
        <div className="glass-panel p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Segmentation Mask</h3>
            {segmentationData && (
              <Button variant="outline" size="sm" onClick={handleDownload}>
                <Download className="mr-2 h-4 w-4" />
                Download Mask
              </Button>
            )}
          </div>
          {maskSrc ? (
            <img
              src={maskSrc}
              alt="Segmentation mask"
              className="w-full rounded-lg"
            />
          ) : (
            <div
              className={cn(
                'bg-muted/25 flex items-center justify-center rounded-lg',
                'text-muted-foreground h-80'
              )}
            >
              {loading ? 'Loading...' : 'No mask available'}
            </div>
          )}
        </div>
      </div>

      {loading && (
        <div className="flex justify-center my-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      )}

      {error && <div className="text-center text-red-500 my-4">{error}</div>}

      {segmentationData && segmentationData.classes.length > 0 && (
        <div className="mt-8 glass-panel p-6 animate-slide-up">
          <h4 className="text-lg font-semibold mb-4">Class Legend</h4>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {segmentationData.classes.map((cls) => (
              <div key={cls.id} className="flex items-center space-x-2">
                <div
                  className="w-4 h-4 rounded-full border border-white/50"
                  style={{
                    backgroundColor: `rgb(${cls.rgb[0]}, ${cls.rgb[1]}, ${cls.rgb[2]})`,
                  }}
                />
                <span className="text-xs font-medium" aria-label={cls.name}>{cls.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
