import React from 'react';
// import { Navbar } from './Navbar';
// import { Footer } from './Footer';
import { ConnectKitButton } from 'connectkit';
import { useAccount } from "wagmi";

export const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const {isConnected} = useAccount()
  return (
    <div className="min-h-screen bg-gray-100">
      {/* <Navbar /> */}
      <main className="container mx-auto px-4 py-8">
        {isConnected ? children : <ConnectKitButton />}
      </main>
      {/* <Footer /> */}
    </div>
  );
};