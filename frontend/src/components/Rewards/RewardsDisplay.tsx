import React from 'react';

export const RewardsDisplay: React.FC = () => {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold mb-4">Your Rewards</h2>
      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-semibold">Current Rewards</h3>
          <p className="text-2xl font-bold text-green-600">0.00 ETH</p>
        </div>
        <div className="p-4 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-semibold">Group Multiplier</h3>
          <p className="text-2xl font-bold text-blue-600">1.0x</p>
        </div>
      </div>
      <button className="mt-4 w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg">
        Claim Rewards
      </button>
    </div>
  );
};
