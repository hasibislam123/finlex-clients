import React, { useEffect, useState } from 'react';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import Loading from '../../../components/Loading/Loading';
import useAuth from '../../../hooks/useAuth';

const BorrowerDashboard = () => {
  const { user } = useAuth();
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const axiosSecure = useAxiosSecure();

  useEffect(() => {
    document.title = 'Borrower Dashboard - Finlix';
  }, []);

  const fetchBorrowerLoans = async () => {
    try {
      const response = await axiosSecure.get(`/loans/user/${user?.email}`);
      setLoans(response.data || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching loans:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    (async () => {
      await fetchBorrowerLoans();
    })();
  }, []);

  if (loading) {
    return <Loading message="Loading your dashboard..." />;
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#7cb518]">
          Welcome, {user?.displayName || 'Borrower'}!
        </h1>
        <p className="text-[#7cb518] mt-2">
          Here's an overview of your loan activities
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-700">Total Loans</h3>
          <p className="text-3xl font-bold text-blue-600 mt-2">{loans.length}</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-700">Active Loans</h3>
          <p className="text-3xl font-bold text-green-600 mt-2">
            {loans.filter(loan => loan.status === 'Approved').length}
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-700">Pending Applications</h3>
          <p className="text-3xl font-bold text-yellow-600 mt-2">
            {loans.filter(loan => loan.status === 'Pending').length}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">Recent Loan Applications</h2>
        </div>

        {loans.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="table table-zebra">
              <thead>
                <tr className="bg-gray-100">
                  <th>Loan Type</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Applied Date</th>
                </tr>
              </thead>

              <tbody>
                {loans.slice(0, 5).map((loan) => (
                  <tr key={loan._id}>
                    <td>{loan.loanType || "N/A"}</td>

                    {/* SAFE FIX */}
                    <td>
                      ${loan.loanAmount ? loan.loanAmount.toLocaleString() : "0"}
                    </td>

                    <td>
                      <span
                        className={`badge ${
                          loan.status === 'Approved'
                            ? 'badge-success'
                            : loan.status === 'Rejected'
                            ? 'badge-error'
                            : 'badge-warning'
                        }`}
                      >
                        {loan.status || "Unknown"}
                      </span>
                    </td>

                    {/* SAFE FIX */}
                    <td>
                      {loan.createdAt
                        ? new Date(loan.createdAt).toLocaleDateString()
                        : "N/A"}
                    </td>
                  </tr>
                ))}
              </tbody>

            </table>
          </div>
        ) : (
          <div className="p-8 text-center">
            <p className="text-gray-500">You haven't applied for any loans yet.</p>
            <button className="btn btn-primary mt-4">Apply for a Loan</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BorrowerDashboard;
