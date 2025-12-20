import React, { useEffect, useState } from 'react';

import { createUserWithEmailAndPassword, GoogleAuthProvider, onAuthStateChanged, signInWithEmailAndPassword, signInWithPopup, signOut, updateProfile } from 'firebase/auth';
import { auth } from '../../firebase/firebase.init';
import { AuthContext } from '../Authcontext/AuthContext';
import axios from 'axios';

const googleProvider = new GoogleAuthProvider();

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [userRole, setUserRole] = useState(null);

    const registerUser = (email, password) => {
        setLoading(true);
        return createUserWithEmailAndPassword(auth, email, password);
    };

    const signInUser = (email, password) => {
        setLoading(true);
        return signInWithEmailAndPassword(auth, email, password);
    };

    const signInGoogle = () => {
        setLoading(true);
        return signInWithPopup(auth, googleProvider);
    };

    const logOut = () => {
        setLoading(true);
        return signOut(auth);
    };

    const updateUserProfile = (profile) =>{
        return updateProfile(auth.currentUser, profile);
    };

    const getIdToken = async () => {
        if (auth.currentUser) {
            return await auth.currentUser.getIdToken(true); // Force refresh token
        }
        return null;
    };

    // Fetch user role from backend with retry mechanism and better error handling
    const fetchUserRole = async (currentUser) => {
        try {
            if (currentUser) {
                // Add a small delay to ensure Firebase auth is fully settled
                await new Promise(resolve => setTimeout(resolve, 100));
                
                // Retry mechanism for token fetching
                let token = null;
                let retries = 3;
                
                while (retries > 0 && !token) {
                  token = await getIdToken();
                  if (!token) {
                    await new Promise(resolve => setTimeout(resolve, 200)); // Wait 200ms before retry
                    retries--;
                  }
                }
                
                if (token) {
                  // Use environment variable for baseURL
                  const baseURL = import.meta.env.VITE_API_URL || 'https://finlex-server.vercel.app';
                  
                  const axiosInstance = axios.create({
                    baseURL: baseURL,
                    headers: {
                      'Authorization': `Bearer ${token}`
                    }
                  });
                  
                  const response = await axiosInstance.get('/profile');
                  // Make sure we're setting the role correctly
                  const role = response.data.role || 'borrower';
                  console.log('Setting user role:', role); // Debug log
                  setUserRole(role);
                } else {
                  // If we can't get a token after retries, default to borrower
                  console.warn('Unable to fetch token after retries, defaulting to borrower role');
                  setUserRole('borrower');
                }
            } else {
                // If there's no current user, clear the role
                setUserRole(null);
            }
        } catch (error) {
            console.error('Error fetching user role:', error);
            // Even if there's an error, we should set a default role to prevent infinite loading
            // But only do this if we're reasonably sure the user exists
            if (currentUser) {
              setUserRole('borrower'); 
            } else {
              setUserRole(null);
            }
        }
    };

    // observe user state
    useEffect(() => {
        const unSubscribe = onAuthStateChanged(auth, async (currentUser) => {
            setUser(currentUser);
            
            // Fetch user role when user state changes
            if (currentUser) {
                // Add a small delay to ensure auth is fully settled before fetching role
                await new Promise(resolve => setTimeout(resolve, 200));
                await fetchUserRole(currentUser);
            } else {
                setUserRole(null);
            }
            
            setLoading(false);
        });
        return () => {
            unSubscribe();
        };
    }, []);

    // Add a function to manually refresh the user role
    const refreshUserRole = async () => {
        // Use the current Firebase user directly instead of the state variable
        // This ensures we always have the latest user data
        if (auth.currentUser) {
          await fetchUserRole(auth.currentUser);
        } else if (user) {
          // Fallback to state user if Firebase currentUser is not available
          await fetchUserRole(user);
        }
      };

    const authInfo = {
        user,
        userRole,
        loading,
        registerUser,
        signInUser,
        signInGoogle,
        logOut,
        updateUserProfile,
        getIdToken,
        refreshUserRole
    }

    return (
        <AuthContext.Provider value={authInfo}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;