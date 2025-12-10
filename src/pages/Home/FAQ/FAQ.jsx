import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router';

const faqs = [
  {
    id: 1,
    question: "What documents are required to apply for a loan?",
    answer: "You'll typically need government-issued ID, proof of income (pay stubs or tax returns), bank statements, and proof of residence. Specific requirements may vary based on loan type."
  },
  {
    id: 2,
    question: "How long does the approval process take?",
    answer: "Most loan applications are approved within 24-48 hours. Once approved, funds are typically disbursed within 1-2 business days."
  },
  {
    id: 3,
    question: "Can I apply for a loan with bad credit?",
    answer: "Yes, we offer loan options for individuals with various credit histories. While better credit scores may qualify for lower interest rates, we consider multiple factors in our approval process."
  },
  {
    id: 4,
    question: "Are there any fees associated with applying?",
    answer: "There are no application fees. However, depending on the loan type, there may be origination fees, which will be clearly disclosed before you sign any agreement."
  },
  {
    id: 5,
    question: "How can I make payments on my loan?",
    answer: "You can set up automatic payments through your bank account, make payments online through our portal, or send payments by mail. We offer flexible payment options to suit your needs."
  }
];

const FAQ = () => {
  const [openId, setOpenId] = useState(null);

  const toggleFAQ = (id) => {
    setOpenId(openId === id ? null : id);
  };

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
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-[#aad576] max-w-2xl mx-auto">
            Find answers to common questions about our loan products and services.
          </p>
        </motion.div>

        <div className="max-w-3xl mx-auto">
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={faq.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-2xl overflow-hidden shadow-md border border-green-100"
              >
                <button
                  className="flex justify-between items-center w-full p-6 text-left"
                  onClick={() => toggleFAQ(faq.id)}
                >
                  <h3 className="text-lg font-semibold text-gray-800">{faq.question}</h3>
                  <div className="ml-4 flex-shrink-0">
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      className={`h-6 w-6 transform transition-transform duration-300 ${openId === faq.id ? 'rotate-180 text-[#538d22]' : 'text-gray-500'}`}
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </button>
                
                {openId === faq.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-6 text-gray-600">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-12 text-center"
          >
            <p className="text-lg text-[#aad576] mb-6">
              Still have questions? Our support team is ready to help.
            </p>
            <Link to={'/contact'} className="btn bg-[#538d22] hover:bg-[#427a19] text-white rounded-lg font-semibold border-none">
              Contact Support
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default FAQ;