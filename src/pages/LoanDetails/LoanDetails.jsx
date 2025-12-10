import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router';
import Loading from '../../components/Loading/Loading';

const LoanDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [loan, setLoan] = useState(null);
  const [loading, setLoading] = useState(true);

  // Get loan data from location state (passed from AllLoans or AvailableLoans)
  const { loanTitle, interestRate } = location.state || {};

  useEffect(() => {
    const fetchLoanDetails = async () => {
      try {
        const response = await fetch('/loans.json');
        const loansData = await response.json();
        const loanData = loansData.find(loan => loan.id === parseInt(id));
        setLoan(loanData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching loan details:', error);
        setLoading(false);
      }
    };

    fetchLoanDetails();
  }, [id]);

  const handleApplyNow = () => {
    // Pass the loan title and interest rate to the application page
    navigate('/apply-loan', { 
      state: { 
        loanTitle: loanTitle || (loan ? loan.title : ''), 
        interestRate: interestRate || (loan ? loan.interestRate : '') 
      } 
    });
  };

  if (loading) {
    return <Loading />;
  }

  if (!loan) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Loan Not Found</h2>
          <p className="text-gray-600 mb-6">The loan you're looking for doesn't exist.</p>
          <button 
            onClick={() => navigate('/')}
            className="btn bg-[#538d22] hover:bg-[#427a19] text-white rounded-lg font-semibold"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-green-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center text-[#538d22] hover:text-[#427a19] font-medium"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Back to Loans
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Header */}
          <div className="relative">
            <img 
              src={loan.image} 
              alt={loan.title} 
              className="w-full h-64 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
            <div className="absolute bottom-6 left-6 text-white">
              <h1 className="text-3xl md:text-4xl font-bold mb-2">{loan.title}</h1>
              <p className="text-lg">{loan.description}</p>
            </div>
          </div>

          <div className="p-6 md:p-8">
            {/* Loan Summary */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
              <div className="bg-green-50 rounded-xl p-6 text-center">
                <p className="text-sm text-gray-600 mb-1">Interest Rate</p>
                <p className="text-2xl font-bold text-[#538d22]">{loan.interestRate}</p>
              </div>
              <div className="bg-green-50 rounded-xl p-6 text-center">
                <p className="text-sm text-gray-600 mb-1">Maximum Amount</p>
                <p className="text-2xl font-bold text-[#538d22]">${loan.maxAmount.toLocaleString()}</p>
              </div>
              <div className="bg-green-50 rounded-xl p-6 text-center">
                <p className="text-sm text-gray-600 mb-1">Term Length</p>
                <p className="text-2xl font-bold text-[#538d22]">{loan.termLength || "Flexible"}</p>
              </div>
              <div className="bg-green-50 rounded-xl p-6 text-center">
                <p className="text-sm text-gray-600 mb-1">Processing Fee</p>
                <p className="text-2xl font-bold text-[#538d22]">{loan.processingFee || "Varies"}</p>
              </div>
            </div>

            {/* Detailed Description */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">About This Loan</h2>
              <p className="text-gray-600 leading-relaxed">{loan.longDescription || loan.description}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              {/* Features */}
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-4">Key Features</h3>
                <ul className="space-y-3">
                  {(loan.features || [
                    "Competitive interest rates",
                    "Flexible repayment terms",
                    "Quick approval process",
                    "Online application",
                    "No hidden fees"
                  ]).map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#538d22] mt-0.5 mr-3 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Eligibility */}
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-4">Eligibility Criteria</h3>
                <ul className="space-y-3">
                  {(loan.eligibility || [
                    "Minimum age requirement",
                    "Valid identification",
                    "Proof of income",
                    "Good credit history",
                    "Active bank account"
                  ]).map((criteria, index) => (
                    <li key={index} className="flex items-start">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#538d22] mt-0.5 mr-3 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-gray-600">{criteria}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Call to Action */}
            <div className="text-center py-8 border-t border-gray-200">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Ready to Apply?</h3>
              <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                Take the next step towards securing your financial future. Apply for this loan today and our team will get back to you within 24 hours.
              </p>
              <button
                onClick={handleApplyNow}
                className="btn bg-[#538d22] hover:bg-[#427a19] text-white px-8 py-3 rounded-lg font-semibold text-lg transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Apply for Loan Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoanDetails;