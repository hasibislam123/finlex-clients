import React, { useContext } from 'react';
import { AuthContext } from '../context/Authcontext/AuthContext';

const useRole = () => {
  const { userRole, loading } = useContext(AuthContext);
  
  const hasRole = (role) => {
    return userRole === role;
  };
  
  const isAdmin = () => {
    return userRole === 'admin';
  };
  
  const isManager = () => {
    return userRole === 'manager';
  };
  
  const isBorrower = () => {
    return userRole === 'borrower' || !userRole;
  };
  
  return {
    userRole,
    loading,
    hasRole,
    isAdmin,
    isManager,
    isBorrower
  };
};

export default useRole;