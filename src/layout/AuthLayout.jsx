import React from 'react';
import { Outlet } from 'react-router';


const AuthLayout = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-gray-100">
      <Outlet />
    </div>
  );
};

export default AuthLayout;