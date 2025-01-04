import { useState, useEffect } from 'react';
import type { UserLocation, NearbyUser } from '../types/location.types';
import { calculateDistance } from '../utils/location.utils';

export const useNearbyUsers = (currentLocation: Location | null) => {
  const [nearbyUsers, setNearbyUsers] = useState<NearbyUser[]>([]);

  useEffect(() => {
    if (!currentLocation) return;

    // In a real app, this would be a WebSocket or regular API call
    const fetchNearbyUsers = async () => {
      try {
        // Simulated API call
        const response = await fetch('/api/nearby-users', {
          method: 'POST',
          body: JSON.stringify(currentLocation),
        });
        const users: UserLocation[] = await response.json();
        
        const nearby = users.map(user => ({
          userId: user.userId,
          userName: user.userName,
          distance: calculateDistance(
            currentLocation.latitude,
            currentLocation.longitude,
            user.latitude,
            user.longitude
          ),
          location: {
            latitude: user.latitude,
            longitude: user.longitude,
            timestamp: user.timestamp,
          },
        }));

        setNearbyUsers(nearby);
      } catch (error) {
        console.error('Error fetching nearby users:', error);
      }
    };

    const interval = setInterval(fetchNearbyUsers, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, [currentLocation]);

  return nearbyUsers;
};