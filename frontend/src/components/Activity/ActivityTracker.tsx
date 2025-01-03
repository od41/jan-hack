import React, { useState } from 'react';
import { Activity } from '../../types';

export const ActivityTracker: React.FC = () => {
  const [isTracking, setIsTracking] = useState(false);
  const [currentActivity, setCurrentActivity] = useState<Partial<Activity>>({
    steps: 0,
    gpsData: []
  });

  const startActivity = () => {
    setIsTracking(true);
    // Initialize GPS tracking
    if ('geolocation' in navigator) {
      navigator.geolocation.watchPosition((position) => {
        setCurrentActivity((prev) => ({
          ...prev,
          gpsData: [
            ...(prev.gpsData || []),
            {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              timestamp: Date.now()
            }
          ]
        }));
      });
    }
  };

  const stopActivity = async () => {
    setIsTracking(false);
    // Submit activity data
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold mb-4">Activity Tracker</h2>
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <span>Steps: {currentActivity.steps}</span>
          <button
            onClick={isTracking ? stopActivity : startActivity}
            className={`px-6 py-2 rounded-lg ${
              isTracking
                ? 'bg-red-500 hover:bg-red-600'
                : 'bg-green-500 hover:bg-green-600'
            } text-white`}
          >
            {isTracking ? 'Stop Activity' : 'Start Activity'}
          </button>
        </div>
        {isTracking && (
          <div className="mt-4">
            <p>GPS Data Points: {currentActivity.gpsData?.length || 0}</p>
            {/* Add map visualization here */}
          </div>
        )}
      </div>
    </div>
  );
};
