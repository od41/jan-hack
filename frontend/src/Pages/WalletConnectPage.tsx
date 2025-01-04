import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/common/Button';
import { useWallet } from '../hooks/useWallet';

export const WalletConnectPage: React.FC = () => {
  const navigate = useNavigate();
  const { connectWallet } = useWallet();

  const handleConnect = async () => {
    const success = await connectWallet();
    if (success) {
      navigate('/pools');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full p-8 bg-white rounded-xl shadow-lg text-center">
        <h1 className="text-3xl font-bold mb-6">Connect Your Wallet</h1>
        <p className="text-gray-600 mb-8">
          Connect your wallet to access and join pools.
        </p>
        <Button onClick={handleConnect} className="w-full">
          Connect Wallet to Get Started
        </Button>
      </div>
    </div>
  );
};
