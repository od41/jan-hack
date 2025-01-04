import React from 'react';
import { useStepCounter } from '../../hooks/useStepCounter';

export const StepCounter: React.FC = () => {
  const { steps, available } = useStepCounter();

  if (!available) {
    return (
      <div className="bg-yellow-50 p-4 rounded-lg">
        <p className="text-yellow-700">
          Step counting is not available on your device.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h3 className="text-2xl font-bold text-gray-800">Your Activity</h3>
      <div className="mt-4 flex items-center">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
          <svg
            className="w-8 h-8 text-blue-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 10V3L4 14h7v7l9-11h-7z"
            />
          </svg>
        </div>
        <div className="ml-4">
          <p className="text-4xl font-bold text-gray-800">{steps}</p>
          <p className="text-gray-600">Steps today</p>
        </div>
      </div>
    </div>
  );
};