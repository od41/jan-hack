import React from 'react';
import { useLocation } from '../../hooks/useLocation';
import { useNearbyUsers } from '../../hooks/useNearbyUsers';
import { formatDistance } from '../../utils/location.utils';

export const NearbyUsers: React.FC = () => {
  const { currentLocation } = useLocation();
  const nearbyUsers = useNearbyUsers(currentLocation);

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg mt-6">
      <h3 className="text-2xl font-bold text-gray-800">Nearby Users</h3>
      <div className="mt-4 space-y-4">
        {nearbyUsers.length === 0 ? (
          <p className="text-gray-600">No users nearby</p>
        ) : (
          nearbyUsers.map((user) => (
            <div
              key={user.userId}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
            >
              <div>
                <p className="font-semibold text-gray-800">{user.userName}</p>
                <p className="text-gray-600">{formatDistance(user.distance)} away</p>
              </div>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Walk Together
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};