import React, { useState, useEffect } from 'react';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import Swal from 'sweetalert2';
import Loading from '../../../components/Loading/Loading';

const ManageLoans = () => {
  const [loans, setLoans] = useState([]);
  const [filteredLoans, setFilteredLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const axiosSecure = useAxiosSecure();

  // Set dynamic page title
  useEffect(() => {
    document.title = 'Manage Loans - Finlix Dashboard';
  }, []);

  // Fetch manager loans
  const fetchManagerLoans = async () => {
    try {
      const response = await axiosSecure.get('/loans/manager');
      console.log('Fetched loans:', response.data); // Debug log
      setLoans(response.data || []);  // Ensure we always set an array
      setFilteredLoans(response.data || []);  // Ensure we always set an array
      setLoading(false);
    } catch (error) {
      console.error('Error fetching loans:', error);
      setError(error.message || 'Failed to fetch loans');
      setLoans([]);  // Set empty array on error
      setFilteredLoans([]);  // Set empty array on error
      setLoading(false);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to fetch loans: ' + (error.response?.data?.error || error.message)
      });
    }
  };

  // Search loans
  useEffect(() => {
    const filterLoans = () => {
      if (searchTerm) {
        const filtered = loans.filter(loan => 
          (loan.title && loan.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (loan.loanTitle && loan.loanTitle.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (loan.category && loan.category.toLowerCase().includes(searchTerm.toLowerCase()))
        );
        setFilteredLoans(filtered);
      } else {
        setFilteredLoans(loans);
      }
    };
    
    filterLoans();
  }, [searchTerm, loans]);

  // Fetch manager loans on component mount
  useEffect(() => {
    // Wrap in an async IIFE to avoid the linter warning
    (async () => {
      await fetchManagerLoans();
    })();
  }, []);

  // Add a helper function to normalize loan data
  const normalizeLoanData = (loan) => {
    return {
      ...loan,
      title: loan.title || loan.loanTitle || 'Untitled Loan',
      interestRate: loan.interestRate !== undefined ? loan.interestRate : (loan.rate || 'N/A'),
      category: loan.category || 'Uncategorized'
    };
  };

  // Delete loan
  const deleteLoan = async (loanId) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#538d22',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          // Use the admin delete endpoint for managers
          await axiosSecure.delete(`/loans/${loanId}/admin`);
          
          // Update local state
          const updatedLoans = loans.filter(loan => loan._id !== loanId);
          setLoans(updatedLoans);
          setFilteredLoans(updatedLoans);
          
          Swal.fire({
            icon: 'success',
            title: 'Deleted!',
            text: 'The loan has been deleted.'
          });
        } catch (error) {
          console.error('Error deleting loan:', error);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Failed to delete loan: ' + (error.response?.data?.error || error.message)
          });
        }
      }
    });
  };

  if (loading) {
    return <Loading message="Loading your loans..." />;
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="alert alert-error">
          <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>Error: {error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <h2 className="text-2xl font-bold text-[#7cb518]">Manage Loans</h2>
        <div className="mt-4 md:mt-0">
          <a href="/dashboard/add-loan" className="btn btn-primary">
            Add New Loan
          </a>
        </div>
      </div>
      
      {/* Search Bar */}
      <div className="mb-6">
        <div className="form-control">
          <input
            type="text"
            placeholder="Search by title or category..."
            className="input input-bordered w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="table table-zebra">
          <thead>
            <tr className="bg-gray-100">
              <th>Image</th>
              <th>Title</th>
              <th>Interest</th>
              <th>Category</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredLoans && filteredLoans.length > 0 ? (
              filteredLoans.map((loan) => {
                // Normalize loan data for consistent display
                const normalizedLoan = normalizeLoanData(loan);
                return (
                  <tr key={loan._id}>
                    <td>
                      <div className="avatar">
                        <div className="mask mask-squircle w-12 h-12">
                          <img 
                            src={loan.image || "https://via.placeholder.com/150"} 
                            alt="Loan" 
                          />
                        </div>
                      </div>
                    </td>
                    <td>{normalizedLoan.title}</td>
                    <td>{normalizedLoan.interestRate !== 'N/A' ? `${normalizedLoan.interestRate}%` : 'N/A'}</td>
                    <td>{normalizedLoan.category}</td>
                    <td>
                      <div className="flex space-x-2">
                        <a 
                          href={`/dashboard/update-loan/${loan._id}`}
                          className="btn btn-xs btn-primary"
                        >
                          Update
                        </a>
                        <button 
                          onClick={() => deleteLoan(loan._id)}
                          className="btn btn-xs btn-error"
                        >
                          Delete
                        </button>
                      </div>
                    </td>

                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="5" className="text-center py-8">
                  <div className="flex flex-col items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <h3 className="text-xl font-medium text-gray-700 mb-2">No Loans Found</h3>
                    <p className="text-gray-500 mb-4">You haven't created any loans yet.</p>
                    <a href="/dashboard/add-loan" className="btn btn-primary">
                      Create Your First Loan
                    </a>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageLoans;