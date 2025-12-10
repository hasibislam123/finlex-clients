import React, { useState, useEffect } from 'react';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import Swal from 'sweetalert2';

const LoanApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const axiosSecure = useAxiosSecure();

  // Set dynamic page title
  useEffect(() => {
    document.title = 'Loan Applications - Finlix Dashboard';
  }, []);

  // Fetch all loan applications
  const fetchLoanApplications = async () => {
    try {
      const response = await axiosSecure.get('/loans/applications');
      setApplications(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching loan applications:', error);
      setLoading(false);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to fetch loan applications'
      });
    }
  };

  // Fetch all loan applications on component mount
  useEffect(() => {
    // Wrap in an async IIFE to avoid the linter warning
    (async () => {
      await fetchLoanApplications();
    })();
  }, []);

  // View application details
  const viewApplicationDetails = (application) => {
    setSelectedApplication(application);
    setIsModalOpen(true);
  };

  // Close modal
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedApplication(null);
  };

  // Update application status
  const updateApplicationStatus = async (applicationId, newStatus) => {
    try {
      // Use the correct admin endpoint for updating loan status
      const response = await axiosSecure.patch(`/loans/${applicationId}/status/admin`, { status: newStatus });
      
      // The response.data contains { message: 'Loan status updated successfully', result }
      // Where result is the MongoDB update result with matchedCount and modifiedCount properties
      if (response.data.result?.matchedCount > 0) {
        // Update local state
        setApplications(applications.map(application => 
          application._id === applicationId ? { ...application, status: newStatus } : application
        ));
        
        // Close modal if it's open for this application
        if (selectedApplication && selectedApplication._id === applicationId) {
          closeModal();
        }
        
        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: `Loan application has been ${newStatus.toLowerCase()}.`
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to update application status'
        });
      }
    } catch (error) {
      console.error('Error updating application status:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to update application status'
      });
    }
  };

  // Handle status change
  const handleStatusChange = (applicationId, newStatus) => {
    Swal.fire({
      title: 'Are you sure?',
      text: `Do you want to ${newStatus.toLowerCase()} this application?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#538d22',
      cancelButtonColor: '#d33',
      confirmButtonText: `Yes, ${newStatus.toLowerCase()} it!`
    }).then((result) => {
      if (result.isConfirmed) {
        updateApplicationStatus(applicationId, newStatus);
      }
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6 text-[#7cb518]">Loan Applications</h2>
      
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="table table-zebra">
          <thead>
            <tr className="bg-gray-100">
              <th>Applicant</th>
              <th>Email</th>
              <th>Loan Type</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Applied Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {applications.map((application) => (
              <tr key={application._id}>
                <td>{application.name || application.firstName + ' ' + application.lastName || 'N/A'}</td>
                <td>{application.email || 'N/A'}</td>
                <td>{application.loanTitle || application.title || 'N/A'}</td>
                <td>${application.loanAmount?.toLocaleString() || application.amount?.toLocaleString() || 'N/A'}</td>
                <td>
                  <span className={`badge ${
                    application.status === 'Approved' ? 'badge-success' : 
                    application.status === 'Rejected' ? 'badge-error' : 
                    application.status === 'Reviewing' ? 'badge-warning' : 
                    'badge-info'
                  }`}>
                    {application.status || 'N/A'}
                  </span>
                </td>
                <td>{application.createdAt ? new Date(application.createdAt).toLocaleDateString() : 'N/A'}</td>
                <td>
                  <button 
                    onClick={() => viewApplicationDetails(application)}
                    className="btn btn-xs btn-info mr-2"
                  >
                    View
                  </button>
                  {application.status === 'Pending' && (
                    <>
                      <button 
                        onClick={() => handleStatusChange(application._id, 'Approved')}
                        className="btn btn-xs btn-success mr-2"
                      >
                        Approve
                      </button>
                      <button 
                        onClick={() => handleStatusChange(application._id, 'Rejected')}
                        className="btn btn-xs btn-error"
                      >
                        Reject
                      </button>
                    </>
                  )}
                  {application.status === 'Reviewing' && (
                    <>
                      <button 
                        onClick={() => handleStatusChange(application._id, 'Approved')}
                        className="btn btn-xs btn-success mr-2"
                      >
                        Approve
                      </button>
                      <button 
                        onClick={() => handleStatusChange(application._id, 'Rejected')}
                        className="btn btn-xs btn-error"
                      >
                        Reject
                      </button>
                    </>
                  )}
                  {(application.status === 'Approved' || application.status === 'Rejected') && (
                    <span className="text-gray-500">Finalized</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Loan Application Details Modal */}
      {isModalOpen && selectedApplication && (
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
                    <p><span className="font-medium">Full Name:</span> {selectedApplication.firstName || 'N/A'} {selectedApplication.lastName || 'N/A'}</p>
                    <p><span className="font-medium">Email:</span> {selectedApplication.email || 'N/A'}</p>
                    <p><span className="font-medium">Contact Number:</span> {selectedApplication.contactNumber || 'N/A'}</p>
                    <p><span className="font-medium">National ID/Passport:</span> {selectedApplication.nationalId || 'N/A'}</p>
                    <p><span className="font-medium">Address:</span> {selectedApplication.address || 'N/A'}</p>
                  </div>
                </div>
                
                {/* Loan Information */}
                <div className="bg-green-50 rounded-xl p-4">
                  <h4 className="text-lg font-semibold text-gray-800 mb-3">Loan Information</h4>
                  <div className="space-y-2">
                    <p><span className="font-medium">Loan Title:</span> {selectedApplication.loanTitle || selectedApplication.title || 'N/A'}</p>
                    <p><span className="font-medium">Interest Rate:</span> {selectedApplication.interestRate || 'N/A'}%</p>
                    <p><span className="font-medium">Loan Amount:</span> ${selectedApplication.loanAmount?.toLocaleString() || selectedApplication.amount?.toLocaleString() || 'N/A'}</p>
                    <p><span className="font-medium">Income Source:</span> {selectedApplication.incomeSource || 'N/A'}</p>
                    <p><span className="font-medium">Monthly Income:</span> ${selectedApplication.monthlyIncome?.toLocaleString() || 'N/A'}</p>
                  </div>
                </div>
                
                {/* Additional Information */}
                <div className="bg-yellow-50 rounded-xl p-4 md:col-span-2">
                  <h4 className="text-lg font-semibold text-gray-800 mb-3">Additional Information</h4>
                  <div className="space-y-2">
                    <p><span className="font-medium">Reason for Loan:</span> {selectedApplication.reasonForLoan || 'N/A'}</p>
                    <p><span className="font-medium">Extra Notes:</span> {selectedApplication.extraNotes || 'None provided'}</p>
                    <p><span className="font-medium">Application Date:</span> {selectedApplication.createdAt ? new Date(selectedApplication.createdAt).toLocaleString() : 'N/A'}</p>
                    <p><span className="font-medium">Application Fee:</span> ${selectedApplication.applicationFee || '0.00'} ({selectedApplication.applicationFeeStatus || 'N/A'})</p>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <div>
                  <span className="font-medium">Status:</span>
                  <span className={`ml-2 px-3 py-1 rounded-full text-sm font-medium ${
                    selectedApplication.status === 'Approved' ? 'bg-green-100 text-green-800' :
                    selectedApplication.status === 'Rejected' ? 'bg-red-100 text-red-800' :
                    selectedApplication.status === 'Reviewing' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {selectedApplication.status || 'N/A'}
                  </span>
                </div>
                <div className="space-x-2">
                  <button 
                    onClick={closeModal}
                    className="btn btn-outline"
                  >
                    Close
                  </button>
                  {selectedApplication.status === 'Pending' && (
                    <>
                      <button 
                        onClick={() => handleStatusChange(selectedApplication._id, 'Approved')}
                        className="btn bg-green-500 hover:bg-green-600 text-white"
                      >
                        Approve
                      </button>
                      <button 
                        onClick={() => handleStatusChange(selectedApplication._id, 'Rejected')}
                        className="btn bg-red-500 hover:bg-red-600 text-white"
                      >
                        Reject
                      </button>
                    </>
                  )}
                  {selectedApplication.status === 'Reviewing' && (
                    <>
                      <button 
                        onClick={() => handleStatusChange(selectedApplication._id, 'Approved')}
                        className="btn bg-green-500 hover:bg-green-600 text-white"
                      >
                        Approve
                      </button>
                      <button 
                        onClick={() => handleStatusChange(selectedApplication._id, 'Rejected')}
                        className="btn bg-red-500 hover:bg-red-600 text-white"
                      >
                        Reject
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoanApplications;