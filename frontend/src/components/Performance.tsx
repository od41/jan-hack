import React from 'react';
import { useParams } from 'react-router-dom';
import { Activity } from '../types';

export const Performance: React.FC = () => {
    const { groupId } = useParams<{ groupId: string }>();

    // Mock activities data - replace with actual data fetching
    const activities: Activity[] = [
        {
            id: '1',
            timestamp: Date.now() - 86400000,
            distance: 5200,
            duration: 1800,
            steps: 6500,
            groupId: groupId || ''
        },
        // Add more activities...
    ];

    const totalDistance = activities.reduce((sum, act) => sum + act.distance, 0);
    const totalDuration = activities.reduce((sum, act) => sum + act.duration, 0);
    const totalSteps = activities.reduce((sum, act) => sum + act.steps, 0);

    return (
        <div className="min-h-screen bg-gray-100 p-4">
            <h1 className="text-2xl font-bold mb-6">Your Performance</h1>

            <div className="bg-white rounded-xl p-6 shadow-md mb-6">
                <h2 className="text-xl font-semibold mb-4">Summary</h2>
                <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                        <p className="text-gray-600">Total Distance</p>
                        <p className="text-xl font-bold">{(totalDistance / 1000).toFixed(2)} km</p>
                    </div>
                    <div>
                        <p className="text-gray-600">Total Time</p>
                        <p className="text-xl font-bold">
                            {Math.floor(totalDuration / 3600)}h {Math.floor((totalDuration % 3600) / 60)}m
                        </p>
                    </div>
                    <div>
                        <p className="text-gray-600">Total Steps</p>
                        <p className="text-xl font-bold">{totalSteps}</p>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-md">
                <h2 className="text-xl font-semibold mb-4">Recent Activities</h2>
                <div className="space-y-4">
                    {activities.map((activity) => (
                        <div key={activity.id} className="border-b pb-4">
                            <div className="flex justify-between items-center mb-2">
                                <span className="font-semibold">
                                    {new Date(activity.timestamp).toLocaleDateString()}
                                </span>
                                <span className="text-purple-600 font-semibold">
                                    {(activity.distance / 1000).toFixed(2)} km
                                </span>
                            </div>
                            <div className="flex space-x-4 text-sm text-gray-600">
                                <span>⏱️ {Math.floor(activity.duration / 60)} min</span>
                                {/* <span>👣 {activity.steps} steps</span> */}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
