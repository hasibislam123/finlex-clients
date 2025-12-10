import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import Loading from '../../components/Loading/Loading';

const AllLoans = () => {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Set dynamic page title
  useEffect(() => {
    document.title = 'All Loans - Finlix';
  }, []);

  const getCategoryForLoan = (loanTitle) => {
    const categories = {
      "Personal Loan": "Personal",
      "Home Loan": "Housing",
      "Auto Loan": "Vehicle",
      "Business Loan": "Business",
      "Education Loan": "Education",
      "Medical Loan": "Healthcare"
    };
    return categories[loanTitle] || "General";
  };

  useEffect(() => {
    const fetchLoans = async () => {
      try {
        const response = await fetch('/loans.json');
        const loansData = await response.json();
        // Extend the data with additional fields for the AllLoans page
        const extendedLoansData = loansData.map(loan => ({
          ...loan,
          category: getCategoryForLoan(loan.title)
        }));
        setLoans(extendedLoansData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching loans:', error);
        setLoading(false);
      }
    };

    fetchLoans();
  }, []);

  const handleViewDetails = (loan) => {
    navigate(`/loan/${loan.id}`, { state: { loanTitle: loan.title, interestRate: loan.interestRate } });
  };

  if (loading) {
    return <Loading message="Loading loan options..." />;
  }

  return (
    <div className="min-h-screen  py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-[#7cb518] mb-4">
            All Loan Options
          </h1>
          <p className="text-lg text-[#aad576] max-w-2xl mx-auto">
            Explore our comprehensive range of loan products designed to meet your diverse financial needs.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {loans.map((loan) => (
            <div 
              key={loan.id} 
              className="bg-white rounded-2xl overflow-hidden shadow-xl border border-green-100 transition-all duration-300 hover:shadow-2xl"
            >
              <div className="h-48 overflow-hidden">
                <img 
                  src={loan.image} 
                  alt={loan.title} 
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                />
              </div>
              
              <div className="p-6">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-xl font-bold text-gray-800">{loan.title}</h3>
                  <span className="badge badge-success badge-outline bg-[#aad576] text-[#538d22] border-[#538d22]">
                    {loan.interestRate}
                  </span>
                </div>
                
                <div className="mb-2">
                  <span className="inline-block px-3 py-1 text-xs font-semibold text-[#538d22] bg-green-100 rounded-full">
                    {loan.category}
                  </span>
                </div>
                
                <p className="text-gray-600 mb-4 line-clamp-2">{loan.description}</p>
                
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <p className="text-sm text-gray-500">Max Loan Limit</p>
                    <p className="text-xl font-bold text-[#538d22]">${loan.maxAmount.toLocaleString()}</p>
                  </div>
                </div>
                
                <button
                  onClick={() => handleViewDetails(loan)}
                  className="w-full btn bg-[#538d22] hover:bg-[#427a19] text-white rounded-lg font-semibold border-none py-2 transition-colors duration-300"
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AllLoans;