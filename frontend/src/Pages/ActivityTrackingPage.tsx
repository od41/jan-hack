import React, { useEffect } from 'react';
import { Layout } from '../components/common/Layout';
import { StepCounter } from '../components/activity/StepCounter';
import { NearbyUsers } from '../components/activity/NearbyUsers';
import { ActivityMap } from '../components/activity/ActivityMap';
import { useLocation } from '../hooks/useLocation';

export const ActivityTrackingPage: React.FC = () => {
  const { startWatching, stopWatching, locationError } = useLocation();

  useEffect(() => {
    startWatching();
    return () => stopWatching();
  }, [startWatching, stopWatching]);

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        {locationError && (
          <div className="bg-red-50 p-4 rounded-lg mb-6">
            <p className="text-red-700">{locationError}</p>
          </div>
        )}
        
        <StepCounter />
        <NearbyUsers />
        <ActivityMap />
      </div>
    </Layout>
  );
};