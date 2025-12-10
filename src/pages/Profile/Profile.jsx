import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import Swal from 'sweetalert2';
import useAuth from '../../hooks/useAuth';
import useRole from '../../hooks/useRole';
import useAxiosSecure from '../../hooks/useAxiosSecure';

const Profile = () => {
  const { user, updateUserProfile } = useAuth();
  const { userRole } = useRole();
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    photoURL: '',
    role: ''
  });
  
  const [isEditing, setIsEditing] = useState(false);
  const [updatedData, setUpdatedData] = useState({
    name: '',
    photoURL: ''
  });
  
  const [photoPreview, setPhotoPreview] = useState(null);
  const [newPhotoFile, setNewPhotoFile] = useState(null);
  
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();

  // Set dynamic page title
  useEffect(() => {
    document.title = 'Profile - Finlix';
  }, []);

  // Load user data when component mounts
  useEffect(() => {
    if (user) {
      fetchUserProfile();
    }
  }, [user]);

  const fetchUserProfile = async () => {
    try {
      const response = await axiosSecure.get('/profile');
      const profileData = response.data;
      
      setUserData({
        name: profileData.name || user.displayName || '',
        email: profileData.email || user.email || '',
        photoURL: profileData.photoURL || user.photoURL || '',
        role: profileData.role || 'borrower'
      });
      
      setUpdatedData({
        name: profileData.name || user.displayName || '',
        photoURL: profileData.photoURL || user.photoURL || ''
      });
      
      setPhotoPreview(profileData.photoURL || user.photoURL || '');
    } catch (error) {
      console.error('Error fetching profile:', error);
      
      // Handle 403 errors specifically
      if (error.response?.status === 403) {
        console.error('Forbidden: Cannot access profile data');
        // The axiosSecure interceptor will handle the redirect to login
        return;
      }
      
      // Fallback to auth data if API fails
      const fallbackData = {
        name: user.displayName || '',
        email: user.email || '',
        photoURL: user.photoURL || '',
        role: user.role || 'borrower'
      };
      setUserData(fallbackData);
      setUpdatedData({
        name: user.displayName || '',
        photoURL: user.photoURL || ''
      });
      setPhotoPreview(user.photoURL || '');
    }
  };

  // Handle input changes in edit mode
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle photo change
  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewPhotoFile(file);
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
        setUpdatedData(prev => ({
          ...prev,
          photoURL: reader.result // Temporary preview URL
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Function to upload image to ImageBB
  const uploadImageToImageBB = async (file) => {
    if (!file) return null;
    
    const formData = new FormData();
    formData.append('image', file);
    
    // Use the ImageBB API key from environment variables
    const apiKey = import.meta.env.VITE_imagebbApiKey;
    
    try {
      const response = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
        method: 'POST',
        body: formData,
      });
      
      const data = await response.json();
      
      if (data.success) {
        return data.data.url; // Return the URL of the uploaded image
      } else {
        throw new Error('Image upload failed');
      }
    } catch (error) {
      console.error("Error uploading image to ImageBB:", error);
      throw new Error("Failed to upload image");
    }
  };

  // Handle form submission for profile updates
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      let finalPhotoURL = updatedData.photoURL;
      
      // If a new photo was selected, upload it
      if (newPhotoFile) {
        finalPhotoURL = await uploadImageToImageBB(newPhotoFile);
      }
      
      // Update user profile in backend
      const profileData = {
        name: updatedData.name,
        photoURL: finalPhotoURL
      };
      
      await axiosSecure.put('/profile', profileData);
      
      // Update auth profile
      await updateUserProfile({
        displayName: updatedData.name,
        photoURL: finalPhotoURL
      });
      
      // Update local state
      setUserData(prev => ({
        ...prev,
        name: updatedData.name,
        photoURL: finalPhotoURL
      }));
      
      // Reset edit mode
      setIsEditing(false);
      setNewPhotoFile(null);
      
      // Show success message
      Swal.fire({
        icon: 'success',
        title: 'Profile Updated!',
        text: 'Your profile has been updated successfully.',
        timer: 2000,
        showConfirmButton: false
      });
    } catch (error) {
      console.error("Error updating profile:", error);
      
      // Handle 403 errors specifically
      if (error.response?.status === 403) {
        Swal.fire({
          icon: 'error',
          title: 'Access Denied!',
          text: 'You do not have permission to update this profile.',
        });
        return;
      }
      
      Swal.fire({
        icon: 'error',
        title: 'Update Failed!',
        text: error.message || 'Failed to update profile. Please try again.',
      });
    }
  };

  // Cancel editing
  const handleCancel = () => {
    // Reset to original data
    setUpdatedData({
      name: userData.name,
      photoURL: userData.photoURL
    });
    setPhotoPreview(userData.photoURL);
    setNewPhotoFile(null);
    setIsEditing(false);
  };

  // Enter edit mode
  const handleEdit = () => {
    setIsEditing(true);
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-green-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Please log in to view your profile</h2>
          <button 
            onClick={() => navigate('/login')}
            className="btn bg-[#538d22] hover:bg-[#427a19] text-white rounded-lg font-semibold"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Profile Header */}
          <div className="bg-gradient-to-r from-[#538d22] to-[#427a19] p-8 text-white">
            <div className="flex flex-col md:flex-row items-center">
              <div className="mb-6 md:mb-0 md:mr-8">
                {photoPreview ? (
                  <img 
                    src={photoPreview} 
                    alt="Profile" 
                    className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
                  />
                ) : (
                  <div className="w-32 h-32 rounded-full bg-gray-200 border-4 border-white flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                )}
              </div>
              
              <div className="text-center md:text-left">
                <h1 className="text-3xl font-bold mb-2">{userData.name || 'User'}</h1>
                <p className="text-green-100 mb-4">{userData.email}</p>
                <div className="inline-block px-4 py-2 bg-white bg-opacity-20 rounded-full">
                  <span className="text-black font-medium capitalize">{userData.role || 'borrower'}</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Profile Content */}
          <div className="p-8">
            {!isEditing ? (
              // View Mode
              <div>
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-2xl font-bold text-gray-800">Profile Information</h2>
                  <button
                    onClick={handleEdit}
                    className="btn bg-[#538d22] hover:bg-[#427a19] text-white rounded-lg font-semibold px-6 py-2"
                  >
                    Edit Profile
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-green-50 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Full Name</h3>
                    <p className="text-gray-600">{userData.name || 'Not provided'}</p>
                  </div>
                  
                  <div className="bg-green-50 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Email Address</h3>
                    <p className="text-gray-600">{userData.email || 'Not provided'}</p>
                  </div>
                  
                  <div className="bg-green-50 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Role</h3>
                    <p className="text-gray-600 capitalize">{userData.role || 'borrower'}</p>
                  </div>
                  
                  <div className="bg-green-50 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Member Since</h3>
                    <p className="text-gray-600">
                      {user.metadata?.creationTime 
                        ? new Date(user.metadata.creationTime).toLocaleDateString() 
                        : 'Not available'}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              // Edit Mode
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-8">Edit Profile</h2>
                
                <form onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div className="md:col-span-2">
                      <label htmlFor="photoUpload" className="block text-gray-800 font-medium mb-2">
                        Profile Photo
                      </label>
                      <div className="flex items-center space-x-6">
                        <div className="flex-shrink-0">
                          {photoPreview ? (
                            <img 
                              src={photoPreview} 
                              alt="Preview" 
                              className="w-24 h-24 rounded-full object-cover border-2 border-[#538d22]"
                            />
                          ) : (
                            <div className="w-24 h-24 rounded-full bg-gray-200 border-2 border-dashed border-gray-400 flex items-center justify-center">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                            </div>
                          )}
                        </div>
                        <div className="flex-grow">
                          <input
                            type="file"
                            id="photoUpload"
                            accept="image/*"
                            onChange={handlePhotoChange}
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:border-transparent text-base shadow-sm transition file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#538d22] file:text-white hover:file:bg-[#427a19]"
                          />
                          <p className="mt-1 text-sm text-gray-500">Upload a profile picture from your device</p>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="name" className="block text-gray-800 font-medium mb-2">
                        Full Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={updatedData.name}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#538d22] focus:border-[#538d22] text-base placeholder-gray-400 shadow-sm transition"
                        placeholder="Enter your full name"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="email" className="block text-gray-800 font-medium mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        id="email"
                        value={userData.email}
                        disabled
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 text-base placeholder-gray-400 shadow-sm transition"
                        placeholder="Enter your email"
                      />
                      <p className="mt-1 text-sm text-gray-500">Email cannot be changed</p>
                    </div>
                  </div>
                  
                  <div className="flex justify-end space-x-4">
                    <button
                      type="button"
                      onClick={handleCancel}
                      className="btn bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-semibold px-6 py-2"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="btn bg-[#538d22] hover:bg-[#427a19] text-white rounded-lg font-semibold px-6 py-2"
                    >
                      Save Changes
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;