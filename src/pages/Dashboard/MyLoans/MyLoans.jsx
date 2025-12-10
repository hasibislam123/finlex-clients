import { useQuery } from '@tanstack/react-query';
import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import useAuth from '../../../hooks/useAuth';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import Loading from '../../../components/Loading/Loading';

const MyLoans = () => {
   const { user } = useAuth();
   const axiosSecure = useAxiosSecure();
   const [selectedLoan, setSelectedLoan] = useState(null);
   const [isModalOpen, setIsModalOpen] = useState(false);
   const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
   const [loanToCancel, setLoanToCancel] = useState(null);

   // Set dynamic page title
   useEffect(() => {
      document.title = 'My Loans - Finlix Dashboard';
   }, []);

   const { data: loans = [], isLoading, isError, error, refetch } = useQuery({
      queryKey: ['myLoans', user?.email],
      queryFn: async () => {
         const res = await axiosSecure.get(`/loans?email=${user?.email}`);
         return res.data;
      }
   });

   const handleViewDetails = (loan) => {
      // Open modal with loan details
      setSelectedLoan(loan);
      setIsModalOpen(true);
   };

   const closeModal = () => {
      setIsModalOpen(false);
      setSelectedLoan(null);
   };

   const openCancelModal = (loan) => {
      setLoanToCancel(loan);
      setIsCancelModalOpen(true);
   };

   const closeCancelModal = () => {
      setIsCancelModalOpen(false);
      setLoanToCancel(null);
   };

   const handleCancelLoan = async () => {
      if (!loanToCancel) return;
      
      try {
         // Update loan status to cancelled only if current status is 'Pending'
         const response = await axiosSecure.patch(`/loans/${loanToCancel._id}`, { status: 'Cancelled' });
         
         if (response.data.result?.matchedCount === 0) {
            Swal.fire({
               icon: 'error',
               title: 'Cannot Cancel Loan',
               text: 'Loan cannot be cancelled. It may no longer be in Pending status.',
               confirmButtonColor: '#3085d6'
            });
            return;
         }
         
         // Refresh the data
         refetch();
         // Close the modal
         closeCancelModal();
         
         // Show success notification
         Swal.fire({
            icon: 'success',
            title: 'Loan Cancelled!',
            text: 'Your loan application has been successfully cancelled.',
            confirmButtonColor: '#3085d6'
         });
      } catch (error) {
         console.error('Error cancelling loan:', error);
         Swal.fire({
            icon: 'error',
            title: 'Cancellation Failed',
            text: 'Failed to cancel loan application. Please try again.',
            confirmButtonColor: '#3085d6'
         });
      }
   };

   const handlePayFee = (loanId) => {
      // Navigate to payment page or show payment modal
      alert(`Proceed to payment for loan ${loanId}`);
   };

   if (isLoading) {
      return <Loading message="Loading your loan applications..." />;
   }

   if (isError) {
      return (
         <div className="p-8">
            <div className="alert alert-error">
               <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
               </svg>
               <span>Error: {error.message}</span>
            </div>
         </div>
      );
   }

   return (
      <div className="p-6">
         <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-[#7cb518]">My Loan Applications</h2>
         </div>

         {loans.length === 0 ? (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-8 text-center">
               <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-yellow-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
               </svg>
               <h3 className="text-xl font-medium text-yellow-800 mb-2">No Loan Applications Found</h3>
               <p className="text-yellow-700 mb-4">You haven't submitted any loan applications yet.</p>
               <a href="/all-loans" className="btn bg-[#538d22] hover:bg-[#427a19] text-white">
                  Browse Loan Options
               </a>
            </div>
         ) : (
            <div className="overflow-x-auto bg-white rounded-lg shadow">
               <table className="table table-zebra">
                  <thead className="bg-gray-100">
                     <tr>
                        <th>Loan ID</th>
                        <th>Loan Info</th>
                        <th>Amount</th>
                        <th>Status</th>
                        <th>Actions</th>
                     </tr>
                  </thead>
                  <tbody>
                     {loans.map((loan) => (
                        <tr key={loan._id}>
                           <td>{loan._id?.slice(-6)}</td>
                           <td>
                              <div>
                                 <div className="font-medium">{loan.loanTitle || 'N/A'}</div>
                                 <div className="text-sm text-gray-500">
                                    {loan.createdAt ? new Date(loan.createdAt).toLocaleDateString() : 'N/A'}
                                 </div>
                              </div>
                           </td>
                           <td>${loan.loanAmount || 'N/A'}</td>
                           <td>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                 loan.status === 'Approved' ? 'bg-green-100 text-green-800' :
                                 loan.status === 'Rejected' ? 'bg-red-100 text-red-800' :
                                 loan.status === 'Cancelled' ? 'bg-gray-100 text-gray-800' :
                                 'bg-yellow-100 text-yellow-800'
                              }`}>
                                 {loan.status || 'Pending'}
                              </span>
                           </td>
                           <td>
                              <div className="flex flex-wrap gap-2">
                                 <button 
                                    onClick={() => handleViewDetails(loan)}
                                    className="btn btn-sm btn-outline btn-info"
                                 >
                                    View
                                 </button>
                                 
                                 {loan.status === 'Pending' && (
                                    <button 
                                       onClick={() => openCancelModal(loan)}
                                       className="btn btn-sm btn-outline btn-warning"
                                    >
                                       Cancel
                                    </button>
                                 )}
                                 
                                 {loan.applicationFeeStatus === 'unpaid' ? (
                                    <button 
                                       onClick={() => handlePayFee(loan._id)}
                                       className="btn btn-sm btn-outline btn-success"
                                    >
                                       Pay Fee
                                    </button>
                                 ) : (
                                    <span className="btn btn-sm btn-disabled bg-green-100 text-green-800 border-green-200">
                                       Paid
                                    </span>
                                 )}
                              </div>
                           </td>
                        </tr>
                     ))}
                  </tbody>
               </table>
            </div>
         )}

         {/* Loan Details Modal */}
         {isModalOpen && selectedLoan && (
            <div className="fixed inset-0 bg-green-100 bg-opacity-50 flex items-center justify-center p-4 z-50">
               <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                  <div className="p-6">
                     <div className="flex justify-between items-center mb-4">
                        <h3 className="text-2xl font-bold text-[#7cb518]">Loan Application Details</h3>
                        <button 
                           onClick={closeModal}
                           className="btn btn-sm btn-circle btn-ghost"
                        >
                           ✕
                        </button>
                     </div>
                     
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div className="bg-green-50 rounded-xl p-4">
                           <h4 className="text-lg font-semibold text-gray-800 mb-3">Personal Information</h4>
                           <div className="space-y-2">
                              <p><span className="font-medium">Name:</span> {selectedLoan.firstName || 'N/A'} {selectedLoan.lastName || 'N/A'}</p>
                              <p><span className="font-medium">Email:</span> {selectedLoan.email || 'N/A'}</p>
                              <p><span className="font-medium">Contact:</span> {selectedLoan.contactNumber || 'N/A'}</p>
                              <p><span className="font-medium">National ID:</span> {selectedLoan.nationalId || 'N/A'}</p>
                           </div>
                        </div>
                        
                        <div className="bg-green-50 rounded-xl p-4">
                           <h4 className="text-lg font-semibold text-gray-800 mb-3">Loan Information</h4>
                           <div className="space-y-2">
                              <p><span className="font-medium">Loan Type:</span> {selectedLoan.loanTitle || 'N/A'}</p>
                              <p><span className="font-medium">Amount Requested:</span> ${selectedLoan.loanAmount || 'N/A'}</p>
                              <p><span className="font-medium">Income Source:</span> {selectedLoan.incomeSource || 'N/A'}</p>
                              <p><span className="font-medium">Monthly Income:</span> ${selectedLoan.monthlyIncome || 'N/A'}</p>
                           </div>
                        </div>
                        
                        <div className="bg-green-50 rounded-xl p-4 md:col-span-2">
                           <h4 className="text-lg font-semibold text-gray-800 mb-3">Additional Information</h4>
                           <div className="space-y-2">
                              <p><span className="font-medium">Reason for Loan:</span> {selectedLoan.reasonForLoan || 'N/A'}</p>
                              <p><span className="font-medium">Address:</span> {selectedLoan.address || 'N/A'}</p>
                              <p><span className="font-medium">Extra Notes:</span> {selectedLoan.extraNotes || 'None provided'}</p>
                           </div>
                        </div>
                     </div>
                     
                     <div className="flex justify-between items-center">
                        <div>
                           <span className="font-medium">Status:</span>
                           <span className={`ml-2 px-3 py-1 rounded-full text-sm font-medium ${
                              selectedLoan.status === 'Approved' ? 'bg-green-100 text-green-800' :
                              selectedLoan.status === 'Rejected' ? 'bg-red-100 text-red-800' :
                              selectedLoan.status === 'Cancelled' ? 'bg-gray-100 text-gray-800' :
                              'bg-yellow-100 text-yellow-800'
                           }`}>
                              {selectedLoan.status || 'Pending'}
                           </span>
                        </div>
                        <button 
                           onClick={closeModal}
                           className="btn bg-[#538d22] hover:bg-[#427a19] text-white"
                        >
                           Close
                        </button>
                     </div>
                  </div>
               </div>
            </div>
         )}

         {/* Cancel Confirmation Modal */}
         {isCancelModalOpen && loanToCancel && (
            <div className="fixed inset-0 bg-green-50 bg-opacity-50 flex items-center justify-center p-4 z-50">
               <div className="bg-white rounded-lg max-w-md w-full">
                  <div className="p-6">
                     <h3 className="text-xl font-bold text-gray-800 mb-4">Confirm Cancellation</h3>
                     <p className="text-gray-600 mb-6">
                        Are you sure you want to cancel the loan application for <strong>{loanToCancel.loanTitle}</strong>? 
                        This action cannot be undone.
                     </p>
                     <div className="flex justify-end gap-3">
                        <button 
                           onClick={closeCancelModal}
                           className="btn btn-outline"
                        >
                           No, Keep Application
                        </button>
                        <button 
                           onClick={handleCancelLoan}
                           className="btn bg-red-500 hover:bg-red-600 text-white"
                        >
                           Yes, Cancel Application
                        </button>
                     </div>
                  </div>
               </div>
            </div>
         )}
      </div>
   );
};

export default MyLoans;