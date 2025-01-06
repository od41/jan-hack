import React, { createContext, useContext, useState } from 'react';
import { useAccount, useSignMessage } from 'wagmi';

export const BASE_BACKEND_URL =  import.meta.env.VITE_BACKEND_BASE_URL!;

// Define the context type
interface AppContextType {
    user: any; // Replace 'any' with your user type
    isLoggedIn: boolean;
    setIsLoggedIn: (isLoggedIn: boolean) => void    ;
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
        <AppContext.Provider value={{ user, isLoggedIn, setIsLoggedIn, startPool, joinPool, startSession, endSession, endPool, claimRewards }}>
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
