import React from 'react';

const Footer = () => {
  return (
    <footer className="footer sm:footer-horizontal bg-green-100 text-gray-800 p-10">
      <nav>
        <h6 className="footer-title text-[#538d22]">Services</h6>
        <a className="link link-hover text-gray-600 hover:text-[#538d22]">Branding</a>
        <a className="link link-hover text-gray-600 hover:text-[#538d22]">Design</a>
        <a className="link link-hover text-gray-600 hover:text-[#538d22]">Marketing</a>
        <a className="link link-hover text-gray-600 hover:text-[#538d22]">Advertisement</a>
      </nav>
      <nav>
        <h6 className="footer-title text-[#538d22]">Company</h6>
        <a href='/' className="link link-hover text-gray-600 hover:text-[#538d22]">Home</a>
        <a href='/all-loans' className="link link-hover text-gray-600 hover:text-[#538d22]">All Loans</a>
        <a href='/about' className="link link-hover text-gray-600 hover:text-[#538d22]">About us</a>
        <a href='/contact' className="link link-hover text-gray-600 hover:text-[#538d22]">Contact</a>
      
        
      </nav>
      <nav>
        <h6 className="footer-title text-[#538d22]">Legal</h6>
        <a className="link link-hover text-gray-600 hover:text-[#538d22]">Terms of use</a>
        <a className="link link-hover text-gray-600 hover:text-[#538d22]">Privacy policy</a>
        <a className="link link-hover text-gray-600 hover:text-[#538d22]">Cookie policy</a>
      </nav>
      <form>
        <h6 className="footer-title text-[#538d22]">Newsletter</h6>
        <fieldset className="w-80">
          <label className="text-gray-700">Enter your email address</label>
          <div className="join">
            <input
              type="text"
              placeholder="username@site.com"
              className="input input-bordered join-item border-green-200 focus:border-[#538d22] focus:outline-none"
            />
            <button className="btn bg-[#538d22] hover:bg-[#427a19] text-white join-item border-none">
              Subscribe
            </button>
          </div>
        </fieldset>
      </form>
    </footer>
  );
};

export default Footer;