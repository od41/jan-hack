import { Navigate, Outlet } from 'react-router-dom';
import { useSIWE } from 'connectkit';
import { Spinner } from './Layout/Spinner';

export const ProtectedRoute = () => {
    const { isSignedIn, isLoading } = useSIWE();

    if (isLoading) {
        return <Spinner />;
    }

    if (!isSignedIn) {
        return <Navigate to="/groups" replace />;
    }

    return <Outlet />;
}; 