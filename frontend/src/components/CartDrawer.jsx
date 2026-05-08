import React from 'react';
import { useCart } from '../context/CartContext';
import { X, Minus, Plus, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CartDrawer = () => {
  const { cart, removeFromCart, cartTotal, isCartOpen, setIsCartOpen, addToCart } = useCart();
  const navigate = useNavigate();

  return (
    <>
      {/* 1. DARK OVERLAY - Blurs the background when cart is open */}
      <div 
        className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-50 transition-opacity duration-500 ${isCartOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setIsCartOpen(false)}
      />

      {/* 2. THE DRAWER - Slides from the right */}
      <div className={`fixed right-0 top-0 h-full w-full max-w-md bg-white z-[60] shadow-2xl transform transition-transform duration-500 ease-out ${isCartOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        
        <div className="flex flex-col h-full">
          {/* HEADER */}
          <div className="p-6 border-b flex justify-between items-center">
            <h2 className="text-[11px] uppercase tracking-[0.4em] font-medium">Your Bag</h2>
            <button onClick={() => setIsCartOpen(false)} className="hover:rotate-90 transition-transform duration-300">
              <X size={20} strokeWidth={1} />
            </button>
          </div>

          {/* ITEM LIST */}
          <div className="flex-1 overflow-y-auto p-6 space-y-8">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-gray-400 space-y-4">
                <p className="text-[10px] uppercase tracking-widest">Your bag is empty</p>
                <button 
                  onClick={() => setIsCartOpen(false)}
                  className="text-black border-b border-black pb-1 text-[10px] uppercase tracking-widest"
                >
                  Continue Shopping
                </button>
              </div>
            ) : (
              cart.map((item, index) => (
                <div key={`${item.id}-${item.size}-${item.color}`} className="flex gap-4">
                  <div className="w-24 h-32 bg-gray-100 flex-shrink-0">
                    <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex flex-col justify-between py-1 flex-1">
                    <div>
                      <div className="flex justify-between items-start">
                        <h3 className="text-[10px] uppercase tracking-widest font-medium">{item.name}</h3>
                        <p className="text-[10px]">${item.basePrice}</p>
                      </div>
                      <p className="text-[9px] text-gray-500 mt-1 uppercase tracking-tighter">
                        {item.color} / {item.size}
                      </p>
                    </div>
                    
                    <div className="flex justify-between items-center mt-4">
                      <div className="flex items-center border border-gray-200 px-2 py-1 space-x-4">
                        <button className="text-gray-400 hover:text-black"><Minus size={12} /></button>
                        <span className="text-[10px]">{item.quantity}</span>
                        <button className="text-gray-400 hover:text-black"><Plus size={12} /></button>
                      </div>
                      <button 
                        onClick={() => removeFromCart(item.id, item.size, item.color)}
                        className="text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <Trash2 size={14} strokeWidth={1.5} />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* FOOTER - Checkout Section */}
          {cart.length > 0 && (
            <div className="p-6 border-t bg-gray-50">
              <div className="flex justify-between items-center mb-6">
                <span className="text-[10px] uppercase tracking-widest">Subtotal</span>
                <span className="text-sm font-medium">${cartTotal.toFixed(2)}</span>
              </div>
              <button
              onClick={() => {
                setIsCartOpen(false);
                navigate('/checkout');
              }} 
              className="w-full bg-black text-white py-4 text-[10px] uppercase tracking-[0.3em] hover:bg-gray-900 transition-colors">
                Begin Checkout
              </button>
              <p className="text-[8px] text-gray-400 mt-4 text-center uppercase tracking-widest">
                Shipping & taxes calculated at checkout
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CartDrawer;