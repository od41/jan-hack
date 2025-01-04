import { useState, useEffect } from 'react';

export const useStepCounter = () => {
  const [steps, setSteps] = useState(0);
  const [available, setAvailable] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Check if the Web Sensors API is available
      if ('Accelerometer' in window) {
        setAvailable(true);
        // Initialize step detection algorithm
        try {
          // @ts-ignore - TypeScript doesn't know about Accelerometer yet
          const accelerometer = new Accelerometer({ frequency: 60 });
          
          accelerometer.addEventListener('reading', () => {
            // Simple step detection algorithm
            // In a real app, you'd want a more sophisticated algorithm
            const magnitude = Math.sqrt(
              Math.pow(accelerometer.x, 2) +
              Math.pow(accelerometer.y, 2) +
              Math.pow(accelerometer.z, 2)
            );
            
            // Detect step based on acceleration magnitude
            if (magnitude > 15) { // threshold for step detection
              setSteps(prev => prev + 1);
            }
          });
          
          accelerometer.start();
        } catch (error) {
          console.error('Error accessing accelerometer:', error);
        }
      }
    }
  }, []);

  const resetSteps = () => {
    setSteps(0);
  };

  return {
    steps,
    available,
    resetSteps,
  };
};