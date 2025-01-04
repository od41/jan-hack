import React, { createContext, useContext, useState } from 'react';
import { useAccount, useSignMessage } from 'wagmi';

const BASE_BACKEND_URL =  import.meta.env.VITE_BACKEND_BASE_URL!;

// Define the context type
interface AppContextType {
    user: any; // Replace 'any' with your user type
    isLoggedIn: boolean;
    register: (userData: any) => Promise<void>; // Replace 'any' with your user data type
    login: () => Promise<void>; // Replace 'any' with your credentials type
    startPool: () => void;
    joinPool: (poolId: string) => void;
    startSession: () => void;
    endSession: () => void;
    endPool: () => void;
    claimRewards: () => void;
}

// Create the context
const AppContext = createContext<AppContextType | undefined>(undefined);

// Create the provider component
export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<any>(null); // Replace 'any' with your user type
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

    const { signMessage } = useSignMessage()
    const { address: walletAddress }  = useAccount()


    const register = async (userData: any) => {
        // Implement registration logic
    };

    const login = async () => {
        const message = "Welcome to FitFi";

        // Sign the message (this is a placeholder, replace with actual signing logic)
        const signature = await signMessage({
            account:walletAddress, 
            message
        });

        try {
            // Send the wallet address and signature to the backend
        const response = await fetch(`${BASE_BACKEND_URL}/api/users/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
                wallet_address: walletAddress, 
                signature,
                message
             }),
        });

        if (response.ok) {
            const data = await response.json();
            setUser(data.user); // Assuming the response contains user data
            setIsLoggedIn(true);
        }
            
        } catch (error) {
            console.log(error)
        }

        
    };

    const startPool = () => {
        // Implement start pool logic
    };

    const joinPool = (poolId: string) => {
        // Implement join pool logic
    };

    const startSession = () => {
        // Implement start session logic
    };

    const endSession = () => {
        // Implement end session logic
    };

    const endPool = () => {
        // Implement end pool logic
    };

    const claimRewards = () => {
        // Implement claim rewards logic
    };

    return (
        <AppContext.Provider value={{ user, isLoggedIn, register, login, startPool, joinPool, startSession, endSession, endPool, claimRewards }}>
            {children}
        </AppContext.Provider>
    );
};

// Create the custom hook
export const useApp = () => {
    const context = useContext(AppContext);
    if (context === undefined) {
        throw new Error('useApp must be used within an AppProvider');
    }
    return context;
};
