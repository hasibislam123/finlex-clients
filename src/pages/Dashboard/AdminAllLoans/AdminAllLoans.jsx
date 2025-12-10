import React, { useState, useEffect } from 'react';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import Swal from 'sweetalert2';
import Loading from '../../../components/Loading/Loading';

const AdminAllLoans = () => {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const axiosSecure = useAxiosSecure();

  // Set dynamic page title
  useEffect(() => {
    document.title = 'All Loans - Finlix Admin Dashboard';
  }, []);

  // Fetch all loans
  const fetchAllLoans = async () => {
    try {
      const response = await axiosSecure.get('/loans/admin');
      setLoans(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching loans:', error);
      setLoading(false);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to fetch loans'
      });
    }
  };

  // Update loan (redirect to update page)
  const updateLoan = (loanId) => {
    // In a real implementation, this would redirect to an update page
    // For now, we'll show an alert that this feature would redirect
    Swal.fire({
      title: 'Update Loan',
      text: `This would redirect to update loan with ID: ${loanId}`,
      icon: 'info',
      confirmButtonText: 'OK'
    });
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
          const response = await axiosSecure.delete(`/loans/${loanId}/admin`);
          
          if (response.data.result.deletedCount > 0) {
            // Update local state
            const updatedLoans = loans.filter(loan => loan._id !== loanId);
            setLoans(updatedLoans);
            
            Swal.fire({
              icon: 'success',
              title: 'Deleted!',
              text: 'The loan has been deleted successfully.'
            });
          } else {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Failed to delete loan.'
            });
          }
        } catch (error) {
          console.error('Error deleting loan:', error);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Failed to delete loan'
          });
        }
      }
    });
  };

  // Toggle show on home
  const toggleShowOnHome = async (loanId, currentShowOnHome) => {
    try {
      const response = await axiosSecure.patch(`/loans/${loanId}/show-on-home`, { 
        showOnHome: !currentShowOnHome 
      });
      
      if (response.data.result.modifiedCount > 0) {
        // Update local state
        setLoans(loans.map(loan => 
          loan._id === loanId ? { ...loan, showOnHome: !currentShowOnHome } : loan
        ));
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: `Loan ${!currentShowOnHome ? 'added to' : 'removed from'} home page`
        });
      } else {
        Swal.fire({
          icon: 'info',
          title: 'No Changes',
          text: 'The loan show on home setting was not updated'
        });
      }
    } catch (error) {
      console.error('Error updating loan show on home:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to update loan show on home setting'
      });
    }
  };

  // Fetch all loans on component mount
  useEffect(() => {
    // Wrap in an async IIFE to avoid the linter warning
    (async () => {
      await fetchAllLoans();
    })();
  }, []);

  if (loading) {
    return <Loading message="Loading all loans..." />;
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6 text-[#7cb517]">All Loans</h2>
      
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="table table-zebra">
          <thead>
            <tr className="bg-gray-100">
              <th>Image</th>
              <th>Title</th>
              <th>Interest</th>
              <th>Category</th>
              <th>Created By</th>
              <th>Show on Home</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loans.map((loan) => (
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
                <td>{loan.title || loan.loanTitle || loan.name || loan.type || 'N/A'}</td>
                <td>{loan.interestRate || loan.rate || 'N/A'}%</td>
                <td>{loan.category || loan.loanCategory || 'General'}</td>
                <td>{loan.createdBy || loan.manager || 'System'}</td>
                <td>
                  <input 
                    type="checkbox" 
                    className="toggle toggle-success"
                    checked={loan.showOnHome || false}
                    onChange={() => toggleShowOnHome(loan._id, loan.showOnHome)}
                  />
                </td>
                <td>
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => updateLoan(loan._id)}
                      className="btn btn-xs btn-primary"
                    >
                      Update
                    </button>
                    <button 
                      onClick={() => deleteLoan(loan._id)}
                      className="btn btn-xs btn-error"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminAllLoans;