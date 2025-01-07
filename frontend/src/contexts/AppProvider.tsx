import React, { createContext, useContext } from 'react';

export const BASE_BACKEND_URL = import.meta.env.VITE_BACKEND_BASE_URL!;

// Define the context type
interface AppContextType {
    user?: any; // Replace 'any' with your user type
    isLoggedIn?: boolean;
    setIsLoggedIn?: (isLoggedIn: boolean) => void;
    startPool?: () => void;
    joinPool?: (poolId: string) => void;
    startSession?: () => void;
    endSession?: () => void;
    endPool?: () => void;
    claimRewards?: () => void;
}

// Create the context
const AppContext = createContext<AppContextType | undefined>(undefined);

// Create the provider component
export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {


    return (
        <AppContext.Provider value={null}>
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
