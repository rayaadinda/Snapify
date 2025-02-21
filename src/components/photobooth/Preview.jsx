import React, { useRef, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import html2canvas from 'html2canvas';

export const Preview = ({ photos, template, onReset }) => {
  const stripRef = useRef(null);
  const [stripDimensions, setStripDimensions] = useState({ width: 0, height: 0 });
  const [containerWidth, setContainerWidth] = useState(0);

  // Fixed dimensions based on the template
  const BASE_STRIP_WIDTH = 400; // Maximum width for desktop
  const MIN_STRIP_WIDTH = 280; // Minimum width for mobile
  const PHOTO_ASPECT_RATIO = 1/1; // Standard photo aspect ratio
  const PHOTO_GAP = 16; // 16px gap between photos
  const STRIP_PADDING = 32; // 32px padding around the strip
  const STRIP_ASPECT_RATIO = 1/3.5; // Overall strip aspect ratio

  useEffect(() => {
    const updateDimensions = () => {
      const container = stripRef.current?.parentElement;
      if (!container) return;

      const containerWidth = container.offsetWidth;
      setContainerWidth(containerWidth);

      // Calculate strip width based on container size
      const stripWidth = Math.min(
        Math.max(containerWidth - 32, MIN_STRIP_WIDTH),
        BASE_STRIP_WIDTH
      );

      // Calculate dimensions based on the fixed aspect ratios
      const photoWidth = stripWidth - (STRIP_PADDING * 2);
      const photoHeight = photoWidth / PHOTO_ASPECT_RATIO;
      const totalHeight = (photoHeight * 3) + (PHOTO_GAP * 2) + (STRIP_PADDING * 2);

      setStripDimensions({
        width: stripWidth,
        height: totalHeight
      });
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  const handleDownload = async () => {
    if (!stripRef.current) return;

    try {
      const tempContainer = document.createElement('div');
      tempContainer.style.width = `${stripDimensions.width}px`;
      tempContainer.style.height = `${stripDimensions.height}px`;
      tempContainer.style.position = 'absolute';
      tempContainer.style.left = '-9999px';
      
      const stripClone = stripRef.current.cloneNode(true);
      stripClone.style.width = `${stripDimensions.width}px`;
      stripClone.style.height = `${stripDimensions.height}px`;
      tempContainer.appendChild(stripClone);
      document.body.appendChild(tempContainer);

      const canvas = await html2canvas(stripClone, {
        scale: 2,
        useCORS: true,
        backgroundColor: template.styles.background || '#ffffff',
        width: stripDimensions.width,
        height: stripDimensions.height,
        logging: false,
      });

      document.body.removeChild(tempContainer);

      const link = document.createElement('a');
      link.download = `snapify-${template.name.toLowerCase()}-${Date.now()}.jpg`;
      link.href = canvas.toDataURL('image/jpeg', 1.0);
      link.click();
    } catch (err) {
      console.error('Error generating photo strip:', err);
    }
  };

  const photoWidth = stripDimensions.width - (STRIP_PADDING * 2);
  const photoHeight = photoWidth / PHOTO_ASPECT_RATIO;

  return (
    <div className="flex flex-col items-center w-full max-w-2xl mx-auto p-4">
      <h2 className="text-xl md:text-2xl font-semibold mb-4 md:mb-6 text-center">Your Photo Strip</h2>
      
    
      <div className="max-w-xl mb-6 md:mb-8">
        <div 
          ref={stripRef}
          className={`mx-auto overflow-hidden ${template.styles.container}`}
          style={{
            width: stripDimensions.width ? `${stripDimensions.width}px` : '100%',
            padding: `${STRIP_PADDING}px`,
            backgroundColor: template.styles.background || '#ffffff',
          }}
        >
          <div className="flex flex-col">
            {photos.map((photo, index) => (
              <React.Fragment key={index}>
                <div 
                  className={`w-full overflow-hidden ${template.styles.photo}`}
                  style={{
                    height: photoHeight ? `${photoHeight}px` : 'auto',
                  }}
                >
                  <img
                    src={photo}
                    alt={`Photo ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
                {index < photos.length - 1 && (
                  <div style={{ height: `${PHOTO_GAP}px` }} />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
        <Button
          onClick={handleDownload}
          className="w-full sm:w-auto bg-black hover:bg-black/90 text-white rounded-lg px-6 md:px-8 py-2.5 md:py-3"
        >
          Download Photo Strip
        </Button>
        <Button
          variant="outline"
          onClick={onReset}
          className="w-full sm:w-auto border-black text-black hover:bg-black hover:text-white rounded-lg px-6 md:px-8 py-2.5 md:py-3"
        >
          Take New Photos
        </Button>
      </div>
    </div>
  );
};
