import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage } from './Pages/LoginPage';
import { SignupPage } from './Pages/SignupPage';
import { WalletConnectPage } from './Pages/WalletConnectPage';
import { PoolListPage } from './Pages/PoolistPage';
import { JoinPoolPage } from './Pages/JoinPoolPage';
import {ActivityTrackingPage} from './Pages/ActivityTrackingPage';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/wallet-connect" element={<WalletConnectPage />} />
        <Route path="/pools" element={<PoolListPage />} />
        <Route path="/activity" element={<ActivityTrackingPage />} />
        <Route path="/pool/:poolId/join" element={<JoinPoolPage />} />
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
};

export default App;