import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Pool } from '../../types/wallet.types';
import { Button } from '../common/Button';
import { useWallet } from '../../hooks/useWallet';

interface JoinPoolFormProps {
  pool: Pool;
}

export const JoinPoolForm: React.FC<JoinPoolFormProps> = ({ pool }) => {
  const navigate = useNavigate();
  const { wallet } = useWallet();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleJoinPool = async () => {
    if (!wallet.isConnected) {
      navigate('/wallet-connect');
      return;
    }

    setIsSubmitting(true);
    try {
      // Handle joining pool logic here
      // This would involve interacting with your smart contract
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulated delay
      navigate('/pools');
    } catch (error) {
      console.error('Error joining pool:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold mb-4">Join Pool: {pool.name}</h2>
      <div className="space-y-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Entry Fee</label>
          <p className="text-lg font-semibold">{pool.entryFee} ETH</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Your Wallet</label>
          <p className="text-lg font-semibold">{wallet.address}</p>
        </div>
      </div>
      <Button
        onClick={handleJoinPool}
        disabled={isSubmitting || !wallet.isConnected}
        className="w-full"
      >
        {isSubmitting ? 'Processing...' : 'Confirm & Pay'}
      </Button>
    </div>
  );
};