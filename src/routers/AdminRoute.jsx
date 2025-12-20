import React from 'react';
import { Navigate } from 'react-router';
import useAuth from '../hooks/useAuth';
import useRole from '../hooks/useRole';
import Loading from '../components/Loading/Loading';

const AdminRoute = ({ children }) => {
    const { user, loading } = useAuth();
    const { userRole, isAdmin, loading: roleLoading } = useRole();

    // Show loading spinner while determining authentication state
    if (loading || roleLoading) {
        return <Loading message="Verifying access permissions..." />;
    }

    // If user is not authenticated, redirect to login
    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // If user role is still not determined, show loading
    if (!userRole) {
        return <Loading message="Loading user permissions..." />;
    }

    // Check if user is admin
    if (!isAdmin()) {
        return <Navigate to="/unauthorized" replace />;
    }

    return children;
};
export default AdminRoute;