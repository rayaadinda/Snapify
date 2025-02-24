import { useState, useRef, useCallback, useEffect } from 'react';

export const useCamera = () => {
  const [isActive, setIsActive] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState(null);
  const streamRef = useRef(null);
  const videoRef = useRef(null);

  const startCamera = useCallback(async () => {
    try {
      setIsReady(false);
      setError(null);

      if (!navigator.mediaDevices?.getUserMedia) {
        throw new Error('Camera API is not supported in this browser');
      }

      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1080 },
          height: { ideal: 1080 },
          aspectRatio: 1.0,
          facingMode: 'user'
        },
        audio: false
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        
        // Wait for video to be loaded and playing
        await new Promise((resolve) => {
          videoRef.current.onloadedmetadata = async () => {
            try {
              await videoRef.current.play();
              // Add a small delay to ensure video is actually playing
              setTimeout(() => {
                setIsReady(true);
                setIsActive(true);
                resolve();
              }, 500);
            } catch (err) {
              console.error('Error playing video:', err);
              setError('Failed to start video stream');
              resolve();
            }
          };
        });
      }
    } catch (err) {
      let errorMessage = 'Could not access camera';
      
      if (err.name === 'NotAllowedError') {
        errorMessage = 'Camera access denied. Please allow camera access and try again.';
      } else if (err.name === 'NotFoundError') {
        errorMessage = 'No camera found. Please connect a camera and try again.';
      } else if (err.name === 'NotReadableError') {
        errorMessage = 'Camera is in use by another application. Please close other apps using the camera.';
      } else if (err.name === 'OverconstrainedError') {
        errorMessage = 'Camera does not support the required resolution. Trying with default settings...';
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ 
            video: true,
            audio: false 
          });
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            streamRef.current = stream;
            await videoRef.current.play();
            // Add a small delay to ensure video is actually playing
            setTimeout(() => {
              setIsReady(true);
              setIsActive(true);
              setError(null);
            }, 500);
            return;
          }
        } catch (retryErr) {
          errorMessage = 'Could not access camera with default settings';
        }
      }
      
      console.error('Camera error:', err);
      setError(errorMessage);
      setIsActive(false);
      setIsReady(false);
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsActive(false);
    setIsReady(false);
    setError(null);
  }, []);

  const takePhoto = useCallback((filter = 'none') => {
    if (!videoRef.current || !isReady) {
      console.log('Camera not ready:', { isReady, hasVideo: !!videoRef.current });
      return null;
    }

    try {
      const video = videoRef.current;
      
      // Make sure video dimensions are available
      if (!video.videoWidth || !video.videoHeight) {
        console.log('Video dimensions not ready');
        return null;
      }

      const canvas = document.createElement('canvas');
      const size = Math.min(video.videoWidth, video.videoHeight);
      
      canvas.width = size;
      canvas.height = size;
      
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        console.log('Could not get canvas context');
        return null;
      }

      // Center crop the video frame
      const xStart = (video.videoWidth - size) / 2;
      const yStart = (video.videoHeight - size) / 2;

      // Mirror the context for front camera
      ctx.scale(-1, 1);
      ctx.translate(-size, 0);

      ctx.drawImage(
        video,
        xStart, yStart, size, size,
        0, 0, size, size
      );

      // Reset transform
      ctx.setTransform(1, 0, 0, 1, 0, 0);

      // Apply filter effects
      if (filter !== 'none') {
        // Create a temporary canvas to apply filters
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = size;
        tempCanvas.height = size;
        const tempCtx = tempCanvas.getContext('2d');
        
        if (tempCtx) {
          // Draw the original image
          tempCtx.drawImage(canvas, 0, 0);
          
          // Get image data
          const imageData = tempCtx.getImageData(0, 0, size, size);
          const data = imageData.data;
          
          // Apply filters
          for (let i = 0; i < data.length; i += 4) {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];
            
            if (filter === 'bw') {
              const gray = 0.2989 * r + 0.5870 * g + 0.1140 * b;
              data[i] = gray;
              data[i + 1] = gray;
              data[i + 2] = gray;
            } else if (filter === 'sepia') {
              data[i] = Math.min(255, (r * 0.393) + (g * 0.769) + (b * 0.189));
              data[i + 1] = Math.min(255, (r * 0.349) + (g * 0.686) + (b * 0.168));
              data[i + 2] = Math.min(255, (r * 0.272) + (g * 0.534) + (b * 0.131));
            } else if (filter === 'vintage') {
              data[i] = Math.min(255, (r * 0.5) + (g * 0.5) + (b * 0.5) + 30);
              data[i + 1] = Math.min(255, (r * 0.4) + (g * 0.4) + (b * 0.4) + 20);
              data[i + 2] = Math.min(255, (r * 0.3) + (g * 0.3) + (b * 0.3));
            }
          }
          
          // Put the filtered image data back
          tempCtx.putImageData(imageData, 0, 0);
          
          // Draw the filtered image back to the main canvas
          ctx.drawImage(tempCanvas, 0, 0);
        }
      }

      return canvas.toDataURL('image/jpeg', 0.95);
    } catch (err) {
      console.error('Error taking photo:', err);
      return null;
    }
  }, [isReady]);

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, [stopCamera]);

  return {
    videoRef,
    isActive,
    isReady,
    error,
    startCamera,
    stopCamera,
    takePhoto
  };
};
