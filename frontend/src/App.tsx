import React from 'react';
import { WalletProvider } from './contexts/WalletContext';
import { MainLayout } from './components/Layout/MainLayout';
import { ActivityTracker } from './components/Activity/ActivityTracker';
import { RewardsDisplay } from './components/Rewards/RewardsDisplay';

function App() {
  return (
    <WalletProvider>
      <MainLayout>
        <div className="space-y-8">
          <ActivityTracker />
          <RewardsDisplay />
        </div>
      </MainLayout>
    </WalletProvider>
  );
}

export default App;