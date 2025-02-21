import React, { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import html2canvas from 'html2canvas';
import { motion } from 'framer-motion';
import { PHOTO_STRIP_TEMPLATES } from '@/constants/templates';

export const Preview = ({ photos, template: initialTemplate, onBack }) => {
  const stripRef = useRef(null);
  const [template, setTemplate] = useState(initialTemplate);

  const handleTemplateChange = (newTemplate) => {
    setTemplate(newTemplate);
  };

  const handleDownload = async () => {
    if (!stripRef.current) return;

    try {
      const canvas = await html2canvas(stripRef.current, {
        backgroundColor: template.styles.background,
        scale: 2,
      });

      const link = document.createElement('a');
      link.download = 'Snapify.png';
      link.href = canvas.toDataURL('image/png');
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
        >
          {renderDecorations()}
          {photos.map((photo, index) => (
            <div key={index} className={template.styles.photo}>
              <img
                src={photo}
                alt={`Photo ${index + 1}`}
                className="w-full aspect-square object-cover"
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
            <Button
              onClick={handleDownload}
              className="flex-1 bg-black hover:bg-black/90 text-white"
            >
              Download
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
