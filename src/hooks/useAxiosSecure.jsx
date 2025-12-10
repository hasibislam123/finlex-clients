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
   const { user, getIdToken, logOut } = useAuth();
   const navigate = useNavigate();
   
   useEffect(() => {
      // interceptor request
      const reqInterceptor = axiosSecure.interceptors.request.use(async (config) => {
         if (user) {
            try {
               const token = await getIdToken();
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
            try {
               await logOut();
               navigate('/login');
            } catch (logoutError) {
               console.error('Error during logout:', logoutError);
               navigate('/login');
            }
         }

         return Promise.reject(error);
      })

      return () => {
         axiosSecure.interceptors.request.eject(reqInterceptor);
         axiosSecure.interceptors.response.eject(resInterceptor);
      }
   }, [user, getIdToken, logOut, navigate])

   return axiosSecure;
};

export default useAxiosSecure;