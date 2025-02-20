import React, { useRef, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import html2canvas from 'html2canvas';

export const Preview = ({ photos, template, onReset }) => {
  const stripRef = useRef(null);
  const [stripDimensions, setStripDimensions] = useState({ width: 0, height: 0 });
  const [containerWidth, setContainerWidth] = useState(0);

  // Base dimensions for the photo strip
  const BASE_STRIP_WIDTH = 400; // Maximum width for desktop
  const MIN_STRIP_WIDTH = 280; // Minimum width for mobile
  const PHOTO_ASPECT_RATIO = 3/4;
  const PHOTO_SPACING = 48; // pixels
  const PADDING = 24; // pixels

  useEffect(() => {
    const updateDimensions = () => {
      const container = stripRef.current?.parentElement;
      if (!container) return;

      // Get container width and calculate strip width
      const containerWidth = container.offsetWidth;
      setContainerWidth(containerWidth);

      // Calculate strip width based on container size
      const stripWidth = Math.min(
        Math.max(containerWidth - 32, MIN_STRIP_WIDTH), // 32px for padding
        BASE_STRIP_WIDTH
      );

      // Calculate total height
      const photoHeight = stripWidth * PHOTO_ASPECT_RATIO;
      const totalHeight = (photoHeight * 3) + (PHOTO_SPACING * 2) + (PADDING * 2);

      setStripDimensions({
        width: stripWidth + (PADDING * 2),
        height: totalHeight
      });
    };

    // Initial calculation
    updateDimensions();

    // Update dimensions on resize
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
        backgroundColor: null,
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

  const stripWidth = stripDimensions.width - (PADDING * 2);
  const photoHeight = stripWidth * PHOTO_ASPECT_RATIO;

  return (
    <div className="flex flex-col items-center w-full max-w-2xl mx-auto p-4">
      <h2 className="text-xl md:text-2xl font-semibold mb-4 md:mb-6 text-center">Your Photo Strip</h2>
      
      {/* Photo Strip Preview */}
      <div className="w-full mb-6 md:mb-8">
        <div 
          ref={stripRef}
          className={`mx-auto bg-white rounded-lg overflow-hidden shadow-lg p-4 md:p-6 ${
            template.background === 'sepia' ? 'sepia' : 
            template.background === 'gradient' ? 'bg-gradient-to-b from-purple-100 to-pink-100' : ''
          }`}
          style={{
            width: stripDimensions.width ? `${stripDimensions.width}px` : '100%',
          }}
        >
          <div className="flex flex-col">
            {photos.map((photo, index) => (
              <React.Fragment key={index}>
                <div 
                  className="w-full rounded-lg overflow-hidden"
                  style={{
                    height: photoHeight ? `${photoHeight}px` : 'auto'
                  }}
                >
                  <img
                    src={photo}
                    alt={`Photo ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
                {index < photos.length - 1 && (
                  <div style={{ height: `${PHOTO_SPACING}px` }} />
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
