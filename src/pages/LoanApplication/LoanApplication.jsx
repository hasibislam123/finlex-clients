import React from 'react';
import { useForm } from 'react-hook-form';
import Swal from 'sweetalert2';
import useAuth from '../../hooks/useAuth';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import { useLocation, useNavigate } from 'react-router';

const LoanApplication = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();
  const location = useLocation();

  // Get loan data from location state (passed from LoanDetails)
  const { loanTitle, interestRate } = location.state || {};

  const { register, handleSubmit, watch, formState: { errors } } = useForm();

  // Watch loan amount to calculate application fee
  const loanAmount = watch('loanAmount');

  // Calculate application fee (1% of loan amount)
  const applicationFee = loanAmount ? (parseFloat(loanAmount) * 0.01).toFixed(2) : '0.00';

  const handleLoanApplication = async (data) => {
    // Calculate application fee
    const calculatedFee = parseFloat(data.loanAmount) * 0.01;
    
    // Show SweetAlert2 confirmation dialog
    Swal.fire({
      title: "Agree with the Cost?",
      text: `You will be charged ${calculatedFee.toFixed(2)} taka as application fee!`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Confirm and Continue Payment!"
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          // Prepare the data to send
          const applicationData = {
            ...data,
            email: user?.email || '',
            loanTitle: loanTitle || '',
            interestRate: interestRate || '',
            applicationFee: calculatedFee.toFixed(2),
            status: 'Pending', // Default status
            applicationFeeStatus: 'unpaid' // Default fee status
          };

          // Send the data using axios
          const response = await axiosSecure.post('/loans', applicationData);
          
          if (response.data) {
            // Show success message
            Swal.fire({
              position: "top-end",
              icon: "success",
              title: "Loan application has been submitted successfully!",
              showConfirmButton: false,
              timer: 2500
            });
            // Redirect to profile page
            navigate('/dashboard/my-loans');
          }
        } catch (error) {
          console.error('Error submitting loan application:', error);
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Something went wrong! Please try again."
          });
        }
      }
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-[#7cb518] mb-3">Loan Application Form</h1>
          <p className="text-gray-600">Fill in the details below to apply for your loan</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-[#538d22] to-green-700 p-6">
            <h2 className="text-2xl font-bold text-white">Application Details</h2>
          </div>
          
          <div className="p-6 md:p-8">
            <form onSubmit={handleSubmit(handleLoanApplication)} className="space-y-8">
              {/* Auto-filled fields (read-only) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-700 font-medium mb-2">User Email</label>
                  <input 
                    type="email" 
                    {...register('email')}
                    defaultValue={user?.email || ''}
                    readOnly
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Loan Title</label>
                  <input 
                    type="text" 
                    {...register('loanTitle')}
                    defaultValue={loanTitle || ''}
                    readOnly
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Interest Rate</label>
                  <input 
                    type="text" 
                    {...register('interestRate')}
                    defaultValue={interestRate || ''}
                    readOnly
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Application Fee (1% of loan amount)</label>
                  <input 
                    type="text" 
                    value={`${applicationFee} Taka`}
                    readOnly
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
                  />
                </div>
              </div>

              {/* User input fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-700 font-medium mb-2">First Name *</label>
                  <input 
                    type="text" 
                    {...register('firstName', { required: true })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#538d22] focus:border-transparent transition"
                    placeholder="John"
                  />
                  {errors.firstName && <span className="text-red-500 text-sm">First name is required</span>}
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Last Name *</label>
                  <input 
                    type="text" 
                    {...register('lastName', { required: true })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#538d22] focus:border-transparent transition"
                    placeholder="Doe"
                  />
                  {errors.lastName && <span className="text-red-500 text-sm">Last name is required</span>}
                </div>
                
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Contact Number *</label>
                  <input 
                    type="tel" 
                    {...register('contactNumber', { required: true })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#538d22] focus:border-transparent transition"
                    placeholder="+8801XXXXXXXXX"
                  />
                  {errors.contactNumber && <span className="text-red-500 text-sm">Contact number is required</span>}
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-2">National ID / Passport Number *</label>
                  <input 
                    type="text" 
                    {...register('nationalId', { required: true })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#538d22] focus:border-transparent transition"
                    placeholder="Enter National ID or Passport Number"
                  />
                  {errors.nationalId && <span className="text-red-500 text-sm">National ID/Passport is required</span>}
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Income Source *</label>
                  <input 
                    type="text" 
                    {...register('incomeSource', { required: true })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#538d22] focus:border-transparent transition"
                    placeholder="e.g., Employment, Business, Freelance"
                  />
                  {errors.incomeSource && <span className="text-red-500 text-sm">Income source is required</span>}
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Monthly Income *</label>
                  <input 
                    type="number" 
                    {...register('monthlyIncome', { required: true })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#538d22] focus:border-transparent transition"
                    placeholder="Enter your monthly income"
                  />
                  {errors.monthlyIncome && <span className="text-red-500 text-sm">Monthly income is required</span>}
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Loan Amount *</label>
                  <input 
                    type="number" 
                    {...register('loanAmount', { required: true })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#538d22] focus:border-transparent transition"
                    placeholder="Enter desired loan amount"
                  />
                  {errors.loanAmount && <span className="text-red-500 text-sm">Loan amount is required</span>}
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Reason for Loan *</label>
                  <input 
                    type="text" 
                    {...register('reasonForLoan', { required: true })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#538d22] focus:border-transparent transition"
                    placeholder="e.g., Home improvement, Education, Debt consolidation"
                  />
                  {errors.reasonForLoan && <span className="text-red-500 text-sm">Reason for loan is required</span>}
                </div>
              </div>
              
              <div>
                <label className="block text-gray-700 font-medium mb-2">Address *</label>
                <input 
                  type="text" 
                  {...register('address', { required: true })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#538d22] focus:border-transparent transition"
                  placeholder="123 Main Street"
                />
                {errors.address && <span className="text-red-500 text-sm">Address is required</span>}
              </div>
              
              <div>
                <label className="block text-gray-700 font-medium mb-2">Extra Notes</label>
                <textarea 
                  rows="4" 
                  {...register('extraNotes')}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#538d22] focus:border-transparent transition"
                  placeholder="Any additional information you'd like to share..."
                ></textarea>
              </div>
              
              <div className="bg-green-50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Required Documents</h3>
                <p className="text-gray-600 mb-4">Please prepare the following documents for your loan application:</p>
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#538d22] mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Government-issued photo ID</span>
                  </li>
                  <li className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#538d22] mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Proof of income (pay stubs, tax returns, etc.)</span>
                  </li>
                  <li className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#538d22] mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Bank statements (last 3 months)</span>
                  </li>
                  <li className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#538d22] mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Proof of residence (utility bill, lease agreement, etc.)</span>
                  </li>
                </ul>
              </div>
              
              <div className="flex items-center">
                <input 
                  type="checkbox" 
                  id="consent" 
                  {...register('consent', { required: true })}
                  className="w-4 h-4 text-[#538d22] border-gray-300 rounded focus:ring-[#538d22]"
                />
                <label htmlFor="consent" className="ml-2 text-gray-700">
                  I consent to receive communications regarding my loan application *
                </label>
              </div>
              {errors.consent && <span className="text-red-500 text-sm">You must consent to receive communications</span>}
              
              <button 
                type="submit"
                className="w-full bg-[#538d22] hover:bg-[#427a19] text-white font-semibold py-4 px-6 rounded-lg transition duration-300 shadow-lg hover:shadow-xl"
              >
                Submit Application
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoanApplication;