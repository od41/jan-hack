import React from 'react';
import { MyConnectButton } from '../MyConnectButton';
// import './Navbar.css'; // Assuming you have a CSS file for styling

export const Navbar: React.FC = () => {
    return (
        <nav className="navbar">
            <div className="navbar-content">
                <div className="logo">
                    {/* Logo goes here */}
                    <p>FitFi</p>
                </div>
                <div className="connect-button">
                    <MyConnectButton />
                </div>
            </div>
        </nav>
    );
};


