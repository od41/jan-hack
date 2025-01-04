import { useState, useEffect } from 'react';
import { calculateDistance } from '../utils/location.utils';
import type { Location, UserLocation, NearbyUser } from '../types/location.types';

// Change the parameter type to Location since that's what useLocation returns
export const useNearbyUsers = (currentLocation: Location | null) => {
  const [nearbyUsers, setNearbyUsers] = useState<NearbyUser[]>([]);

  useEffect(() => {
    if (!currentLocation) return;

    const fetchNearbyUsers = async () => {
      try {
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

    const interval = setInterval(fetchNearbyUsers, 30000);
    fetchNearbyUsers(); // Initial fetch

    return () => clearInterval(interval);
  }, [currentLocation]);

  return nearbyUsers;
};