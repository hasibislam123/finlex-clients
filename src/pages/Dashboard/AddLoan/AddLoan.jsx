import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router'; // Add useParams to get loan ID from URL
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import Swal from 'sweetalert2';

const AddLoan = () => {
  const { id } = useParams(); // Get loan ID from URL params
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    interestRate: '',
    maxLoanLimit: '',
    requiredDocuments: '',
    emiPlans: '',
    image: '',
    showOnHome: false
  });
  const [imageFile, setImageFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false); // Track if we're in edit mode
  const axiosSecure = useAxiosSecure();

  // Set dynamic page title
  useEffect(() => {
    if (id) {
      setIsEditMode(true);
      document.title = 'Update Loan - Finlix Dashboard';
    } else {
      setIsEditMode(false);
      document.title = 'Add Loan - Finlix Dashboard';
    }
  }, [id]);

  // Load existing loan data when in edit mode
  useEffect(() => {
    if (isEditMode) {
      const fetchLoanData = async () => {
        try {
          const response = await axiosSecure.get(`/loans/manager`);
          const loans = response.data;
          const loanToUpdate = loans.find(loan => loan._id === id);
          
          if (loanToUpdate) {
            // Format the data for the form
            setFormData({
              title: loanToUpdate.title || '',
              description: loanToUpdate.description || '',
              category: loanToUpdate.category || '',
              interestRate: loanToUpdate.interestRate || '',
              maxLoanLimit: loanToUpdate.maxLoanLimit || '',
              requiredDocuments: Array.isArray(loanToUpdate.requiredDocuments) 
                ? loanToUpdate.requiredDocuments.join(', ') 
                : loanToUpdate.requiredDocuments || '',
              emiPlans: Array.isArray(loanToUpdate.emiPlans) 
                ? loanToUpdate.emiPlans.join(', ') 
                : loanToUpdate.emiPlans || '',
              image: loanToUpdate.image || '',
              showOnHome: loanToUpdate.showOnHome || false
            });
          }
        } catch (error) {
          console.error("Error fetching loan data:", error);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Failed to load loan data. Please try again.',
          });
        }
      };

      fetchLoanData();
    }
  }, [isEditMode, id, axiosSecure]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          image: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Upload image to ImageBB
  const uploadImageToImageBB = async (file) => {
    if (!file) return null;
    
    // Use the ImageBB API key from environment variables
    const apiKey = import.meta.env.VITE_image_host_key;
    
    // Check if API key is available
    if (!apiKey) {
      throw new Error('Image upload service not configured. Please contact administrator.');
    }
    
    const formData = new FormData();
    formData.append('image', file);
    
    try {
      const response = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
        method: 'POST',
        body: formData,
      });
      
      // Check if response is OK
      if (!response.ok) {
        throw new Error(`Image upload failed with status ${response.status}`);
      }
      
      const data = await response.json();
      
      // Log response for debugging
      console.log('ImageBB response:', data);
      
      if (data.success) {
        return data.data.url; // Return the URL of the uploaded image
      } else {
        throw new Error(data.error?.message || 'Image upload failed');
      }
    } catch (error) {
      console.error("Error uploading image to ImageBB:", error);
      throw new Error(`Failed to upload image: ${error.message}`);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);
    
    try {
      let imageUrl = formData.image;
      
      // If a new image was selected, upload it
      if (imageFile) {
        try {
          imageUrl = await uploadImageToImageBB(imageFile);
        } catch (imageError) {
          console.error("Image upload error:", imageError);
          // Show warning but continue with form submission
          const result = await Swal.fire({
            icon: 'warning',
            title: 'Image Upload Failed',
            text: 'The loan will be created without an image. You can add an image later.',
            showConfirmButton: true,
            showCancelButton: true,
            confirmButtonText: 'Continue Anyway',
            cancelButtonText: 'Cancel'
          });
          
          if (result.isConfirmed) {
            // Continue with form submission without image
            await submitLoanData(null);
            return;
          } else {
            // User cancelled, stop the process
            setUploading(false);
            return;
          }
        }
      }
      
      // Submit loan data
      await submitLoanData(imageUrl);
    } catch (error) {
      console.error("Error adding loan:", error);
      
      Swal.fire({
        icon: 'error',
        title: 'Add Failed!',
        text: error.message || 'Failed to add loan. Please try again.',
      });
      setUploading(false);
    }
  };

  // Separate function to handle loan submission
  const submitLoanData = async (imageUrl) => {
    try {
      // Prepare loan data
      const loanData = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        interestRate: parseFloat(formData.interestRate),
        maxLoanLimit: parseFloat(formData.maxLoanLimit),
        requiredDocuments: formData.requiredDocuments.split(',').map(doc => doc.trim()),
        emiPlans: formData.emiPlans.split(',').map(plan => plan.trim()),
        showOnHome: formData.showOnHome
      };
      
      // Only add image URL if it exists
      if (imageUrl) {
        loanData.image = imageUrl;
      }
      
      if (isEditMode) {
        // Update existing loan
        await axiosSecure.put(`/loans/${id}`, loanData);
        
        // Show success message
        Swal.fire({
          icon: 'success',
          title: 'Loan Updated!',
          text: 'The loan has been updated successfully.',
          timer: 2000,
          showConfirmButton: false
        });
      } else {
        // Submit new loan data
        await axiosSecure.post('/loans', loanData);
        
        // Show success message
        Swal.fire({
          icon: 'success',
          title: 'Loan Added!',
          text: 'The loan has been added successfully.',
          timer: 2000,
          showConfirmButton: false
        });
        
        // Reset form
        setFormData({
          title: '',
          description: '',
          category: '',
          interestRate: '',
          maxLoanLimit: '',
          requiredDocuments: '',
          emiPlans: '',
          image: '',
          showOnHome: false
        });
        setImageFile(null);
      }
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen  py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-[#7cb518] mb-2">
            {isEditMode ? 'Update Loan' : 'Add New Loan'}
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            {isEditMode 
              ? 'Update the loan product details below.' 
              : 'Create a new loan product with all the necessary details. Fill in the information below to make it available to borrowers.'}
          </p>
        </div>

        {/* Form Container */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Form Header */}
          <div className="bg-gradient-to-r from-[#538d22] to-emerald-700 p-6">
            <h2 className="text-2xl font-bold text-white">
              {isEditMode ? 'Update Loan Details' : 'Loan Details'}
            </h2>
            <p className="text-emerald-100 mt-1">
              {isEditMode 
                ? 'Modify the information to update the loan product' 
                : 'Complete all required fields to create a new loan product'}
            </p>
          </div>

          {/* Form */}
          <div className="p-6 md:p-8">
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Left Column */}
                <div className="space-y-6">
                  {/* Title */}
                  <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                      Loan Title *
                    </label>
                    <input
                      type="text"
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#538d22] focus:border-[#538d22] transition"
                      placeholder="Enter loan title"
                    />
                  </div>

                  {/* Description */}
                  <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                      Description *
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      required
                      rows="4"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#538d22] focus:border-[#538d22] transition"
                      placeholder="Enter loan description"
                    ></textarea>
                  </div>

                  {/* Category */}
                  <div>
                    <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                      Category *
                    </label>
                    <select
                      id="category"
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#538d22] focus:border-[#538d22] transition"
                    >
                      <option value="">Select a category</option>
                      <option value="Personal">Personal</option>
                      <option value="Business">Business</option>
                      <option value="Home">Home</option>
                      <option value="Auto">Auto</option>
                      <option value="Education">Education</option>
                      <option value="Medical">Medical</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  {/* Interest Rate */}
                  <div>
                    <label htmlFor="interestRate" className="block text-sm font-medium text-gray-700 mb-1">
                      Interest Rate (%) *
                    </label>
                    <input
                      type="number"
                      id="interestRate"
                      name="interestRate"
                      value={formData.interestRate}
                      onChange={handleChange}
                      required
                      min="0"
                      step="0.01"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#538d22] focus:border-[#538d22] transition"
                      placeholder="Enter interest rate"
                    />
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                  {/* Max Loan Limit */}
                  <div>
                    <label htmlFor="maxLoanLimit" className="block text-sm font-medium text-gray-700 mb-1">
                      Maximum Loan Limit ($) *
                    </label>
                    <input
                      type="number"
                      id="maxLoanLimit"
                      name="maxLoanLimit"
                      value={formData.maxLoanLimit}
                      onChange={handleChange}
                      required
                      min="0"
                      step="1"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#538d22] focus:border-[#538d22] transition"
                      placeholder="Enter maximum loan limit"
                    />
                  </div>

                  {/* Required Documents */}
                  <div>
                    <label htmlFor="requiredDocuments" className="block text-sm font-medium text-gray-700 mb-1">
                      Required Documents *
                    </label>
                    <input
                      type="text"
                      id="requiredDocuments"
                      name="requiredDocuments"
                      value={formData.requiredDocuments}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#538d22] focus:border-[#538d22] transition"
                      placeholder="Comma separated (e.g., ID,Proof of Income)"
                    />
                    <p className="mt-1 text-xs text-gray-500">Separate multiple documents with commas</p>
                  </div>

                  {/* EMI Plans */}
                  <div>
                    <label htmlFor="emiPlans" className="block text-sm font-medium text-gray-700 mb-1">
                      EMI Plans *
                    </label>
                    <input
                      type="text"
                      id="emiPlans"
                      name="emiPlans"
                      value={formData.emiPlans}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#538d22] focus:border-[#538d22] transition"
                      placeholder="Comma separated (e.g., 12 Months,24 Months)"
                    />
                    <p className="mt-1 text-xs text-gray-500">Separate multiple plans with commas</p>
                  </div>

                  {/* Image Upload */}
                  <div>
                    <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">
                      Loan Image
                    </label>
                    <div className="flex items-center space-x-4">
                      <div className="flex-1">
                        <input
                          type="file"
                          id="image"
                          name="image"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#538d22] focus:border-[#538d22] transition"
                        />
                      </div>
                      {formData.image && (
                        <div className="w-16 h-16 rounded-lg overflow-hidden">
                          <img 
                            src={formData.image} 
                            alt="Preview" 
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Show on Home Checkbox */}
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="showOnHome"
                      name="showOnHome"
                      checked={formData.showOnHome}
                      onChange={handleChange}
                      className="h-4 w-4 text-[#538d22] focus:ring-[#538d22] border-gray-300 rounded"
                    />
                    <label htmlFor="showOnHome" className="ml-2 block text-sm text-gray-700">
                      Show on Homepage
                    </label>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="mt-8 flex justify-center">
                <button
                  type="submit"
                  disabled={uploading}
                  className={`px-8 py-3 bg-gradient-to-r from-[#538d22] to-emerald-700 text-white font-bold rounded-lg shadow-lg hover:from-[#427a19] hover:to-emerald-800 transition-all transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#538d22] ${
                    uploading ? 'opacity-75 cursor-not-allowed' : ''
                  }`}
                >
                  {uploading ? (
                    <span className="flex items-center">
                      <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
                      {isEditMode ? 'Updating Loan...' : 'Adding Loan...'}
                    </span>
                  ) : (
                    isEditMode ? 'Update Loan Product' : 'Add Loan Product'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddLoan;