import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import useRole from '../../../hooks/useRole';
import useAuth from '../../../hooks/useAuth';
import Loading from '../../../components/Loading/Loading';

const DashboardHome = () => {
  const { userRole, loading: roleLoading } = useRole();
  const { refreshUserRole, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [roleRefreshed, setRoleRefreshed] = useState(false);

  useEffect(() => {
    // Refresh user role when dashboard loads to ensure we have the latest role
    const refreshRole = async () => {
      try {
        await refreshUserRole();
        setRoleRefreshed(true);
      } catch (error) {
        console.error('Error refreshing user role:', error);
        setRoleRefreshed(true); // Still set to true to prevent infinite waiting
      }
    };
    
    refreshRole();
  }, [refreshUserRole]);

  useEffect(() => {
    // Don't redirect while loading or waiting for role refresh
    if (roleLoading || authLoading || !roleRefreshed) {
      return;
    }
    
    // Wait a bit more to ensure role is properly set
    const timer = setTimeout(() => {
      // Redirect based on user role
      // Even if userRole is null/undefined, we still redirect to prevent hanging
      if (userRole === 'admin') {
        navigate('/dashboard/admin');
      } else if (userRole === 'manager') {
        navigate('/dashboard/manager');
      } else {
        // Default to borrower dashboard
        navigate('/dashboard/borrower');
      }
    }, 100); // Small delay to ensure state updates
    
    return () => clearTimeout(timer);
  }, [userRole, roleLoading, authLoading, navigate, roleRefreshed]);

  // Show loading spinner while determining role
  if (roleLoading || authLoading || !roleRefreshed) {
    return <Loading message="Determining your dashboard..." />;
  }

  // This component should never render content as it always redirects
  return <Loading message="Redirecting to your dashboard..." />;
};

export default DashboardHome;