import React from 'react';

const About = () => {
  return (
    <div className="min-h-screen  py-12">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-[#aad576] mb-6">
            About <span className="text-[#538d22]">Finlix</span>
          </h1>
          <p className="text-xl text- max-w-3xl mx-auto">
            Empowering individuals and businesses with accessible financial solutions for a brighter future.
          </p>
        </div>
      </div>

      {/* Company Story */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="md:flex">
            <div className="md:w-1/2 p-8 md:p-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Story</h2>
              <p className="text-gray-600 mb-6">
                Founded in 2020, Finlix emerged from a simple idea: financial services should be accessible, 
                transparent, and tailored to individual needs. What started as a small team passionate about 
                democratizing finance has grown into a trusted platform serving thousands of customers.
              </p>
              <p className="text-gray-600 mb-6">
                We believe that everyone deserves fair access to financial opportunities, regardless of their 
                background or credit history. Our mission is to bridge the gap between traditional banking 
                systems and modern digital solutions.
              </p>
              <p className="text-gray-600">
                Today, we continue to innovate and expand our services, always keeping our customers' best 
                interests at heart.
              </p>
            </div>
            <div className="md:w-1/2 bg-gradient-to-br from-[#538d22] to-[#427a19] p-8 md:p-12 flex items-center justify-center">
              <div className="text-center text-white">
                <div className="inline-block p-4 rounded-full h-70 w-70  bg-opacity-20 mb-6">
                 <img className=' rounded-[50%] ' src="https://i.ibb.co.com/pZDkBBq/IMG-8884.jpg" alt="" />
                </div>
                <h3 className="text-2xl font-bold mb-4">Trusted by Thousands</h3>
                <p className="text-green-100">
                  We've helped over 50,000 customers achieve their financial goals with personalized solutions.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mission & Vision */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="flex items-center mb-6">
              <div className="mr-4 p-3 rounded-full bg-[#aad576]">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#538d22]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Our Mission</h2>
            </div>
            <p className="text-gray-600">
              To provide accessible, transparent, and innovative financial solutions that empower individuals 
              and businesses to achieve their goals and build a secure financial future.
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="flex items-center mb-6">
              <div className="mr-4 p-3 rounded-full bg-[#aad576]">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#538d22]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Our Vision</h2>
            </div>
            <p className="text-gray-600">
              To become the leading digital financial platform that transforms how people interact with financial 
              services, making them simpler, fairer, and more accessible for everyone.
            </p>
          </div>
        </div>
      </div>

      {/* Core Values */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold  text-[#7cb518] mb-4">Our Core Values</h2>
          <p className=" text-[#aad576] max-w-2xl mx-auto">
            The principles that guide everything we do at Finlix
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center hover:shadow-2xl transition-shadow duration-300">
            <div className="inline-block p-4 rounded-full bg-[#aad576] mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-[#538d22]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">Transparency</h3>
            <p className="text-gray-600">
              We believe in clear, honest communication with no hidden fees or terms.
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8 text-center hover:shadow-2xl transition-shadow duration-300">
            <div className="inline-block p-4 rounded-full bg-[#aad576] mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-[#538d22]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">Customer-Centric</h3>
            <p className="text-gray-600">
              Our customers are at the heart of everything we do, guiding our innovations.
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8 text-center hover:shadow-2xl transition-shadow duration-300">
            <div className="inline-block p-4 rounded-full bg-[#aad576] mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-[#538d22]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">Innovation</h3>
            <p className="text-gray-600">
              We continuously evolve to provide cutting-edge solutions for modern financial needs.
            </p>
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-[#7cb518] mb-4">Meet Our Leadership</h2>
          <p className="text-[#aad576] max-w-2xl mx-auto">
            The talented individuals driving Finlix forward
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="h-48 bg-gradient-to-r from-[#538d22] to-[#427a19]">
               <img src="https://i.ibb.co.com/R4sZpjsj/Gemini-Generated-Image-n9fb04n9fb04n9fb.png" alt="" />
                </div>
            <div className="p-6 text-center">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Hasib Islam</h3>
              <p className="text-[#ff5e41] font-semibold mb-3">Founder & CEO</p>
              <p className="text-red-50">
                Financial industry veteran with 15+ years of experience in digital transformation.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="h-48 bg-gradient-to-r from-[#538d22] to-[#427a19]">
               <img src="https://i.ibb.co.com/n4QtjsM/photo-6107201452486277991-y.jpg" alt="" />
            </div>
            <div className="p-6 text-center">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Sazeem Hassan</h3>
              <p className="text-[#0757c8] font-semibold mb-3">Chief Technology Officer</p>
              <p className="text-red-50">
                Tech innovator specializing in fintech solutions and cybersecurity.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="h-48 bg-gradient-to-r from-[#538d22] to-[#427a19]">
               <img src="https://i.ibb.co.com/jZWrJsv4/photo-6107201452486278081-y.jpg" alt="" />
            </div>
            <div className="p-6 text-center">
              <h3 className="text-xl font-bold text-gray-700 mb-2">Sakibul Islam</h3>
              <p className=" text-[#76ce2f]  font-semibold mb-3">Head of Customer Experience</p>
              <p className="text-red-50">
                Customer advocate focused on creating seamless financial journeys.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-[#538d22] to-[#427a19] rounded-2xl shadow-xl p-8 md:p-12 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Start Your Financial Journey?
          </h2>
          <p className="text-green-100 text-xl mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied customers who have transformed their financial future with Finlix.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button className="px-8 py-3 bg-white text-[#538d22] font-bold rounded-lg shadow-lg hover:bg-gray-100 transition duration-300">
              Explore Our Loans
            </button>
            <button className="px-8 py-3 bg-transparent border-2 border-white text-white font-bold rounded-lg hover:bg-white hover:text-[#538d22] transition duration-300">
              Contact Us
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;