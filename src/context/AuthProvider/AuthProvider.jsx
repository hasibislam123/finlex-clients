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

    // Fetch user role from backend
    const fetchUserRole = async (currentUser) => {
        try {
            if (currentUser) {
                const token = await getIdToken();
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
                    const role = response.data.role || 'borrower';
                    setUserRole(role);
                }
            }
        } catch (error) {
            console.error('Error fetching user role:', error);
            setUserRole('borrower'); 
        }
    };

    // observe user state
    useEffect(() => {
        const unSubscribe = onAuthStateChanged(auth, async (currentUser) => {
            setUser(currentUser);
            
            // Fetch user role when user state changes
            if (currentUser) {
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
        if (user) {
            await fetchUserRole(user);
        }
    };

    // Also refresh role when user changes
    useEffect(() => {
        if (user) {
            fetchUserRole(user);
        }
    }, [user]);

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