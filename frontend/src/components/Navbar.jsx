import React from 'react';
import { ShoppingBag, User, Search, LayoutDashboard } from 'lucide-react'; // Added LayoutDashboard icon
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext'; 
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { cartCount, setIsCartOpen } = useCart();
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="fixed top-0 left-0 w-full bg-white/80 backdrop-blur-md z-40 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-8 h-20 flex justify-between items-center">
        
        {/* Left: Navigation Links */}
        <div className="flex gap-8 items-center">
          <Link to="/home" className="text-[10px] uppercase tracking-[0.3em] font-medium hover:text-gray-500 transition-colors">Shop</Link>
          <span className="text-[10px] uppercase tracking-[0.3em] font-medium cursor-pointer hover:text-gray-500 transition-colors">Collections</span>
          
          {user && (
            <Link to="/orders" className="text-[10px] uppercase tracking-[0.3em] font-medium hover:text-gray-500 transition-colors">Orders</Link>
          )}

          {/* NEW: Admin Dashboard Link */}
          {user && user.role === 'ADMIN' && (
            <Link 
              to="/admin" 
              className="text-[10px] uppercase tracking-[0.3em] font-bold text-gray-900 hover:text-gray-500 transition-colors flex items-center gap-2"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gray-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-gray-900"></span>
              </span>
              Dashboard
            </Link>
          )}
        </div>

        {/* Center: Brand Logo */}
        <Link to="/home" className="text-2xl tracking-[0.5em] font-light uppercase pl-12">
          Aurae
        </Link>

        {/* Right: Action Icons */}
        <div className="flex items-center gap-6">
          <Search size={18} strokeWidth={1} className="cursor-pointer hover:text-gray-500 transition-colors" />
          
          {user ? (
            <div className="flex items-center gap-4">
              {/* Show user name if available */}
              <span className="text-[9px] uppercase tracking-widest text-gray-400">
                {user.name}
              </span>
              <button onClick={handleLogout} className="text-[10px] uppercase tracking-widest hover:text-gray-500 transition-colors">
                Logout
              </button>
            </div>
          ) : (
            <Link to="/login">
              <User size={18} strokeWidth={1} className="cursor-pointer hover:text-gray-500 transition-colors" />
            </Link>
          )}
          
          {/* Cart Icon */}
          <button 
            onClick={() => setIsCartOpen(true)} 
            className="relative p-1 hover:text-gray-500 transition-colors"
          >
            <ShoppingBag size={18} strokeWidth={1} />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#4A5D4E] text-white text-[8px] w-4 h-4 flex items-center justify-center rounded-full">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;