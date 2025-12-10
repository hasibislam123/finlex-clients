import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router";

const images = [
  "https://i.ibb.co/3YYZXj4g/bruce-mars-FWVMh-Ua-wb-Y-unsplash.jpg",
  "https://i.ibb.co/q3n0tj6s/scott-graham-OQMZw-Nd3-Th-U-unsplash.jpg",
  "https://i.ibb.co/svSBdNgd/tierra-mallorca-rg-J1-J8-SDEAY-unsplash.jpg",
  "https://i.ibb.co/hJh0tLLW/towfiqu-barbhuiya-jpqyf-K7-GB4w-unsplash.jpg",
];

const Banner = () => {
  const [currentImage, setCurrentImage] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleApplyLoan = () => {
    navigate("/apply-loan");
  };

  const handleExploreLoans = () => {
    // Scroll to the loans section
    document.getElementById("available-loans").scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div
      className="w-full h-screen bg-cover bg-center relative flex items-center"
      style={{ backgroundImage: `url(${images[currentImage]})` }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/60"></div>

      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 text-white grid md:grid-cols-2 items-center gap-12">
        
        {/* LEFT TEXT (Slow Entry) */}
        <motion.div
          initial={{ x: -250, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{
            duration: 1.8,  
            ease: "easeOut"
          }}
        >
          <p className="text-[#aad576] font-semibold mb-3">
            FINANCIAL FREEDOM STARTS HERE
          </p>

          <h1 className="text-2xl md:text-6xl font-bold leading-tight mb-6">
            Secure Your Future <br /> With Flexible Loans <br /> Tailored For You
          </h1>

          <p className="mb-8 text-gray-200 max-w-lg">
            Get competitive interest rates, fast approval, and flexible repayment options. 
            Our loan solutions are designed to meet your personal and business financial needs.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-[#538d22] hover:bg-[#427a19] text-white px-8 py-3 rounded-lg font-semibold transition-all duration-300 shadow-lg"
              onClick={handleApplyLoan}
            >
              Apply for Loan
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-transparent border-2 border-white hover:bg-white/10 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-300"
              onClick={handleExploreLoans}
            >
              Explore Loans
            </motion.button>
          </div>
        </motion.div>
        
        {/* RIGHT SIDE - Floating Elements */}
        <motion.div 
          className="hidden md:flex justify-center"
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          <div className="relative w-full max-w-md">
            {/* Floating Card 1 */}
            <motion.div
              className="absolute -top-6 -left-6 bg-white/10 backdrop-blur-sm rounded-xl p-4 w-56"
              whileHover={{ y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center gap-3">
                <div className="bg-[#538d22] p-2 rounded-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold">Competitive Rates</p>
                  <p className="text-sm text-gray-300">From 3.5% APR</p>
                </div>
              </div>
            </motion.div>

            {/* Floating Card 2 */}
            <motion.div
              className="absolute top-10 -right-6 bg-white/10 backdrop-blur-sm rounded-xl p-4 w-56"
              whileHover={{ y: -10 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <div className="flex items-center gap-3">
                <div className="bg-[#aad576] p-2 rounded-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#538d22]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold">Fast Approval</p>
                  <p className="text-sm text-gray-300">Within 24 hours</p>
                </div>
              </div>
            </motion.div>

            {/* Floating Card 3 - Moved upward */}
            <motion.div
              className="absolute bottom-10 left-10 bg-white/10 backdrop-blur-sm rounded-xl p-4 w-56"
              whileHover={{ y: -10 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <div className="flex items-center gap-3">
                <div className="bg-[#538d22] p-2 rounded-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold">Secure Process</p>
                  <p className="text-sm text-gray-300">Bank-level security</p>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Image indicators */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentImage(index)}
            className={`w-3 h-3 rounded-full ${
              index === currentImage ? "bg-[#538d22]" : "bg-white/50"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default Banner;