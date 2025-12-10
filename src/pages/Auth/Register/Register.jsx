import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router';
import { useForm } from 'react-hook-form';
import Swal from 'sweetalert2';
import axios from 'axios';
import useAuth from '../../../hooks/useAuth';
import useAxiosSecure from '../../../hooks/useAxiosSecure';

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();
  const { registerUser, updateUserProfile } = useAuth();
  const axiosSecure = useAxiosSecure();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const password = watch('password');

  const onSubmit = async (data) => {
    try {
      // Password validations
      const hasUpperCase = /[A-Z]/.test(data.password);
      const hasLowerCase = /[a-z]/.test(data.password);
      const hasMinLength = data.password.length >= 6;

      if (!hasUpperCase) throw new Error('Password must contain at least one uppercase letter');
      if (!hasLowerCase) throw new Error('Password must contain at least one lowercase letter');
      if (!hasMinLength) throw new Error('Password must be at least 6 characters long');

      // Register user
      await registerUser(data.email, data.password);

      // Upload photo to ImageBB
      const profileImg = data.photo[0];
      const formData = new FormData();
      formData.append('image', profileImg);

      const image_API_URL = `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_image_host_key}`;

      const imgRes = await axios.post(image_API_URL, formData);
      const photoURL = imgRes.data.data.url;

      // Update Firebase profile
      await updateUserProfile({
        displayName: data.name,
        photoURL: photoURL
      });

      // Send user data to backend
      try {
        const userData = {
          name: data.name,
          email: data.email,
          photoURL: photoURL,
          role: data.role
        };
        console.log(userData)
        
        // Use axiosSecure to send data to backend
        const axiosSecure = axios.create({
          baseURL: 'https://finlex-server.vercel.app'
        });
        
        await axiosSecure.post('/users', userData);
      } catch (backendError) {
        console.error('Error sending user data to backend:', backendError);
        // Don't fail the registration if backend sync fails
      }

      // Success message
      await Swal.fire({
        icon: 'success',
        title: 'Registration Successful!',
        text: 'Your account has been created successfully.',
        timer: 2000,
        showConfirmButton: false
      });

      // Redirect to home page
      navigate('/');
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Registration Failed!',
        text: error.message,
      });
    }
  };

  return (
    // Main Container: Light, soft background gradient
    <div className="min-h-screen p-4 sm:p-6 md:p-8 bg-gradient-to-br from-green-50 to-gray-100 font-sans flex justify-center items-center">
      {/* Form Card/Panel */}
      <div className="w-full max-w-md bg-white p-6 sm:p-8 rounded-2xl shadow-xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Account</h1>
          <p className="text-gray-600">Join us today and get started</p>
        </div>

        {/* Registration Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Full Name Input */}
          <div>
            <label htmlFor="name" className="block text-gray-800 font-medium mb-2">
              Full Name
            </label>
            <input
              type="text"
              id="name"
              placeholder="Enter your full name"
              {...register('name', { 
                required: 'Full name is required',
                minLength: {
                  value: 2,
                  message: 'Full name must be at least 2 characters'
                }
              })}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent text-base placeholder-gray-400 shadow-sm transition ${
                errors.name 
                  ? 'border-red-500 focus:ring-red-500' 
                  : 'border-gray-300 focus:ring-[#538d22] focus:border-[#538d22]'
              }`}
            />
            {errors.name && (
              <p className="mt-1 text-red-500 text-sm">{errors.name.message}</p>
            )}
          </div>

          {/* Photo Upload Input */}
          <div>
            <label htmlFor="photo" className="block text-gray-800 font-medium mb-2">
              Photo
            </label>
            <input
              type="file"
              id="photo"
              {...register('photo', { required: 'Photo is required' })}
              className="file-input w-full"
            />
            {errors.photo && (
              <p className="mt-1 text-red-500 text-sm">{errors.photo.message}</p>
            )}
          </div>

          {/* Email Input */}
          <div>
            <label htmlFor="email" className="block text-gray-800 font-medium mb-2">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              placeholder="Enter your email"
              {...register('email', { 
                required: 'Email is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid email address'
                }
              })}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent text-base placeholder-gray-400 shadow-sm transition ${
                errors.email 
                  ? 'border-red-500 focus:ring-red-500' 
                  : 'border-gray-300 focus:ring-[#538d22] focus:border-[#538d22]'
              }`}
            />
            {errors.email && (
              <p className="mt-1 text-red-500 text-sm">{errors.email.message}</p>
            )}
          </div>

          {/* Role Dropdown */}
          <div>
            <label htmlFor="role" className="block text-gray-800 font-medium mb-2">
              Role
            </label>
            <select
              id="role"
              {...register('role', { 
                required: 'Role is required'
              })}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent text-base placeholder-gray-400 shadow-sm transition ${
                errors.role 
                  ? 'border-red-500 focus:ring-red-500' 
                  : 'border-gray-300 focus:ring-[#538d22] focus:border-[#538d22]'
              }`}
            >
              <option value="">Select a role</option>
              <option value="borrower">Borrower</option>
              <option value="manager">Manager</option>
            </select>
            {errors.role && (
              <p className="mt-1 text-red-500 text-sm">{errors.role.message}</p>
            )}
          </div>

          {/* Password Input */}
          <div>
            <label htmlFor="password" className="block text-gray-800 font-medium mb-2">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                placeholder="Create a password"
                {...register('password', { 
                  required: 'Password is required',
                  minLength: {
                    value: 6,
                    message: 'Password must be at least 6 characters'
                  }
                })}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent text-base placeholder-gray-400 shadow-sm pr-12 transition ${
                  errors.password 
                    ? 'border-red-500 focus:ring-red-500' 
                    : 'border-gray-300 focus:ring-[#538d22] focus:border-[#538d22]'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center px-4 text-gray-400 hover:text-gray-600"
              >
                {/* Eye icon for show/hide */}
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={showPassword ? "M13.875 18.825A10.057 10.057 0 0112 19c-4.478 0-8.268-2.943-9.543-7.252m5.787-1.123c.342-.058.685-.112 1.028-.168M16 12a4 4 0 10-8 0 4 4 0 008 0z" : "M15 12a3 3 0 11-6 0 3 3 0 016 0zM2.458 12C3.732 7.828 7.518 5 12 5c4.48 0 8.268 2.828 9.542 7C20.268 16.172 16.48 19 12 19c-4.482 0-8.268-2.828-9.542-7z"} />
                </svg>
              </button>
            </div>
            {errors.password && (
              <p className="mt-1 text-red-500 text-sm">{errors.password.message}</p>
            )}
            {/* Password requirements */}
            <div className="mt-2 text-sm text-gray-600">
              <p>Password must contain:</p>
              <ul className="list-disc list-inside ml-2 space-y-1">
                <li className={password && /[A-Z]/.test(password) ? "text-green-600" : ""}>
                  At least one uppercase letter
                </li>
                <li className={password && /[a-z]/.test(password) ? "text-green-600" : ""}>
                  At least one lowercase letter
                </li>
                <li className={password && password.length >= 6 ? "text-green-600" : ""}>
                  Minimum 6 characters
                </li>
              </ul>
            </div>
          </div>

          {/* Confirm Password Input */}
          <div>
            <label htmlFor="confirmPassword" className="block text-gray-800 font-medium mb-2">
              Confirm Password
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                id="confirmPassword"
                placeholder="Confirm your password"
                {...register('confirmPassword', { 
                  required: 'Please confirm your password',
                  validate: value => 
                    value === password || 'Passwords do not match'
                })}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent text-base placeholder-gray-400 shadow-sm pr-12 transition ${
                  errors.confirmPassword 
                    ? 'border-red-500 focus:ring-red-500' 
                    : 'border-gray-300 focus:ring-[#538d22] focus:border-[#538d22]'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-0 flex items-center px-4 text-gray-400 hover:text-gray-600"
              >
                {/* Eye icon for show/hide */}
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={showConfirmPassword ? "M13.875 18.825A10.057 10.057 0 0112 19c-4.478 0-8.268-2.943-9.543-7.252m5.787-1.123c.342-.058.685-.112 1.028-.168M16 12a4 4 0 10-8 0 4 4 0 008 0z" : "M15 12a3 3 0 11-6 0 3 3 0 016 0zM2.458 12C3.732 7.828 7.518 5 12 5c4.48 0 8.268 2.828 9.542 7C20.268 16.172 16.48 19 12 19c-4.482 0-8.268-2.828-9.542-7z"} />
                </svg>
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="mt-1 text-red-500 text-sm">{errors.confirmPassword.message}</p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full px-4 py-3 mt-4 bg-[#538d22] hover:bg-[#427a19] text-white font-semibold rounded-lg shadow-md transition duration-300 ease-in-out"
          >
            Create Account
          </button>
        </form>

        {/* Sign In Link */}
        <div className="text-center mt-6 text-gray-600">
          Already have an account? <Link to="/login" className="font-medium text-[#538d22] hover:text-[#427a19] transition">Sign in</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;