import React from 'react';
import { Navigate } from 'react-router';
import useAuth from '../hooks/useAuth';
import useRole from '../hooks/useRole';
import Loading from '../components/Loading/Loading';

const AdminRoute = ({ children }) => {
    const { user, loading } = useAuth();
    const { isAdmin, loading: roleLoading } = useRole();

    if (loading || roleLoading) {
        return <Loading />;
    }

    if (!user || !isAdmin()) {
        return <Navigate to="/unauthorized" replace />;
    }

    return children;
};

export default AdminRoute;