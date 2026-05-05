import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="fixed top-0 left-0 w-full bg-[#E9EDE9] backdrop-blur-sm z-50 border-b border-[#D1D9D1]">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">

        {/* Left: Navigation Links */}
        <div className="hidden md:flex items-center space-x-8">
          <Link to="/home" className="text-[11px] font-bold tracking-[0.2em] uppercase hover:text-gray-500 transition-colors">Shop</Link>
          <Link to="#" className="text-[11px] font-bold tracking-[0.2em] uppercase hover:text-gray-500 transition-colors">Categories</Link>
        </div>

        {/* Center: Logo */}
        <div className="absolute left-1/2 -translate-x-1/2">
          <Link to="/home" className="text-2xl font-serif tracking-[0.3em] uppercase">AURAE</Link>
        </div>

        {/* Right: User Actions */}
        <div className="flex items-center space-x-6">
          {user ? (
            <>
              <button className="relative">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                <span className="absolute -top-1 -right-1 bg-black text-white text-[8px] w-4 h-4 flex items-center justify-center rounded-full">0</span>
              </button>
              <button 
                onClick={handleLogout}
                className="text-[10px] font-bold tracking-widest uppercase text-red-600 hover:text-red-800 transition-colors"
              >
                Logout
              </button>
            </>
          ) : (
            <Link to="/login" className="text-[11px] font-bold tracking-[0.2em] uppercase border-b border-black">Login</Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;