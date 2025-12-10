import React, { useState, useEffect } from 'react';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import Swal from 'sweetalert2';

const ApprovedLoans = () => {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedLoan, setSelectedLoan] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const axiosSecure = useAxiosSecure();

  // Set dynamic page title
  useEffect(() => {
    document.title = 'Approved Loans - Finlix Dashboard';
  }, []);

  // Fetch approved loans
  const fetchApprovedLoans = async () => {
    try {
      const response = await axiosSecure.get('/loans/approved');
      setLoans(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching approved loans:', error);
      setLoading(false);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to fetch approved loans'
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

  // Fetch approved loans on component mount
  useEffect(() => {
    // Wrap in an async IIFE to avoid the linter warning
    (async () => {
      await fetchApprovedLoans();
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
      <h2 className="text-2xl font-bold mb-6 text-[#7cb518]">Approved Loan Applications</h2>
      
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="table table-zebra">
          <thead>
            <tr className="bg-gray-100">
              <th>Loan ID</th>
              <th>User Info</th>
              <th>Amount</th>
              <th>Approved Date</th>
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
                      <div className="font-bold">{loan.name}</div>
                      <div className="text-sm">{loan.email}</div>
                    </div>
                  </td>
                  <td>${loan.loanAmount?.toLocaleString()}</td>
                  <td>{loan.approvedAt ? new Date(loan.approvedAt).toLocaleDateString() : 'N/A'}</td>
                  <td>
                    <button 
                      className="btn btn-xs btn-info"
                      onClick={() => viewLoanDetails(loan)}
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center py-8">
                  No approved loan applications
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Loan Details Modal */}
      {isModalOpen && selectedLoan && (
        <div className="fixed inset-0 bg-green-50 bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="bg-gradient-to-r from-green-600 to-green-700 px-6 py-4 flex justify-between items-center rounded-t-2xl">
              <h3 className="text-2xl font-bold text-white">Loan Application Details</h3>
              <button 
                onClick={closeModal}
                className="text-white hover:text-gray-200 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Personal Information Card */}
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 shadow-md border border-blue-100">
                  <div className="flex items-center mb-4">
                    <div className="bg-blue-100 p-2 rounded-lg mr-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <h4 className="text-xl font-bold text-gray-800">Personal Information</h4>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between border-b border-blue-100 pb-2">
                      <span className="text-gray-600">Full Name</span>
                      <span className="font-medium text-gray-900">{selectedLoan.firstName || selectedLoan.name || 'N/A'} {selectedLoan.lastName || ''}</span>
                    </div>
                    <div className="flex justify-between border-b border-blue-100 pb-2">
                      <span className="text-gray-600">Email Address</span>
                      <span className="font-medium text-gray-900">{selectedLoan.email || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between border-b border-blue-100 pb-2">
                      <span className="text-gray-600">Phone Number</span>
                      <span className="font-medium text-gray-900">{selectedLoan.contactNumber || selectedLoan.phone || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between border-b border-blue-100 pb-2">
                      <span className="text-gray-600">National ID</span>
                      <span className="font-medium text-gray-900">{selectedLoan.nationalId || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Address</span>
                      <span className="font-medium text-gray-900 text-right">{selectedLoan.address || 'N/A'}</span>
                    </div>
                  </div>
                </div>
                
                {/* Loan Information Card */}
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 shadow-md border border-green-100">
                  <div className="flex items-center mb-4">
                    <div className="bg-green-100 p-2 rounded-lg mr-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h4 className="text-xl font-bold text-gray-800">Loan Information</h4>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between border-b border-green-100 pb-2">
                      <span className="text-gray-600">Loan Type</span>
                      <span className="font-medium text-gray-900">{selectedLoan.loanTitle || selectedLoan.title || selectedLoan.loanType || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between border-b border-green-100 pb-2">
                      <span className="text-gray-600">Loan Amount</span>
                      <span className="font-medium text-gray-900">${selectedLoan.loanAmount?.toLocaleString() || selectedLoan.amount?.toLocaleString() || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between border-b border-green-100 pb-2">
                      <span className="text-gray-600">Interest Rate</span>
                      <span className="font-medium text-gray-900">{selectedLoan.interestRate || 'N/A'}%</span>
                    </div>
                    <div className="flex justify-between border-b border-green-100 pb-2">
                      <span className="text-gray-600">Loan Term</span>
                      <span className="font-medium text-gray-900">{selectedLoan.loanTerm || 'N/A'} months</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Income Source</span>
                      <span className="font-medium text-gray-900">{selectedLoan.incomeSource || 'N/A'}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Additional Information Card */}
              <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-6 shadow-md border border-amber-100 mt-6">
                <div className="flex items-center mb-4">
                  <div className="bg-amber-100 p-2 rounded-lg mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                  <h4 className="text-xl font-bold text-gray-800">Additional Information</h4>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-4">
                    <div className="flex justify-between border-b border-amber-100 pb-2">
                      <span className="text-gray-600">Employment Status</span>
                      <span className="font-medium text-gray-900">{selectedLoan.employmentStatus || selectedLoan.incomeSource || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between border-b border-amber-100 pb-2">
                      <span className="text-gray-600">Annual Income</span>
                      <span className="font-medium text-gray-900">${selectedLoan.annualIncome?.toLocaleString() || selectedLoan.monthlyIncome?.toLocaleString() || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Loan Purpose</span>
                      <span className="font-medium text-gray-900 text-right">{selectedLoan.loanPurpose || selectedLoan.reasonForLoan || 'N/A'}</span>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex justify-between border-b border-amber-100 pb-2">
                      <span className="text-gray-600">Application Date</span>
                      <span className="font-medium text-gray-900">{selectedLoan.createdAt ? new Date(selectedLoan.createdAt).toLocaleDateString() : 'N/A'}</span>
                    </div>
                    <div className="flex justify-between border-b border-amber-100 pb-2">
                      <span className="text-gray-600">Approved Date</span>
                      <span className="font-medium text-gray-900">{selectedLoan.approvedAt ? new Date(selectedLoan.approvedAt).toLocaleDateString() : 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Extra Notes</span>
                      <span className="font-medium text-gray-900 text-right">{selectedLoan.extraNotes || 'None provided'}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Status Section */}
              <div className="mt-6 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl p-6 text-center">
                <h4 className="text-lg font-bold text-white mb-2">Application Status</h4>
                <div className="inline-flex items-center px-4 py-2 rounded-full bg-white bg-opacity-20">
                  <span className="w-3 h-3 bg-white rounded-full mr-2"></span>
                  <span className="text-black font-bold text-lg">{selectedLoan.status}</span>
                </div>
              </div>
            </div>
            
            <div className="border-t border-gray-200 px-6 py-4 bg-gray-50 rounded-b-2xl flex justify-end">
              <button
                onClick={closeModal}
                className="px-6 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white font-medium rounded-lg hover:from-green-600 hover:to-green-700 transition-all shadow-md hover:shadow-lg"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApprovedLoans;