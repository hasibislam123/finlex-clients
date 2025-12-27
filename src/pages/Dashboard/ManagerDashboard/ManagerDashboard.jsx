import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import useAuth from '../../../hooks/useAuth';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import { FaUsersCog, FaList, FaFileAlt } from "react-icons/fa";
import Loading from '../../../components/Loading/Loading';

const ManagerDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalLoans: 0,
    pendingApplications: 0,
    approvedLoans: 0,
    totalUsers: 0,
    borrowerCount: 0,
    managerCount: 0,
    adminCount: 0
  });
  const [recentLoans, setRecentLoans] = useState([]);
  const [loading, setLoading] = useState(true); // Default to true
  const [error, setError] = useState(null);
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();

  // Set dynamic page title
  useEffect(() => {
    document.title = 'Manager Dashboard - Finlix';
  }, []);

  useEffect(() => {
    const fetchManagerStats = async () => {
      try {
        setLoading(true);
        setError(null); // Clear any previous errors
        console.log('Fetching manager stats...');
        
        // Fetch stats for manager using appropriate endpoints
        const [loansRes, usersRes] = await Promise.all([
          axiosSecure.get('/loans/manager'), 
          axiosSecure.get('/users/manager-stats') 
        ]);

        console.log('Loans response:', loansRes.data);
        console.log('Users response:', usersRes.data);

        const loans = loansRes.data || [];
        const userStats = usersRes.data || {};

        // Get pending loans for stats
        const pendingLoansRes = await axiosSecure.get('/loans/pending');
        const pendingLoans = pendingLoansRes.data || [];
        console.log('Pending loans response:', pendingLoans);

        // Get approved loans for stats
        const approvedLoansRes = await axiosSecure.get('/loans/approved');
        const approvedLoans = approvedLoansRes.data || [];
        console.log('Approved loans response:', approvedLoans);

        setStats({
          totalLoans: loans.length || 0,
          pendingApplications: pendingLoans.length || 0,
          approvedLoans: approvedLoans.length || 0,
          totalUsers: userStats.totalUsers || 0,
          borrowerCount: userStats.borrowerCount || 0,
          managerCount: userStats.managerCount || 0,
          adminCount: userStats.adminCount || 0
        });

        console.log('Setting stats:', {
          totalLoans: loans.length || 0,
          pendingApplications: pendingLoans.length || 0,
          approvedLoans: approvedLoans.length || 0,
          totalUsers: userStats.totalUsers || 0,
          borrowerCount: userStats.borrowerCount || 0,
          managerCount: userStats.managerCount || 0,
          adminCount: userStats.adminCount || 0
        });

        // Get recent loans (manager's own loans)
        setRecentLoans(loans.slice(0, 5) || []);
      } catch (error) {
        console.error('Error fetching manager stats:', error);
        console.error('Error response:', error.response);
        setError(error.message || 'Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    // Wrap in an async IIFE to avoid the linter warning
    (async () => {
      await fetchManagerStats();
    })();
  }, [axiosSecure]);

  if (loading) {
    return <Loading />;
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
        <div className="mt-4">
          <button 
            className="btn btn-primary" 
            onClick={() => window.location.reload()}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#7cb518]">Manager Dashboard</h1>
        <p className="text-[#7cb518] mt-2">Welcome, {user?.displayName || 'Manager'}! Here's an overview of the system.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-700">Total Loans</h3>
          <p className="text-3xl font-bold text-blue-600 mt-2">{stats.totalLoans}</p>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-700">Pending Applications</h3>
          <p className="text-3xl font-bold text-yellow-600 mt-2">{stats.pendingApplications}</p>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-700">Approved Loans</h3>
          <p className="text-3xl font-bold text-green-600 mt-2">{stats.approvedLoans}</p>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-700">Total Users</h3>
          <p className="text-3xl font-bold text-purple-600 mt-2">{stats.totalUsers}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800">Recent Loan Applications</h2>
          </div>
          
          {recentLoans.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="table table-zebra">
                <thead>
                  <tr className="bg-gray-100">
                    <th>Applicant</th>
                    <th>Loan Type</th>
                    <th>Amount</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentLoans && Array.isArray(recentLoans) && recentLoans.length > 0 ? (
                    recentLoans.map((loan) => (
                      <tr key={loan._id || loan.id || Math.random()}>
                        <td>{loan.name || loan.firstName + ' ' + loan.lastName || loan.email || 'N/A'}</td>
                        <td>{loan.title || loan.loanTitle || loan.category || 'N/A'}</td>
                        <td>${loan.maxLoanLimit ? Number(loan.maxLoanLimit).toLocaleString() : (loan.loanAmount ? Number(loan.loanAmount).toLocaleString() : 'N/A')}</td>
                        <td>
                          <span className={`badge ${
                            (loan.status || '').toLowerCase() === 'approved' ? 'badge-success' : 
                            (loan.status || '').toLowerCase() === 'rejected' ? 'badge-error' : 
                            'badge-warning'
                          }`}>
                            {loan.status || 'Pending'}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="text-center py-4">
                        No recent loan applications found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-8 text-center">
              <p className="text-gray-500">No loan applications found.</p>
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800">Quick Actions</h2>
          </div>
          
          <div className="p-6">
            <div className="space-y-4">
              <button 
                onClick={() => navigate('/dashboard/manage-users')}
                className="btn btn-outline btn-primary w-full justify-start"
              >
                <FaUsersCog className="mr-2" />
                Manage Users
              </button>
              <button 
                onClick={() => navigate('/dashboard/manage-loans')}
                className="btn btn-outline btn-secondary w-full justify-start"
              >
                <FaList className="mr-2" />
                View All Loans
              </button>
              <button 
                onClick={() => navigate('/dashboard/pending-loans')}
                className="btn btn-outline btn-accent w-full justify-start"
              >
                <FaFileAlt className="mr-2" />
                Review Applications
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManagerDashboard;