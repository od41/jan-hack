import React from 'react';
import { useWallet } from '../../hooks/useWallet';
import { Button } from './Button';
import { formatAddress } from '../../utils/wallet.utils';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { wallet, disconnectWallet } = useWallet();

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Pool App</h1>
          {wallet.isConnected && (
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">
                {formatAddress(wallet.address)}
              </span>
              <Button variant="secondary" onClick={disconnectWallet}>
                Disconnect
              </Button>
            </div>
          )}
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
};