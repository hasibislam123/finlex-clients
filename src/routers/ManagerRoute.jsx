import React, { useEffect } from 'react';
import { Navigate } from 'react-router';
import useAuth from '../hooks/useAuth';
import useRole from '../hooks/useRole';
import Loading from '../components/Loading/Loading';

const ManagerRoute = ({ children }) => {
    const { user, loading, refreshUserRole } = useAuth();
    const { userRole, isManager, loading: roleLoading } = useRole();
    
    useEffect(() => {
        // If we have a user but no role, try to refresh the role
        if (user && !userRole && !roleLoading) {
            refreshUserRole();
        }
    }, [user, userRole, roleLoading, refreshUserRole]);

    // Show loading spinner while determining authentication state
    if (loading || roleLoading || (user && !userRole)) {
        return <Loading message="Verifying manager access..." />;
    }

    // If user is not authenticated, redirect to login
    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // Check if user is manager
    if (!isManager()) {
        return <Navigate to="/unauthorized" replace />;
    }

    return children;
};

export default ManagerRoute;