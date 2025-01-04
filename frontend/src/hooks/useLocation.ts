import { useState, useEffect, useCallback } from 'react';
import type { Location, NearbyUser } from '../types/location.types';

export const useLocation = () => {
  const [currentLocation, setCurrentLocation] = useState<Location | null>(null);
  const [locationError, setLocationError] = useState<string>('');
  const [watching, setWatching] = useState(false);
  const [watchId, setWatchId] = useState<number | null>(null);

  const startWatching = useCallback(() => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser');
      return;
    }

    const id = navigator.geolocation.watchPosition(
      (position) => {
        setCurrentLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          timestamp: position.timestamp,
        });
        setLocationError('');
      },
      (error) => {
        setLocationError(error.message);
      },
      {
        enableHighAccuracy: true,
        maximumAge: 0,
        timeout: 5000,
      }
    );

    setWatchId(id);
    setWatching(true);
  }, []);

  const stopWatching = useCallback(() => {
    if (watchId !== null) {
      navigator.geolocation.clearWatch(watchId);
      setWatchId(null);
      setWatching(false);
    }
  }, [watchId]);

  useEffect(() => {
    return () => {
      stopWatching();
    };
  }, [stopWatching]);

  return {
    currentLocation,
    locationError,
    watching,
    startWatching,
    stopWatching,
  };
};