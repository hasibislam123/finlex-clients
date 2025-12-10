import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import Loading from '../../../components/Loading/Loading';

const AvailableLoans = () => {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLoans = async () => {
      try {
        const response = await fetch('/loans.json');
        const loansData = await response.json();
        // Show only the first 3 loans on the home page
        setLoans(loansData.slice(0, 3));
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
    <section id="available-loans" className="py-16 ">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-[#7cb518] mb-4">
            Available Loan Options
          </h2>
          <p className="text-lg text-[#aad576] max-w-2xl mx-auto">
            Discover our range of loan products designed to meet your financial needs with competitive rates and flexible terms.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {loans.map((loan) => (
            <div
              key={loan.id}
              className="bg-green-50 rounded-2xl overflow-hidden shadow-xl border border-green-100 hover:shadow-2xl transition-all duration-300"
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
                  <span className="badge badge-success badge-outline bg-[#aad576] text-[#538d22] border-[#538d22]">{loan.interestRate}</span>
                </div>
                
                <p className="text-gray-600 mb-4">{loan.description}</p>
                
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <p className="text-sm text-gray-500">Max Loan Amount</p>
                    <p className="text-xl font-bold text-[#538d22]">${loan.maxAmount.toLocaleString()}</p>
                  </div>
                </div>
                
                <button
                  onClick={() => handleViewDetails(loan)}
                  className="w-full btn bg-[#538d22] hover:bg-[#427a19] text-white rounded-lg font-semibold border-none"
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AvailableLoans;