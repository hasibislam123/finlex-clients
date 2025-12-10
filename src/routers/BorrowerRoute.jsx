import React from 'react';
import { Navigate } from 'react-router';
import useAuth from '../hooks/useAuth';
import useRole from '../hooks/useRole';
import Loading from '../components/Loading/Loading';

const BorrowerRoute = ({ children }) => {
    const { user, loading } = useAuth();
    const { isBorrower, loading: roleLoading } = useRole();

    if (loading || roleLoading) {
        return <Loading />;
    }

    if (!user || !isBorrower()) {
        return <Navigate to="/unauthorized" replace />;
    }

    return children;
};

export default BorrowerRoute;