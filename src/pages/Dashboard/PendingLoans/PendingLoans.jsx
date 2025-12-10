import React, { useState, useEffect } from 'react';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import Swal from 'sweetalert2';

const PendingLoans = () => {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedLoan, setSelectedLoan] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const axiosSecure = useAxiosSecure();

  // Set dynamic page title
  useEffect(() => {
    document.title = 'Pending Loans - Finlix Dashboard';
  }, []);

  // Fetch pending loans
  const fetchPendingLoans = async () => {
    try {
      const response = await axiosSecure.get('/loans/pending');
      setLoans(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching pending loans:', error);
      setLoading(false);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to fetch pending loans'
      });
    }
  };

  // View loan details
  const viewLoanDetails = (loan) => {
    setSelectedLoan(loan);
    setIsModalOpen(true);
  };

  // Close modal
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedLoan(null);
  };

  // Approve loan
  const approveLoan = async (loanId) => {
    Swal.fire({
      title: 'Approve Loan?',
      text: "Do you want to approve this loan application?",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#538d22',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, approve it!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          // Use the correct endpoint for updating loan status
          await axiosSecure.patch(`/loans/${loanId}/status`, { status: 'Approved' });
          
          // Update local state
          const updatedLoans = loans.filter(loan => loan._id !== loanId);
          setLoans(updatedLoans);
          
          // Close modal if it's open for this loan
          if (selectedLoan && selectedLoan._id === loanId) {
            closeModal();
          }
          
          Swal.fire({
            icon: 'success',
            title: 'Approved!',
            text: 'The loan application has been approved.'
          });
        } catch (error) {
          console.error('Error approving loan:', error);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Failed to approve loan'
          });
        }
      }
    });
  };

  // Reject loan
  const rejectLoan = async (loanId) => {
    Swal.fire({
      title: 'Reject Loan?',
      text: "Do you want to reject this loan application?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#538d22',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, reject it!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          // Use the correct endpoint for updating loan status
          await axiosSecure.patch(`/loans/${loanId}/status`, { status: 'Rejected' });
          
          // Update local state
          const updatedLoans = loans.filter(loan => loan._id !== loanId);
          setLoans(updatedLoans);
          
          // Close modal if it's open for this loan
          if (selectedLoan && selectedLoan._id === loanId) {
            closeModal();
          }
          
          Swal.fire({
            icon: 'success',
            title: 'Rejected!',
            text: 'The loan application has been rejected.'
          });
        } catch (error) {
          console.error('Error rejecting loan:', error);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Failed to reject loan'
          });
        }
      }
    });
  };

  // Fetch pending loans on component mount
  useEffect(() => {
    // Wrap in an async IIFE to avoid the linter warning
    (async () => {
      await fetchPendingLoans();
    })();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6 text-[#7cb518]">Pending Loan Applications</h2>
      
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="table table-zebra">
          <thead>
            <tr className="bg-gray-100">
              <th>Loan ID</th>
              <th>User Info</th>
              <th>Amount</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loans.length > 0 ? (
              loans.map((loan) => (
                <tr key={loan._id}>
                  <td>{loan._id.substring(0, 8)}...</td>
                  <td>
                    <div>
                      <div className="font-bold">{loan.name || loan.firstName + ' ' + loan.lastName}</div>
                      <div className="text-sm">{loan.email}</div>
                    </div>
                  </td>
                  <td>${loan.loanAmount?.toLocaleString() || loan.amount?.toLocaleString()}</td>
                  <td>{new Date(loan.createdAt).toLocaleDateString()}</td>
                  <td>
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => approveLoan(loan._id)}
                        className="btn btn-xs btn-success"
                      >
                        Approve
                      </button>
                      <button 
                        onClick={() => rejectLoan(loan._id)}
                        className="btn btn-xs btn-error"
                      >
                        Reject
                      </button>
                      <button 
                        onClick={() => viewLoanDetails(loan)}
                        className="btn btn-xs btn-info"
                      >
                        View
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center py-8">
                  No pending loan applications
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Loan Details Modal */}
      {isModalOpen && selectedLoan && (
        <div className="fixed inset-0 bg-green-50 bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-2xl font-bold text-gray-800">Loan Application Details</h3>
                <button 
                  onClick={closeModal}
                  className="btn btn-sm btn-circle btn-ghost"
                >
                  ✕
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {/* Personal Information */}
                <div className="bg-blue-50 rounded-xl p-4">
                  <h4 className="text-lg font-semibold text-gray-800 mb-3">Personal Information</h4>
                  <div className="space-y-2">
                    <p><span className="font-medium">Full Name:</span> {selectedLoan.firstName || 'N/A'} {selectedLoan.lastName || 'N/A'}</p>
                    <p><span className="font-medium">Email:</span> {selectedLoan.email || 'N/A'}</p>
                    <p><span className="font-medium">Contact Number:</span> {selectedLoan.contactNumber || 'N/A'}</p>
                    <p><span className="font-medium">National ID/Passport:</span> {selectedLoan.nationalId || 'N/A'}</p>
                    <p><span className="font-medium">Address:</span> {selectedLoan.address || 'N/A'}</p>
                  </div>
                </div>
                
                {/* Loan Information */}
                <div className="bg-green-50 rounded-xl p-4">
                  <h4 className="text-lg font-semibold text-gray-800 mb-3">Loan Information</h4>
                  <div className="space-y-2">
                    <p><span className="font-medium">Loan Title:</span> {selectedLoan.loanTitle || selectedLoan.title || 'N/A'}</p>
                    <p><span className="font-medium">Interest Rate:</span> {selectedLoan.interestRate || 'N/A'}%</p>
                    <p><span className="font-medium">Loan Amount:</span> ${selectedLoan.loanAmount?.toLocaleString() || selectedLoan.amount?.toLocaleString() || 'N/A'}</p>
                    <p><span className="font-medium">Income Source:</span> {selectedLoan.incomeSource || 'N/A'}</p>
                    <p><span className="font-medium">Monthly Income:</span> ${selectedLoan.monthlyIncome?.toLocaleString() || 'N/A'}</p>
                  </div>
                </div>
                
                {/* Additional Information */}
                <div className="bg-yellow-50 rounded-xl p-4 md:col-span-2">
                  <h4 className="text-lg font-semibold text-gray-800 mb-3">Additional Information</h4>
                  <div className="space-y-2">
                    <p><span className="font-medium">Reason for Loan:</span> {selectedLoan.reasonForLoan || 'N/A'}</p>
                    <p><span className="font-medium">Extra Notes:</span> {selectedLoan.extraNotes || 'None provided'}</p>
                    <p><span className="font-medium">Application Date:</span> {selectedLoan.createdAt ? new Date(selectedLoan.createdAt).toLocaleString() : 'N/A'}</p>
                    <p><span className="font-medium">Application Fee:</span> ${selectedLoan.applicationFee || '0.00'} ({selectedLoan.applicationFeeStatus || 'N/A'})</p>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <div>
                  <span className="font-medium">Status:</span>
                  <span className="ml-2 px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                    {selectedLoan.status || 'N/A'}
                  </span>
                </div>
                <div className="space-x-2">
                  <button 
                    onClick={closeModal}
                    className="btn btn-outline"
                  >
                    Close
                  </button>
                  <button 
                    onClick={() => approveLoan(selectedLoan._id)}
                    className="btn bg-green-500 hover:bg-green-600 text-white"
                  >
                    Approve
                  </button>
                  <button 
                    onClick={() => rejectLoan(selectedLoan._id)}
                    className="btn bg-red-500 hover:bg-red-600 text-white"
                  >
                    Reject
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PendingLoans;