import React from 'react';
import { ShoppingBag, User, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext'; // Import the hook

const Navbar = () => {
  // Access the count and the function to open the drawer
  const { cartCount, setIsCartOpen } = useCart();

  return (
    <nav className="fixed top-0 left-0 w-full bg-white/80 backdrop-blur-md z-40 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-8 h-20 flex justify-between items-center">
        
        {/* Left: Navigation Links */}
        <div className="flex gap-8 items-center">
          <Link to="/home" className="text-[10px] uppercase tracking-[0.3em] font-medium hover:text-gray-500 transition-colors">Shop</Link>
          <span className="text-[10px] uppercase tracking-[0.3em] font-medium cursor-pointer hover:text-gray-500 transition-colors">Collections</span>
        </div>

        {/* Center: Brand Logo */}
        <Link to="/home" className="text-2xl tracking-[0.5em] font-light uppercase pl-12">
          Aurae
        </Link>

        {/* Right: Action Icons */}
        <div className="flex items-center gap-6">
          <Search size={18} strokeWidth={1} className="cursor-pointer hover:text-gray-500 transition-colors" />
          <User size={18} strokeWidth={1} className="cursor-pointer hover:text-gray-500 transition-colors" />
          
          {/* Cart Icon with Dynamic Badge */}
          <button 
            onClick={() => setIsCartOpen(true)} 
            className="relative p-1 hover:text-gray-500 transition-colors"
          >
            <ShoppingBag size={18} strokeWidth={1} />
            {/* Only show badge if there are items in the cart */}
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