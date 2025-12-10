import React from 'react';
import { FiAlertTriangle } from 'react-icons/fi'; 

const ForbiddenName = ({ name }) => {
   return (
      <div className="flex flex-col items-center justify-center min-h-[300px] bg-red-50 border border-red-200 rounded-xl p-8 shadow-md text-center">
         <FiAlertTriangle className="text-red-500 text-6xl mb-4 animate-pulse" />
         <h1 className="text-2xl font-bold text-red-700 mb-2">Forbidden !</h1>
         <p className="text-red-600">
            Sorry, the name <span className="font-semibold">{name}</span> is not allowed.
         </p>
         <p className="mt-2 text-sm text-red-500">
            Please choose a different name to continue.
         </p>
      </div>
   );
};

export default ForbiddenName;