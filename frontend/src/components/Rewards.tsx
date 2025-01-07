import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

interface ActivitySession {
  id: string;
  distance: number;
  duration: number;
  steps: number;
  date: string;
  yield: number;
}

export const Rewards: React.FC = () => {
  const { groupId } = useParams<{ groupId: string }>();
  const navigate = useNavigate();
  const [activitySessions, setActivitySessions] = useState<ActivitySession[]>([]);
  const [totalStats, setTotalStats] = useState({
    totalDistance: 0,
    totalDuration: 0,
    totalSteps: 0,
    totalYield: 0,
  });

  useEffect(() => {
    // TODO: Replace with actual API call
    const fetchActivitySessions = async () => {
      // Mock data for now
      const mockSessions: ActivitySession[] = [
        {
          id: '1',
          distance: 5200,
          duration: 1800,
          steps: 6760,
          date: '2024-03-20',
          yield: 52,
        },
        {
          id: '2',
          distance: 3100,
          duration: 1200,
          steps: 4030,
          date: '2024-03-19',
          yield: 31,
        },
      ];

      setActivitySessions(mockSessions);
      calculateTotalStats(mockSessions);
    };

    fetchActivitySessions();
  }, []);

  const calculateTotalStats = (sessions: ActivitySession[]) => {
    const totals = sessions.reduce(
      (acc, session) => ({
        totalDistance: acc.totalDistance + session.distance,
        totalDuration: acc.totalDuration + session.duration,
        totalSteps: acc.totalSteps + session.steps,
        totalYield: acc.totalYield + session.yield,
      }),
      { totalDistance: 0, totalDuration: 0, totalSteps: 0, totalYield: 0 }
    );
    setTotalStats(totals);
  };

  const formatDuration = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}m`;
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Summary Card */}
        <div className="bg-white rounded-xl p-6 shadow-md">
          <h2 className="text-2xl font-bold mb-6 text-center">Your Rewards Summary</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="bg-purple-50 p-4 rounded-lg">
              <p className="text-gray-600">Total Distance</p>
              <p className="text-xl font-bold text-purple-600">
                {(totalStats.totalDistance / 1000).toFixed(2)} km
              </p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <p className="text-gray-600">Total Duration</p>
              <p className="text-xl font-bold text-purple-600">
                {formatDuration(totalStats.totalDuration)}
              </p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <p className="text-gray-600">Total Steps</p>
              <p className="text-xl font-bold text-purple-600">
                {totalStats.totalSteps.toLocaleString()}
              </p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <p className="text-gray-600">Total Yield</p>
              <p className="text-xl font-bold text-purple-600">
                {totalStats.totalYield} F$
              </p>
            </div>
          </div>
        </div>

        {/* Activity History */}
        <div className="bg-white rounded-xl p-6 shadow-md">
          <h3 className="text-xl font-semibold mb-4">Activity History</h3>
          <div className="space-y-4">
            {activitySessions.map((session) => (
              <div
                key={session.id}
                className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50"
              >
                <div className="flex justify-between items-center">
                  <div className="space-y-1">
                    <p className="text-gray-600">{new Date(session.date).toLocaleDateString()}</p>
                    <div className="flex space-x-4">
                      <span className="text-sm text-gray-500">
                        {(session.distance / 1000).toFixed(2)} km
                      </span>
                      <span className="text-sm text-gray-500">
                        {formatDuration(session.duration)}
                      </span>
                      <span className="text-sm text-gray-500">
                        {session.steps.toLocaleString()} steps
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Yield</p>
                    <p className="font-semibold text-purple-600">{session.yield} F$</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={() => navigate(`/activity/${groupId}`)}
          className="w-full bg-purple-600 text-white py-3 rounded-full font-semibold hover:bg-purple-700"
        >
          Start New Activity
        </button>
      </div>
    </div>
  );
};