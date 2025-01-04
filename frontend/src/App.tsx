import { MainLayout } from './components/Layout/MainLayout';
import { ActivityTracker } from './components/Activity/ActivityTracker';
import { RewardsDisplay } from './components/Rewards/RewardsDisplay';
import { Web3Provider } from './contexts/Web3Provider';

function App() {
  return (
    <Web3Provider>
      <MainLayout>
        <div className="space-y-8">
          <ActivityTracker />
          <RewardsDisplay />
        </div>
      </MainLayout>
    </Web3Provider>
  );
}

export default App;