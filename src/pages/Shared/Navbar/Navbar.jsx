import React, { useState, useEffect, useRef } from 'react';
import { NavLink } from 'react-router';
import useAuth from '../../../hooks/useAuth';
import { useTheme } from '../../../context/ThemeContext';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false); // State for logout modal
  const { user, logOut } = useAuth();
  const { theme, toggleTheme } = useTheme();
  
  // Ref for the mobile dropdown container to handle click-outside-to-close
  const dropdownRef = useRef(null); 

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'All Loans', path: '/all-loans' },
    { name: 'About Us', path: '/about' },
    { name: 'Contact', path: '/contact' }
  ];

  const loggedInNavLinks = [
    { name: 'Home', path: '/' },
    { name: 'All Loans', path: '/all-loans' },
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'About Us', path: '/about' },
    { name: 'Contact', path: '/contact' }
  ];

  const toggleMenu = () => {
    setIsMenuOpen(prev => !prev);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };
  
  // Function to handle clicks outside the dropdown
  const handleOutsideClick = (event) => {
    // Check if the click is outside the dropdown menu AND not on the menu button itself
    const menuButton = document.querySelector('.btn.btn-ghost.lg\\:hidden');
    if (dropdownRef.current && !dropdownRef.current.contains(event.target) && (!menuButton || !menuButton.contains(event.target))) {
      closeMenu();
    }
  };

  // Add event listener for click-outside behavior
  useEffect(() => {
    if (isMenuOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [isMenuOpen]);

  // Function to show logout modal
  const showLogoutConfirmation = () => {
    setShowLogoutModal(true);
  };

  // Function to handle logout
  const handleLogout = async () => {
    try {
      await logOut();
      closeMenu(); // Close menu on logout
      setShowLogoutModal(false); // Close modal after logout
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Function to cancel logout
  const cancelLogout = () => {
    setShowLogoutModal(false);
  };

  // Function to render mobile links
  const renderMobileLinks = (links) => (
    links.map((link, index) => (
      <li key={index}>
        <NavLink 
          to={link.path} 
          className={({ isActive }) => 
            isActive ? "active font-semibold text-[#538d22]" : "text-gray-700"
          }
          onClick={closeMenu} // Closes menu when a link is clicked
        >
          {link.name}
        </NavLink>
      </li>
    ))
  );

  return (
    <div className="navbar bg-white shadow-sm sticky top-0 z-50">
      <div className="navbar-start">
        <div className="dropdown">
          <div 
            role="button" 
            className="btn btn-ghost lg:hidden"
            onClick={toggleMenu} // Fixed: Use simple toggle function
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" />
            </svg>
          </div>
          {isMenuOpen && (
            <ul 
              className="menu menu-sm dropdown-content bg-white rounded-box z-10 mt-3 w-52 p-2 shadow-lg absolute left-0 top-full"
              ref={dropdownRef} // Attach ref for outside click handling
              // Removed onClick={(e) => e.stopPropagation()} as useEffect handles clicks better
            >
              {/* Render Navigation Links */}
              {user ? renderMobileLinks(loggedInNavLinks) : renderMobileLinks(navLinks)}
              
              {/* Mobile-only Login/Register/Logout links */}
              {!user ? (
                <>
                    <li className='md:hidden'>
                        <NavLink to="/login" onClick={closeMenu}>Login</NavLink>
                    </li>
                    <li className='md:hidden'>
                        <NavLink to="/register" onClick={closeMenu}>Register</NavLink>
                    </li>
                </>
              ) : (
                <li className='md:hidden'>
                    <button onClick={showLogoutConfirmation}>Logout</button>
                </li>
              )}
            </ul>
          )}
        </div>
        <NavLink to="/" className="btn btn-ghost text-xl font-bold text-[#538d22]">Finlix</NavLink>
      </div>
      
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1">
          {user ? (
            loggedInNavLinks.map((link, index) => (
              <li key={index}>
                <NavLink 
                  to={link.path} 
                  className={({ isActive }) => 
                    isActive ? "active font-semibold text-[#538d22]" : "text-gray-700"
                  }
                >
                  {link.name}
                </NavLink>
              </li>
            ))
          ) : (
            navLinks.map((link, index) => (
              <li key={index}>
                <NavLink 
                  to={link.path} 
                  className={({ isActive }) => 
                    isActive ? "active font-semibold text-[#538d22]" : "text-gray-700"
                  }
                >
                  {link.name}
                </NavLink>
              </li>
            ))
          )}
        </ul>
      </div>
      
      <div className="navbar-end">
        {user ? (
          <>
            <div className="dropdown dropdown-end">
              <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                <div className="w-10 rounded-full">
                  <img alt="User" src={user.photoURL || user.displayName || "https://via.placeholder.com/150"} />
                </div>
              </div>
              <ul tabIndex={0} className="menu menu-sm dropdown-content bg-white rounded-box z-10 mt-3 w-52 p-2 shadow-lg">
                <li className="menu-title">
                  <span>Welcome, {user.displayName || user.email}</span>
                </li>
                
                <li>
                  <button onClick={showLogoutConfirmation}>Logout</button>
                </li>
              </ul>
            </div>
          </>
        ) : (
          <>
            <NavLink to="/login" className="btn bg-[#538d22] hover:bg-[#427a19] text-white hidden md:inline-flex border-none mr-2">
              Login
            </NavLink>
            <NavLink to="/register" className="btn bg-[#538d22] hover:bg-[#427a19] text-white hidden md:inline-flex border-none">
              Register
            </NavLink>
          </>
        )}
        {/* Beautiful Theme Toggle Switch */}
        <label className="relative inline-flex items-center cursor-pointer ml-2">
          <input 
            type="checkbox" 
            checked={theme === 'dark'}
            onChange={toggleTheme}
            className="sr-only peer" 
          />
          <div
            className="w-16 h-8 rounded-full ring-0 peer duration-500 outline-none bg-gray-200 overflow-hidden before:flex before:items-center before:justify-center after:flex after:items-center after:justify-center before:content-['☀️'] before:absolute before:h-6 before:w-6 before:top-1/2 before:bg-white before:rounded-full before:left-1 before:-translate-y-1/2 before:transition-all before:duration-700 peer-checked:before:opacity-0 peer-checked:before:rotate-90 peer-checked:before:-translate-y-full shadow-md shadow-gray-400 peer-checked:shadow-md peer-checked:shadow-gray-700 peer-checked:bg-[#383838] after:content-['🌑'] after:absolute after:bg-[#1d1d1d] after:rounded-full after:top-[2px] after:right-1 after:translate-y-full after:w-6 after:h-6 after:opacity-0 after:transition-all after:duration-700 peer-checked:after:opacity-100 peer-checked:after:rotate-180 peer-checked:after:translate-y-0"
          ></div>
        </label>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-green-50 bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-2">Confirm Logout</h3>
              <p className="text-gray-600 mb-6">Are you sure you want to logout?</p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={cancelLogout}
                  className="btn btn-outline"
                >
                  Cancel
                </button>
                <button
                  onClick={handleLogout}
                  className="btn bg-[#538d22] hover:bg-[#427a19] text-white"
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;