import React, { useEffect } from 'react';
import { useNavigate } from 'react-router';
import useRole from '../../../hooks/useRole';
import useAuth from '../../../hooks/useAuth';
import Loading from '../../../components/Loading/Loading';

const DashboardHome = () => {
  const { userRole, loading: roleLoading } = useRole();
  const { refreshUserRole, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Refresh user role when dashboard loads to ensure we have the latest role
    const refreshRole = async () => {
      try {
        await refreshUserRole();
      } catch (error) {
        console.error('Error refreshing user role:', error);
      }
    };
    
    refreshRole();
  }, [refreshUserRole]);

  useEffect(() => {
    // Don't redirect while loading
    if (roleLoading || authLoading) {
      return;
    }
    
    // Wait a bit more to ensure role is properly set
    const timer = setTimeout(() => {
      // Don't redirect if we don't have a user role yet
      if (!userRole) {
        return;
      }
      
      // Redirect based on user role
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
  }, [userRole, roleLoading, authLoading, navigate]);

  // Show loading spinner while determining role
  if (roleLoading || authLoading || !userRole) {
    return <Loading message="Determining your dashboard..." />;
  }

  // This component should never render content as it always redirects
  return <Loading message="Redirecting to your dashboard..." />;
};

export default DashboardHome;