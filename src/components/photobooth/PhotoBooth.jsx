import React, { useState, useEffect } from 'react';
import { useCamera } from '@/hooks/useCamera';
import { PHOTO_STRIP_TEMPLATES } from '@/constants/templates';
import { Button } from '@/components/ui/button';
import { Preview } from './Preview';
import { Countdown } from './Countdown';

export const PhotoBooth = () => {
  const { videoRef, startCamera, stopCamera, takePhoto, error, isReady } = useCamera();
  const [photos, setPhotos] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(PHOTO_STRIP_TEMPLATES[0]);
  const [isCapturing, setIsCapturing] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [isInitializing, setIsInitializing] = useState(false);
  const [showCountdown, setShowCountdown] = useState(false);
  const [showTemplateSelection, setShowTemplateSelection] = useState(false);

  const handleStartSession = async () => {
    console.log('Starting photo session...');
    setShowPreview(false);
    setIsInitializing(true);
    setIsCapturing(true);
    setPhotos([]);
    setShowTemplateSelection(false);

    try {
      await startCamera();
      console.log('Camera started successfully');
    } catch (err) {
      console.error('Failed to start camera:', err);
      setIsCapturing(false);
    } finally {
      setIsInitializing(false);
    }
  };

  const startPhotoCapture = () => {
    if (!isReady) return;
    setShowCountdown(true);
  };

  const handleCapture = () => {
    if (photos.length >= 3 || !isReady) {
      console.log('Cannot take photo:', photos.length >= 3 ? 'Max photos reached' : 'Camera not ready');
      return;
    }
    
    console.log('Taking photo...');
    const photo = takePhoto();
    if (photo) {
      console.log('Photo captured successfully');
      const newPhotos = [...photos, photo];
      setPhotos(newPhotos);
      
      if (newPhotos.length === 3) {
        console.log('All photos taken, showing template selection');
        stopCamera();
        setIsCapturing(false);
        setShowTemplateSelection(true);
      } else {
        setTimeout(() => {
          setShowCountdown(true);
        }, 1000);
      }
    } else {
      console.log('Failed to capture photo');
    }
  };

  const handleTemplateChange = (template) => {
    console.log('Changing template to:', template.name);
    setSelectedTemplate(template);
  };

  const handleReset = () => {
    console.log('Resetting photo session...');
    setPhotos([]);
    stopCamera();
    setIsCapturing(false);
    setShowPreview(false);
    setIsInitializing(false);
    setShowTemplateSelection(false);
  };

  const proceedToPreview = () => {
    setShowTemplateSelection(false);
    setShowPreview(true);
  };

  useEffect(() => {
    return () => {
      console.log('Component unmounting, cleaning up...');
      stopCamera();
    };
  }, []);

  if (showTemplateSelection) {
    return (
      <div className="flex flex-col items-center w-full max-w-4xl mx-auto p-4">
        <h2 className="text-2xl font-semibold mb-4 md:mb-8 text-center">Choose Your Style</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8 w-full">
          {PHOTO_STRIP_TEMPLATES.map((template) => (
            <button
              key={template.id}
              onClick={() => handleTemplateChange(template)}
              className={`p-3 md:p-4 rounded-lg border-2 transition-colors ${
                selectedTemplate.id === template.id
                  ? 'border-black bg-black/5'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="aspect-[3/8] bg-white rounded overflow-hidden mb-2">
                <div className={`w-full h-full p-2 ${
                  template.background === 'sepia' ? 'sepia' : 
                  template.background === 'gradient' ? 'bg-gradient-to-b from-purple-100 to-pink-100' : ''
                }`}>
                  <div className="flex flex-col h-full gap-4 md:gap-8">
                    {photos.map((photo, index) => (
                      <div key={index} className="flex-1 rounded overflow-hidden">
                        <img
                          src={photo}
                          alt={`Photo ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <span className="font-medium text-sm md:text-base">{template.name}</span>
            </button>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-3 md:gap-4 w-full sm:w-auto">
          <Button
            onClick={proceedToPreview}
            className="w-full sm:w-auto bg-black hover:bg-black/90 text-white rounded-lg px-6 md:px-8 py-2.5 md:py-3"
          >
            Continue
          </Button>
          <Button
            variant="outline"
            onClick={handleReset}
            className="w-full sm:w-auto border-black text-black hover:bg-black hover:text-white rounded-lg px-6 md:px-8 py-2.5 md:py-3"
          >
            Take New Photos
          </Button>
        </div>
      </div>
    );
  }

  if (showPreview) {
    return (
      <Preview
        photos={photos}
        template={selectedTemplate}
        onReset={handleReset}
      />
    );
  }

  return (
    <div className="flex flex-col items-center w-full max-w-4xl mx-auto p-4">
      {error && (
        <div className="w-full bg-red-100 text-red-700 p-3 md:p-4 rounded-lg mb-4 text-sm md:text-base">
          {error}
        </div>
      )}

      <div className="w-full max-w-lg mx-auto">
        <div className="flex flex-col items-center">
          {isCapturing ? (
            <>
              <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden mb-4">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="absolute inset-0 w-full h-full object-cover"
                />
                {(isInitializing || !isReady) && (
                  <div className="absolute inset-0 flex items-center justify-center text-white bg-black bg-opacity-50">
                    <p className="text-sm md:text-base">Initializing camera...</p>
                  </div>
                )}
                {showCountdown && (
                  <Countdown
                    onComplete={() => {
                      setShowCountdown(false);
                      handleCapture();
                    }}
                  />
                )}
              </div>
              <div className="flex flex-col items-center gap-4 w-full">
                <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                  <Button
                    onClick={startPhotoCapture}
                    disabled={photos.length >= 3 || !isReady || isInitializing || showCountdown}
                    className="w-full sm:w-auto bg-black hover:bg-black/90 text-white rounded-lg px-6 md:px-8 py-2.5 md:py-3"
                  >
                    Take Photo ({photos.length}/3)
                  </Button>
                  <Button 
                    onClick={handleReset}
                    variant="outline"
                    className="w-full sm:w-auto border-black text-black hover:bg-black hover:text-white rounded-lg px-6 md:px-8 py-2.5 md:py-3"
                  >
                    Reset
                  </Button>
                </div>
                {photos.length > 0 && (
                  <div className="flex gap-2 overflow-x-auto pb-2 w-full justify-center">
                    {photos.map((photo, index) => (
                      <div key={index} className="w-16 md:w-20 h-16 md:h-20 flex-shrink-0 rounded overflow-hidden">
                        <img
                          src={photo}
                          alt={`Photo ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center gap-4 w-full">
              <Button 
                onClick={handleStartSession}
                className="w-full sm:w-auto bg-black hover:bg-black/90 text-white rounded-lg px-6 md:px-8 py-2.5 md:py-3"
              >
                Start Photo Session
              </Button>
              <p className="text-sm md:text-base text-gray-500 text-center">
                Make sure to allow camera access when prompted
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
