import React, { useState, useEffect } from 'react';

export const Countdown = ({ onComplete, duration = 3 }) => {
  const [count, setCount] = useState(duration);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (count === 0) {
      onComplete();
      return;
    }

    setIsAnimating(true);
    const animationTimer = setTimeout(() => {
      setIsAnimating(false);
    }, 200);

    const countTimer = setTimeout(() => {
      setCount(count - 1);
    }, 1000);

    return () => {
      clearTimeout(animationTimer);
      clearTimeout(countTimer);
    };
  }, [count, onComplete]);

  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div 
        className={`
          relative
          flex items-center justify-center
          w-24 h-24 md:w-32 md:h-32
          rounded-full
          bg-white bg-opacity-20
          transition-transform duration-200
          ${isAnimating ? 'scale-110' : 'scale-100'}
        `}
      >
        <span className={`
          text-5xl md:text-7xl
          font-bold
          text-white
          transition-opacity duration-200
          ${isAnimating ? 'opacity-0' : 'opacity-100'}
        `}>
          {count}
        </span>
        {/* Ripple effect */}
        <div className={`
          absolute inset-0
          rounded-full
          border-4 border-white border-opacity-40
          animate-ping
        `} />
      </div>
      <div className="absolute bottom-8 left-0 right-0 text-center">
        <p className="text-white text-sm md:text-base">
          Get ready for photo {Math.min(3, count + 1)}!
        </p>
      </div>
    </div>
  );
};
