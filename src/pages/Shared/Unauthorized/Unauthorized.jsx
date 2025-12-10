import React from 'react';
import { Link } from 'react-router';

const Unauthorized = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-red-100 dark:from-gray-800 dark:to-gray-900">
      <div className="text-center p-8 rounded-2xl shadow-xl bg-white dark:bg-gray-800 max-w-2xl mx-4">
        <div className="mb-8">
          <svg 
            className="w-32 h-32 mx-auto text-red-500 dark:text-red-400" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth="1.5" 
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            ></path>
          </svg>
        </div>
        
        <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-4">Access Denied</h1>
        <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-4">Unauthorized Access</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-8 text-lg">
          You don't have permission to view this page. Please contact your administrator if you believe this is an error.
        </p>
        
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link 
            to="/" 
            className="px-6 py-3 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors shadow-md hover:shadow-lg"
          >
            Go Home
          </Link>
          <Link 
            to="/dashboard" 
            className="px-6 py-3 bg-gray-200 text-gray-800 font-medium rounded-lg hover:bg-gray-300 transition-colors dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
          >
            Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;