import React, { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import html2canvas from 'html2canvas';
import { motion } from 'framer-motion';
import { PHOTO_STRIP_TEMPLATES } from '@/constants/templates';

export const Preview = ({ photos, template: initialTemplate, onBack }) => {
  const stripRef = useRef(null);
  const [template, setTemplate] = useState(initialTemplate);
  const [quality, setQuality] = useState('high'); // 'standard' or 'high'

  const filterStyles = {
    none: '',
    bw: 'grayscale(100%)',
    sepia: 'sepia(100%)',
    vintage: 'sepia(50%) contrast(85%) brightness(90%)',
  };

  const qualityOptions = {
    standard: { scale: 2, compression: 0.92 },
    high: { scale: 4, compression: 1.0 }
  };

  const handleTemplateChange = (newTemplate) => {
    setTemplate(newTemplate);
  };

  const handleDownload = async () => {
    if (!stripRef.current) return;

    try {
      const canvas = await html2canvas(stripRef.current, {
        backgroundColor: template.styles.background,
        scale: qualityOptions[quality].scale,
        useCORS: true,
        logging: false,
        allowTaint: true,
        imageTimeout: 0,
      });

      const link = document.createElement('a');
      link.download = `Snapify-${quality}-quality.png`;
      link.href = canvas.toDataURL('image/png', qualityOptions[quality].compression);
      link.click();
    } catch (error) {
      console.error('Error generating photo strip:', error);
    }
  };

  const renderDecorations = () => {
    if (!template.styles.decorations) return null;

    return template.styles.decorations.map((decoration, index) => (
      <div key={index} className={decoration}>
        {template.styles.decorationContent?.[index] || ''}
      </div>
    ));
  };

  return (
    <div className="flex flex-col lg:flex-row items-start justify-center w-full max-w-3xl mx-auto p-4 gap-8">
      <div className="w-[200px] mx-auto lg:mx-0">
        <div 
          ref={stripRef}
          className={template.styles.container}
          style={template.styles}
        >
          {renderDecorations()}
            {photos.map((photo, index) => (
              <div
                key={index}
                className={template.styles.photo}
              >
                <img
                  src={photo.src}
                  alt={`Photo ${index + 1}`}
                  className="w-full aspect-square object-cover"
                  style={{ filter: filterStyles[photo.filter] }}
                />
              </div>
            ))}
        </div>
      </div>

      <div className="flex flex-col flex-1 max-w-md gap-6">
        <div>
          <h2 className="text-xl font-semibold mb-4">Choose Template</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {PHOTO_STRIP_TEMPLATES.map((t) => (
              <Button
                key={t.id}
                variant={template.id === t.id ? "default" : "outline"}
                onClick={() => handleTemplateChange(t)}
                className={`w-full text-sm ${template.id === t.id ? 'bg-black text-white' : 'hover:bg-black/5'}`}
              >
                {t.name}
              </Button>
            ))}
          </div>
        </div>

        <div className="space-y-4 w-full">
          <div className="flex flex-col space-y-2">
            <label className="text-sm font-medium">Download Quality:</label>
            <div className="flex gap-2">
              <Button
                variant={quality === 'standard' ? 'default' : 'outline'}
                onClick={() => setQuality('standard')}
                className="flex-1"
              >
                Standard
                <span className="ml-1 text-xs opacity-70">(2x)</span>
              </Button>
              <Button
                variant={quality === 'high' ? 'default' : 'outline'}
                onClick={() => setQuality('high')}
                className="flex-1"
              >
                High Quality
                <span className="ml-1 text-xs opacity-70">(4x)</span>
              </Button>
            </div>
          </div>
          <Button onClick={handleDownload} className="w-full">
            Download Photo Strip
          </Button>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Actions</h2>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              variant="outline"
              onClick={onBack}
              className="flex-1 border-black text-black hover:bg-black hover:text-white"
            >
              Take New Photos
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
