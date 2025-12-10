import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

// Mock data for customer feedback - in a real app, this would come from MongoDB
const testimonials = [
  {
    id: 1,
    name: "Sarah Johnson",
    role: "Home Loan Customer",
    content: "The loan application process was incredibly smooth. I received my funds within 48 hours of approval. Their customer service team was responsive and helpful throughout.",
    avatar: "https://randomuser.me/api/portraits/women/32.jpg",
    rating: 5
  },
  {
    id: 2,
    name: "Michael Chen",
    role: "Business Loan Customer",
    content: "As a small business owner, I needed quick financing to expand my operations. Finlix provided competitive rates and the funds arrived just in time to seize a growth opportunity.",
    avatar: "https://randomuser.me/api/portraits/men/54.jpg",
    rating: 5
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    role: "Personal Loan Customer",
    content: "I consolidated my debts with a personal loan from Finlix. The interest rate was significantly lower than my credit cards, and the monthly payments fit perfectly in my budget.",
    avatar: "https://randomuser.me/api/portraits/women/68.jpg",
    rating: 4
  },
  {
    id: 4,
    name: "David Wilson",
    role: "Auto Loan Customer",
    content: "Buying my first car was a breeze with Finlix's auto loan. The approval process was fast, and the team guided me through every step. I'm driving my dream car today!",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    rating: 5
  },
  {
    id: 5,
    name: "Jennifer Kim",
    role: "Education Loan Customer",
    content: "Financing my MBA was a big decision. Finlix offered flexible repayment options and excellent customer support. I'm now working at my dream job thanks to their support.",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    rating: 5
  }
];

const CustomerFeedback = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-rotate testimonials every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => 
      (prevIndex + 1) % testimonials.length
    );
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  // Get the testimonial to display
  const currentTestimonial = testimonials[currentIndex];

  return (
    <section className="py-16 ">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-[#7cb518] mb-4">
            What Our Customers Say
          </h2>
          <p className="text-lg text-[#aad576] max-w-2xl mx-auto">
            Don't just take our word for it. Hear from our satisfied customers who have achieved their financial goals with our help.
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          {/* Testimonial Card */}
          <motion.div
            key={currentTestimonial.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-green-50 rounded-2xl p-8 shadow-lg border border-green-100"
          >
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              <div className="flex-shrink-0">
                <img 
                  src={currentTestimonial.avatar} 
                  alt={currentTestimonial.name} 
                  className="w-20 h-20 rounded-full object-cover border-4 border-[#aad576]"
                />
              </div>
              
              <div className="text-center md:text-left">
                <div className="flex justify-center md:justify-start mb-4">
                  {[...Array(5)].map((_, i) => (
                    <svg 
                      key={i}
                      xmlns="http://www.w3.org/2000/svg" 
                      className={`h-5 w-5 ${i < currentTestimonial.rating ? 'text-[#538d22]' : 'text-gray-300'}`}
                      viewBox="0 0 20 20" 
                      fill="currentColor"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                
                <p className="text-lg text-gray-700 italic mb-6">
                  "{currentTestimonial.content}"
                </p>
                
                <div>
                  <h4 className="text-xl font-bold text-gray-800">{currentTestimonial.name}</h4>
                  <p className="text-[#538d22]">{currentTestimonial.role}</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Navigation Controls */}
          <div className="flex justify-center items-center mt-8 gap-4">
            <button 
              onClick={goToPrevious}
              className="btn btn-circle btn-outline border-[#538d22] text-[#538d22] hover:bg-[#538d22] hover:text-white"
              aria-label="Previous testimonial"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            
            {/* Dots Indicator */}
            <div className="flex gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`w-3 h-3 rounded-full ${
                    index === currentIndex ? 'bg-[#538d22]' : 'bg-gray-300'
                  }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>
            
            <button 
              onClick={goToNext}
              className="btn btn-circle btn-outline border-[#538d22] text-[#538d22] hover:bg-[#538d22] hover:text-white"
              aria-label="Next testimonial"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CustomerFeedback;