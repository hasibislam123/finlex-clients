import React, { useEffect, useState } from 'react';
import useAuth from '../../../hooks/useAuth';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import { FaUsers, FaList, FaFileAlt, FaChartBar } from 'react-icons/fa';
import Loading from '../../../components/Loading/Loading';

const AdminDashboard = () => {
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
  const [recentActivities, setRecentActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const axiosSecure = useAxiosSecure();

  // Set dynamic page title
  useEffect(() => {
    document.title = 'Admin Dashboard - Finlix';
  }, []);

  const fetchAdminStats = async () => {
    try {
      // Fetch stats for admin
      const [loansRes, usersRes] = await Promise.all([
        axiosSecure.get('/loans/admin'),
        axiosSecure.get('/users')
      ]);

      const loans = loansRes.data;
      const users = usersRes.data;

      const borrowerCount = users.filter(u => u.role === 'borrower').length;
      const managerCount = users.filter(u => u.role === 'manager').length;
      const adminCount = users.filter(u => u.role === 'admin').length;

      setStats({
        totalLoans: loans.length,
        pendingApplications: loans.filter(loan => loan.status === 'Pending').length,
        approvedLoans: loans.filter(loan => loan.status === 'Approved').length,
        totalUsers: users.length,
        borrowerCount,
        managerCount,
        adminCount
      });

      // Create sample recent activities
      const activities = [
        { id: 1, action: 'New loan application submitted', user: 'John Doe', time: '2 hours ago' },
        { id: 2, action: 'User registered', user: 'Jane Smith', time: '5 hours ago' },
        { id: 3, action: 'Loan approved', user: 'Robert Johnson', time: '1 day ago' },
        { id: 4, action: 'Manager assigned', user: 'Michael Brown', time: '2 days ago' }
      ];
      setRecentActivities(activities);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching admin stats:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    // Wrap in an async IIFE to avoid the linter warning
    (async () => {
      await fetchAdminStats();
    })();
  }, []);

  if (loading) {
    return <Loading message="Loading admin dashboard..." />;
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#7cb518]">Admin Dashboard</h1>
        <p className="text-[#7cb518] mt-2">Welcome, {user?.displayName || 'Administrator'}! System overview and management tools.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
              <FaList className="text-xl" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-700">Total Loans</h3>
              <p className="text-2xl font-bold text-blue-600">{stats.totalLoans}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100 text-yellow-600 mr-4">
              <FaFileAlt className="text-xl" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-700">Pending Applications</h3>
              <p className="text-2xl font-bold text-yellow-600">{stats.pendingApplications}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 text-green-600 mr-4">
              <FaChartBar className="text-xl" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-700">Approved Loans</h3>
              <p className="text-2xl font-bold text-green-600">{stats.approvedLoans}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-700">Total Users</h3>
          <p className="text-3xl font-bold text-purple-600 mt-2">{stats.totalUsers}</p>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-700">Borrowers</h3>
          <p className="text-3xl font-bold text-indigo-600 mt-2">{stats.borrowerCount}</p>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-700">Managers</h3>
          <p className="text-3xl font-bold text-teal-600 mt-2">{stats.managerCount}</p>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-700">Admins</h3>
          <p className="text-3xl font-bold text-red-600 mt-2">{stats.adminCount}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800">System Overview</h2>
          </div>
          
          <div className="p-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-4 border-b border-gray-100">
                <span className="text-gray-600">Loan Approval Rate</span>
                <span className="font-semibold">
                  {stats.totalLoans > 0 
                    ? Math.round((stats.approvedLoans / stats.totalLoans) * 100) 
                    : 0}%
                </span>
              </div>
              
              <div className="flex justify-between items-center pb-4 border-b border-gray-100">
                <span className="text-gray-600">User Growth</span>
                <span className="font-semibold text-green-600">+12% this month</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-600">System Status</span>
                <span className="badge badge-success">Operational</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800">Recent Activities</h2>
          </div>
          
          <div className="p-6">
            <ul className="space-y-4">
              {recentActivities.map(activity => (
                <li key={activity.id} className="flex items-start">
                  <div className="avatar placeholder mr-3">
                    <div className="bg-neutral-focus text-neutral-content rounded-full w-8">
                      <span>{activity.user.charAt(0)}</span>
                    </div>
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{activity.action}</p>
                    <p className="text-sm text-gray-500">{activity.user} • {activity.time}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;