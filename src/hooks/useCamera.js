import { useState, useEffect, useRef } from 'react';

export const useCamera = () => {
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const [error, setError] = useState(null);
  const [isReady, setIsReady] = useState(false);

  const startCamera = async () => {
    console.log('Starting camera...');
    try {
      // Check if browser supports getUserMedia
      if (!navigator.mediaDevices?.getUserMedia) {
        throw new Error('Camera API is not supported in this browser');
      }

      // Stop any existing stream
      if (streamRef.current) {
        console.log('Stopping existing stream...');
        streamRef.current.getTracks().forEach(track => track.stop());
      }

      console.log('Requesting camera access...');
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'user',
        },
        audio: false
      });

      console.log('Camera access granted, setting up video stream...');
      streamRef.current = mediaStream;

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        
        console.log('Waiting for video to be ready...');
        await new Promise((resolve, reject) => {
          videoRef.current.onloadedmetadata = async () => {
            try {
              await videoRef.current.play();
              console.log('Video playback started successfully');
              resolve();
            } catch (playError) {
              console.error('Error playing video:', playError);
              reject(playError);
            }
          };
        });

        setIsReady(true);
        setError(null);
        console.log('Camera setup complete!');
      } else {
        throw new Error('Video element reference not found');
      }
    } catch (err) {
      console.error('Camera initialization error:', err);
      setError(err.message || 'Failed to access camera');
      setIsReady(false);
      
      // Additional error details
      if (err.name === 'NotAllowedError') {
        setError('Camera access was denied. Please allow camera access and try again.');
      } else if (err.name === 'NotFoundError') {
        setError('No camera found. Please make sure your camera is connected and not in use by another application.');
      } else if (err.name === 'NotReadableError') {
        setError('Camera is in use by another application. Please close other apps using the camera and try again.');
      }
    }
  };

  const stopCamera = () => {
    console.log('Stopping camera...');
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => {
        track.stop();
        console.log('Track stopped:', track.label);
      });
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsReady(false);
    console.log('Camera stopped');
  };

  const takePhoto = () => {
    if (!videoRef.current || !isReady) {
      console.log('Cannot take photo:', !videoRef.current ? 'No video element' : 'Camera not ready');
      return null;
    }

    console.log('Taking photo...');
    const canvas = document.createElement('canvas');
    const video = videoRef.current;
    
    // Calculate dimensions to maintain aspect ratio
    const aspectRatio = 3/4; // Standard photo booth ratio
    const width = video.videoWidth;
    const height = width * aspectRatio;
    const yOffset = (video.videoHeight - height) / 2; // Center crop vertically
    
    canvas.width = width;
    canvas.height = height;
    
    const ctx = canvas.getContext('2d');
    // Draw the center portion of the video frame
    ctx.drawImage(
      video,
      0, yOffset, // Source x, y
      width, height, // Source width, height
      0, 0, // Destination x, y
      width, height // Destination width, height
    );
    
    const photo = canvas.toDataURL('image/jpeg', 0.9);
    console.log('Photo taken successfully');
    return photo;
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      console.log('Cleaning up camera...');
      stopCamera();
    };
  }, []);

  return {
    videoRef,
    error,
    isReady,
    startCamera,
    stopCamera,
    takePhoto,
  };
};
