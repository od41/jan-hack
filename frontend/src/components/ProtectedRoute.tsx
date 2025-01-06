import { Navigate, Outlet } from 'react-router-dom';
import { useAccount } from 'wagmi';
import { useSIWE } from 'connectkit';

export const ProtectedRoute = () => {
    const { isConnected } = useAccount();
    const { isSignedIn, isLoading } = useSIWE();
    console.log('isSignedIn', isSignedIn, isLoading)

    // Show loading state while checking authentication
    if (isLoading) {
        return <div>Loading...</div>; // You might want to use a proper loading component
    }

    // Check both wallet connection and SIWE authentication
    if (!isSignedIn) {
        return <Navigate to="/groups" replace />;
    }

    return <Outlet />;
}; 