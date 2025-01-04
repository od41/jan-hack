import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useWallet } from '../hooks/useWallet';
import { Button } from '../components/common/Button';

export const WalletConnectPage: React.FC = () => {
  const { wallet, connectWallet } = useWallet();
  const navigate = useNavigate();

  const handleConnect = async () => {
    await connectWallet();
    if (wallet.isConnected) {
      navigate('/pools');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-lg text-center">
        <h1 className="text-3xl font-bold mb-6">Welcome to Pool App</h1>
        <Button onClick={handleConnect}>
          Connect Wallet to Get Started
        </Button>
      </div>
    </div>
  );
};