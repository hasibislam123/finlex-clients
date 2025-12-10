import React, { useState, useEffect } from 'react';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import Swal from 'sweetalert2';
import Loading from '../../../components/Loading/Loading';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const axiosSecure = useAxiosSecure();

  // Set dynamic page title
  useEffect(() => {
    document.title = 'Manage Users - Finlix Admin Dashboard';
  }, []);

  // Fetch all users
  const fetchUsers = async () => {
    try {
      const response = await axiosSecure.get('/users');
      setUsers(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching users:', error);
      setLoading(false);
      
      // Better error handling to prevent JSON parsing errors
      let errorMessage = 'Failed to fetch users';
      if (error.response) {
        // Server responded with error status
        if (error.response.data && error.response.data.error) {
          errorMessage = error.response.data.error;
        } else if (error.response.statusText) {
          errorMessage = `Server error: ${error.response.status} ${error.response.statusText}`;
        } else {
          errorMessage = `Server error: ${error.response.status}`;
        }
      } else if (error.request) {
        // Request was made but no response received
        errorMessage = 'Network error: Unable to reach server';
      } else {
        // Something else happened
        errorMessage = error.message || 'Unknown error occurred';
      }
      
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: errorMessage
      });
    }
  };

  useEffect(() => {
    // Wrap in an async IIFE to avoid the linter warning
    (async () => {
      await fetchUsers();
    })();
  }, []);

  // Update user role
  const updateUserRole = async (userId, newRole) => {
    try {
      await axiosSecure.patch(`/users/${userId}/role`, { role: newRole });
      // Update local state
      setUsers(users.map(user => 
        user._id === userId ? { ...user, role: newRole } : user
      ));
      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'User role updated successfully'
      });
    } catch (error) {
      console.error('Error updating user role:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to update user role'
      });
    }
  };

  // Handle role change
  const handleRoleChange = (userId, newRole) => {
    Swal.fire({
      title: 'Are you sure?',
      text: `Do you want to change this user's role to ${newRole}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#538d22',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, update it!'
    }).then((result) => {
      if (result.isConfirmed) {
        updateUserRole(userId, newRole);
      }
    });
  };

  // Suspend user
  const suspendUser = async (userId) => {
    try {
      await axiosSecure.patch(`/users/${userId}/suspend`);
      // Update local state
      setUsers(users.map(user => 
        user._id === userId ? { ...user, status: 'suspended' } : user
      ));
      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'User suspended successfully'
      });
    } catch (error) {
      console.error('Error suspending user:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to suspend user'
      });
    }
  };

  // Approve user
  const approveUser = async (userId) => {
    try {
      await axiosSecure.patch(`/users/${userId}/approve`);
      // Update local state
      setUsers(users.map(user => 
        user._id === userId ? { ...user, status: 'approved' } : user
      ));
      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'User approved successfully'
      });
    } catch (error) {
      console.error('Error approving user:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to approve user'
      });
    }
  };

  // Handle suspend/approve action
  const handleStatusChange = (userId, action) => {
    const actionText = action === 'suspend' ? 'suspend' : 'approve';
    Swal.fire({
      title: 'Are you sure?',
      text: `Do you want to ${actionText} this user?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#538d22',
      cancelButtonColor: '#d33',
      confirmButtonText: `Yes, ${actionText}!`
    }).then((result) => {
      if (result.isConfirmed) {
        if (action === 'suspend') {
          suspendUser(userId);
        } else {
          approveUser(userId);
        }
      }
    });
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6 text-[#7cb518]">Manage Users</h2>
      
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="table table-zebra">
          <thead>
            <tr className="bg-gray-100">
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td>
                  <div className="flex items-center space-x-3">
                    <div className="avatar">
                      <div className="mask mask-squircle w-12 h-12">
                        <img 
                          src={user.photoURL || "https://via.placeholder.com/150"} 
                          alt="Avatar" 
                        />
                      </div>
                    </div>
                    <div>
                      <div className="font-bold">{user.name || 'N/A'}</div>
                    </div>
                  </div>
                </td>
                <td>{user.email}</td>
                <td>
                  <select 
                    value={user.role} 
                    onChange={(e) => handleRoleChange(user._id, e.target.value)}
                    className="select select-bordered select-sm w-full max-w-xs"
                  >
                    <option value="borrower">Borrower</option>
                    <option value="manager">Manager</option>
                    <option value="admin">Admin</option>
                  </select>
                </td>
                <td>
                  <span className={`badge ${user.status === 'approved' ? 'badge-success' : user.status === 'suspended' ? 'badge-error' : 'badge-warning'}`}>
                    {user.status || 'pending'}
                  </span>
                </td>
                <td>
                  {user.status !== 'suspended' ? (
                    <button 
                      onClick={() => handleStatusChange(user._id, 'suspend')}
                      className="btn btn-xs btn-error mr-2"
                    >
                      Suspend
                    </button>
                  ) : (
                    <button 
                      onClick={() => handleStatusChange(user._id, 'approve')}
                      className="btn btn-xs btn-success mr-2"
                    >
                      Approve
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageUsers;