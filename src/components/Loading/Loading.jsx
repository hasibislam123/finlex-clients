import React, { useState, useEffect } from 'react';
import Lottie from 'lottie-react';

const Loading = ({ 
  width = "200px", 
  height = "200px", 
  message = "Loading...", 
  showText = true 
}) => {
  const [animationData, setAnimationData] = useState(null);

  useEffect(() => {
    // Fetch the animation data
    fetch('/Bank%20Loan.json')
      .then(response => {
        // Check if response is OK and content type is JSON
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          throw new Error('Response is not JSON');
        }
        return response.json();
      })
      .then(data => setAnimationData(data))
      .catch(error => {
        console.error('Error loading animation:', error);
        // Animation will fall back to spinner
      });
  }, []);

  if (!animationData) {
    // Fallback to a simple spinner if animation hasn't loaded
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-white dark:bg-gray-900">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[#538d22]"></div>
        {showText && (
          <p className="mt-4 text-lg font-medium text-gray-700 dark:text-gray-300">
            {message}
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white dark:bg-gray-900">
      <div className="relative" style={{ width, height }}>
        <Lottie 
          animationData={animationData} 
          loop={true} 
          autoplay={true}
        />
      </div>
      {showText && (
        <p className="mt-4 text-lg font-medium text-gray-700 dark:text-gray-300">
          {message}
        </p>
      )}
    </div>
  );
};

export default Loading;