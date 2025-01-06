import React from 'react';
import { MyConnectButton } from '../MyConnectButton';
// import './Navbar.css'; // Assuming you have a CSS file for styling

export const Navbar: React.FC = () => {
    return (
        <nav className="fixed top-0 left-0 w-full bg-white border-b border-gray-200">
            <div className="flex items-center justify-between px-4 py-3">
                <div className="flex items-center">
                    <p className="text-xl font-bold text-gray-800">FitFi</p>
                </div>
                <div>
                    <MyConnectButton />
                </div>
            </div>
        </nav>
    );
};


