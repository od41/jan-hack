import React, { useState, useEffect } from 'react';
import { MyConnectButton } from './MyConnectButton';
import { useSIWE } from 'connectkit';
import { useNavigate } from 'react-router-dom';

interface ConnectWalletProps {
}

const backgrounds: string[] = [
  '/assets/running-group.jpg',
  '/assets/fitness-community.jpg',
  '/assets/rewards.jpg'
];

export const ConnectWalletPage: React.FC<ConnectWalletProps> = () => {
  const [currentBg, setCurrentBg] = useState<number>(0);
  const {isSignedIn} = useSIWE();
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBg((prev) => (prev + 1) % backgrounds.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // if (isSignedIn) {
  //   navigate('/groups');
  // }

  return (
    <div className="relative h-screen w-screen">
      <div 
        className="absolute inset-0 bg-cover bg-center transition-opacity duration-1000"
        style={{ backgroundImage: `url(${backgrounds[currentBg]})` }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center px-6">
          <h1 className="text-4xl font-bold text-white mb-4">FitChain</h1>
          <p className="text-xl text-white mb-8 text-center">
            Run Together, Earn Together 🏃‍♂️💰
          </p>
          <MyConnectButton />
        </div>
      </div>
    </div>
  );
};
