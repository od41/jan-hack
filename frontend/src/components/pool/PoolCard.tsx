import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Pool } from '../../types/wallet.types';
import { Button } from '../common/Button';

interface PoolCardProps {
  pool: Pool;
}

export const PoolCard: React.FC<PoolCardProps> = ({ pool }) => {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
      <h3 className="text-xl font-semibold mb-2">{pool.name}</h3>
      <div className="space-y-2 mb-4">
        <p className="text-gray-600">Entry Fee: {pool.entryFee} ETH</p>
        <p className="text-gray-600">
          Participants: {pool.currentParticipants}/{pool.totalParticipants}
        </p>
        <p className="text-gray-600">
          Deadline: {new Date(pool.deadline).toLocaleDateString()}
        </p>
      </div>
      <Button
        onClick={() => navigate(`/pool/${pool.id}/join`)}
        className="w-full"
      >
        Join Pool
      </Button>
    </div>
  );
};