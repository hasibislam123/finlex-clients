import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router';
import useAuth from '../hooks/useAuth';
import useRole from '../hooks/useRole';
import Loading from '../components/Loading/Loading';

const ManagerRoute = ({ children }) => {
    const { user, loading, refreshUserRole } = useAuth();
    const { userRole, isManager, loading: roleLoading } = useRole();
    const [retryCount, setRetryCount] = useState(0);
    const [isRefreshing, setIsRefreshing] = useState(false);
    
    useEffect(() => {
        // If we have a user but no role or it's still the default borrower role, refresh the role
        if (user && (!userRole || userRole === 'borrower') && !isRefreshing && retryCount < 3) {
            setIsRefreshing(true);
            const timer = setTimeout(async () => {
                try {
                    await refreshUserRole();
                } catch (error) {
                    console.error('Error refreshing user role:', error);
                } finally {
                    setRetryCount(prev => prev + 1);
                    setIsRefreshing(false);
                }
            }, 300); // Reduced timeout for faster response
            
            return () => clearTimeout(timer);
        }
    }, [user, userRole, refreshUserRole, retryCount, isRefreshing]);

    // Show loading spinner while determining authentication state
    if (loading || roleLoading || (user && (!userRole || userRole === 'borrower') && retryCount < 3 && isRefreshing)) {
        return <Loading message="Verifying manager access..." />;
    }

    // If user is not authenticated, redirect to login
    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // Check if user is manager - if role is still loading, we wait but don't redirect yet
    if (!isManager() && userRole && userRole !== 'borrower') {
        return <Navigate to="/unauthorized" replace />;
    }

    // If user role is still borrower after retries, they don't have manager access
    if (retryCount >= 3 && userRole === 'borrower') {
        return <Navigate to="/unauthorized" replace />;
    }

    // If user is a manager, render the children
    if (isManager()) {
        return children;
    }

    // If role is still being determined, show loading
    return <Loading message="Verifying manager access..." />;
};

export default ManagerRoute;