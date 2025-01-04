import { MainLayout } from './components/Layout/MainLayout';
import { ActivityTracker } from './components/Activity/ActivityTracker';
import { RewardsDisplay } from './components/Rewards/RewardsDisplay';
import { CombinedProvider } from './contexts/CombinedProvider';

function App() {
  return (
    <CombinedProvider>
      <MainLayout>
        <div className="space-y-8">
          <ActivityTracker />
          <RewardsDisplay />
        </div>
      </MainLayout>
    </CombinedProvider>
  );
}

export default App;