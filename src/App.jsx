import React, { useState } from 'react';
import logo from './assets/logo.png';
import hero from './assets/hero.png';
import { Button } from './components/ui/button';
import { PhotoBooth } from './components/photobooth/PhotoBooth';
import { PrivacyNotice } from './components/PrivacyNotice';

function App() {
  const [showPhotoBooth, setShowPhotoBooth] = useState(false);

  if (showPhotoBooth) {
    return (
      <div className="min-h-screen bg-white">
        <div className="w-full max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2">
              <img src={logo} alt="Snapify Logo" className="w-6 h-6 md:w-8 md:h-8" />
              <span className="font-medium text-lg md:text-xl" style={{ fontStyle: 'italic' }}>Snapify</span>
            </div>
            <Button
              variant="outline"
              onClick={() => setShowPhotoBooth(false)}
              className="border-black text-black hover:bg-black hover:text-white"
            >
              Back to Home
            </Button>
          </div>
          <main className="flex-1">
            <PhotoBooth />
          </main>
          <PrivacyNotice />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-white px-4 py-6">
      {/* Logo section */}
      <div className="w-full max-w-6xl mx-auto mb-8 md:mb-16">
        <div className="flex items-center gap-2">
          <img src={logo} alt="Snapify Logo" className="w-6 h-6 md:w-8 md:h-8" />
          <span className="font-medium text-lg md:text-xl" style={{ fontStyle: 'italic' }}>Snapify</span>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-col items-center max-w-3xl mx-auto text-right md:text-center flex-grow">
        <h1 className="text-[28px] md:text-[32px] font-medium mb-8 md:mb-16 tracking-tight px-4 leading-tight" style={{ fontStyle: 'italic' }}>
          Capture Every{'\n'}
          Moment,{'\n'}
          Anytime,{'\n'}
          Anywhere
        </h1>

        {/* Hero image with proper sizing and margin */}
        <div className="w-full flex items-center justify-center max-w-md md:max-w-2xl mb-8 md:mb-12 px-4">
          <img 
            src={hero} 
            alt="Photo collage" 
            width={500}
            height={500}
            className="object-contain"
          />
        </div>

        {/* Button with exact styling */}
        <Button 
          variant="default"
          className="bg-black hover:bg-black text-white rounded-lg px-8 py-4 text-base font-semibold"
          onClick={() => setShowPhotoBooth(true)}
        >
          Try now!
        </Button>
      </div>
    </div>
  );
}

export default App;