import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useCamera } from '@/hooks/useCamera';
import { PHOTO_STRIP_TEMPLATES } from '@/constants/templates';
import { Preview } from './Preview';
import { Countdown } from './Countdown';

export const PhotoBooth = () => {
  const { videoRef, startCamera, stopCamera, takePhoto, error, isReady, isActive } = useCamera();
  const [photos, setPhotos] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(PHOTO_STRIP_TEMPLATES[0]);
  const [isCapturing, setIsCapturing] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [countdownActive, setCountdownActive] = useState(false);

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, [stopCamera]);

  const handleStartSession = async () => {
    setIsCapturing(true);
    await startCamera();
  };

  const handleCapture = () => {
    if (!isReady) {
      console.log('Camera not ready for capture');
      return;
    }

    const photo = takePhoto();
    if (photo) {
      const newPhotos = [...photos, photo];
      setPhotos(newPhotos);
      
      if (newPhotos.length < 3) {
        // Start countdown for next photo after 1 second
        setTimeout(() => {
          setCountdownActive(true);
        }, 1000);
      } else {
        setCountdownActive(false);
      }
    } else {
      console.error('Failed to take photo');
    }
  };

  const startPhotoSequence = () => {
    if (!isReady) {
      console.log('Camera not ready for capture');
      return;
    }
    setCountdownActive(true);
  };

  const handleCountdownComplete = () => {
    setCountdownActive(false);
    handleCapture();
  };

  const handleReset = () => {
    setPhotos([]);
    setShowPreview(false);
    stopCamera();
    setIsCapturing(false);
  };

  const handleNext = () => {
    if (photos.length === 3) {
      setShowPreview(true);
    }
  };

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
      {error ? (
        <div className="w-full p-4 mb-4 text-red-800 bg-red-50 rounded-lg flex items-center justify-between">
          <div className="flex items-center">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <span>{error}</span>
          </div>
          <button
            onClick={() => {
              setError(null);
              startCamera();
            }}
            className="text-sm font-medium text-red-800 hover:text-red-900"
          >
            Try Again
          </button>
        </div>
      ) : null}

      <div className="w-full max-w-6xl mx-auto p-4">
        <div className="flex flex-col items-center">
          {isCapturing ? (
            <>
              <div className="flex flex-col md:flex-row w-full gap-4 md:gap-8">
                {/* Camera Section */}
                <div className="w-full md:flex-1">
                  <div className="relative aspect-square bg-black rounded-lg overflow-hidden mb-4">
                    {!isActive && !error && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-white text-center">
                          <svg className="animate-spin h-8 w-8 mx-auto mb-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          <span>Initializing camera...</span>
                        </div>
                      </div>
                    )}
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      muted
                      className="absolute inset-0 w-full h-full object-cover transform scale-x-[-1]"
                    />
                    {countdownActive && (
                      <Countdown onComplete={handleCountdownComplete} />
                    )}
                  </div>

                  <div className="flex justify-between items-center w-full">
                    {/* Left side: Reset button */}
                    <button
                      onClick={handleReset}
                      className="p-2 hover:bg-gray-100 rounded-full"
                      title="Reset Photos"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                    </button>

                    {/* Center: Take Photo button */}
                    <Button
                      onClick={photos.length === 0 ? startPhotoSequence : undefined}
                      disabled={!isReady || countdownActive || photos.length > 0}
                      className="bg-black hover:bg-black/90 text-white rounded-lg px-6 py-2.5 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Take Photo ({photos.length}/3)
                    </Button>

                    {/* Right side: Next button */}
                    <Button
                      onClick={handleNext}
                      disabled={photos.length < 3}
                      variant="outline"
                      className="border-black text-black hover:bg-black hover:text-white rounded-lg px-6 py-2.5 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next
                    </Button>
                  </div>
                </div>

               
                <div className="flex md:w-48 w-full md:flex-col gap-4 pb-4">
                  <div className="grid grid-cols-3 md:grid-cols-1 w-full gap-4">
                    {photos.map((photo, index) => (
                      <div
                        key={index}
                        className="aspect-square bg-gray-100 rounded-lg overflow-hidden"
                      >
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
            </>
          ) : (
            <div className="flex flex-col items-center gap-6 sm:gap-8 w-full max-w-2xl mx-auto px-4 sm:px-6 py-6 sm:py-8 text-center">
              <div className="space-y-4 sm:space-y-6">
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight">
                  Ready for your photo strip?
                </h1>
                <div className="space-y-4 text-gray-600">
                  <p className="text-base sm:text-lg md:text-xl">
                    Create memories that last forever with our photobooth!
                  </p>
                  <ul className="space-y-3 text-left max-w-md mx-auto text-sm sm:text-base">
                    <li className="flex items-center gap-2">
                      <svg className="w-5 h-5 flex-shrink-0 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Take 3 unique photos in sequence</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <svg className="w-5 h-5 flex-shrink-0 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>3-second countdown between each shot</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <svg className="w-5 h-5 flex-shrink-0 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span>Choose from classic photo strip styles</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <svg className="w-5 h-5 flex-shrink-0 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      <span>Download your photo strip instantly</span>
                    </li>
                  </ul>
                </div>
              </div>
              
              <div className="flex flex-col items-center gap-3 w-full sm:w-auto">
                <Button 
                  onClick={handleStartSession}
                  className="w-full sm:w-auto bg-black hover:bg-black/90 text-white text-base sm:text-lg rounded-full px-6 sm:px-8 py-2.5 sm:py-3"
                >
                  Start Photo Session
                </Button>
                <p className="text-sm text-gray-500">
                  Make sure to allow camera access when prompted
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
