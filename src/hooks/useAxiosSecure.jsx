import axios from 'axios';
import React from 'react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router'; 
import useAuth from './useAuth';

// Use environment variable for baseURL
const baseURL = import.meta.env.VITE_API_URL || 'https://finlex-server.vercel.app';

const axiosSecure = axios.create({
   baseURL: baseURL
})

const useAxiosSecure = () => {
   const { user, getIdToken, logOut, refreshUserRole } = useAuth();
   const navigate = useNavigate();
   
   useEffect(() => {
      // interceptor request
      const reqInterceptor = axiosSecure.interceptors.request.use(async (config) => {
         if (user) {
            try {
               // Force refresh the token to ensure it's valid after page reloads
               const token = await getIdToken(true);
               if (token) {
                  config.headers.Authorization = `Bearer ${token}`;
               }
            } catch (error) {
               console.error('Error getting token:', error);
            }
         }
         return config;
      }, (error) => {
         return Promise.reject(error);
      });

      // interceptor response
      const resInterceptor = axiosSecure.interceptors.response.use((response) => {
         return response;
      }, async (error) => {
         console.log('Axios error:', error);

         const statusCode = error.response?.status;
         if (statusCode === 401 || statusCode === 403) {
            // First, try to refresh the user role and token to see if the user still has access
            try {
               await refreshUserRole();
               const token = await getIdToken(true);
               
               // If we get a new token, retry the original request
               if (token && error.config) {
                  error.config.headers.Authorization = `Bearer ${token}`;
                  return axiosSecure.request(error.config);
               } else {
                  // If no token available, then proceed with logout
                  await logOut();
                  navigate('/login');
               }
            } catch (refreshError) {
               console.error('Error during token refresh:', refreshError);
               await logOut();
               navigate('/login');
            }
         }

         return Promise.reject(error);
      })

      return () => {
         axiosSecure.interceptors.request.eject(reqInterceptor);
         axiosSecure.interceptors.response.eject(resInterceptor);
      }
   }, [user, getIdToken, logOut, refreshUserRole, navigate])

   return axiosSecure;
};

export default useAxiosSecure;