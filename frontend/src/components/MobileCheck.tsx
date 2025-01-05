import React, { ReactNode } from 'react';
import { isMobile } from 'react-device-detect';
import QRCode from 'react-qr-code';

interface MobileCheckProps {
  children: ReactNode;
}

const MobileCheck: React.FC<MobileCheckProps> = ({ children }) => {
  if (!isMobile && false) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-gradient-to-r from-purple-600 to-blue-500">
        <div className="bg-white p-8 rounded-2xl shadow-xl text-center max-w-md">
          <h1 className="text-2xl font-bold mb-4">📱 Mobile Only Experience</h1>
          <p className="text-gray-600">
            FitChain is designed for mobile devices. Please open this app on your phone to start your fitness journey!
          </p>
          <div className="mt-6">
            <QRCode value={window.location.href} size={200} />
          </div>
        </div>
      </div>
    );
  }
  return <>{children}</>;
};

export default MobileCheck; 