import React, { useState, useContext } from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext'; // To get user name/email
import axios from 'axios';

/**
 * Checkout Component
 * Now integrated with SSLCommerz (bKash, Nagad, etc.)
 */
const Checkout = () => {
  const { cart, cartTotal, cartCount } = useCart();
  const { user } = useContext(AuthContext); // Get logged-in user details
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(false);
  
  // New State: SSLCommerz requires these details to process a payment
  const [shippingData, setShippingData] = useState({
    phone: '',
    address: ''
  });

  /**
   * HANDLE PAYMENT
   * This function talks to our backend, gets the bKash link, and redirects the user.
   */
  const handlePayment = async (e) => {
    e.preventDefault(); // Prevent form from refreshing the page
    
    // Basic validation
    if (!shippingData.phone || !shippingData.address) {
      alert("Please provide shipping details.");
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem('aurae_token');

      // 1. Call our new Backend 'init' route
      const response = await axios.post('http://localhost:5000/api/payment/init', {
        totalAmount: cartTotal,
        customerName: user?.name || "Customer",
        customerEmail: user?.email || "customer@example.com",
        customerPhone: shippingData.phone,
        address: shippingData.address
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // 2. If the backend sends back a URL, redirect the user immediately
      if (response.data?.url) {
        window.location.replace(response.data.url); 
        // Note: window.location.replace is used so the user can't "Go Back" to an empty checkout
      } else {
        alert("Could not get payment link. Try again.");
      }

    } catch (error) {
      console.error("Payment Error:", error);
      alert("Payment initialization failed.");
    } finally {
      setLoading(false);
    }
  };

  if (cartCount === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center space-y-4">
        <h2 className="text-[11px] uppercase tracking-[0.4em]">Your bag is empty</h2>
        <button onClick={() => navigate('/home')} className="border-b border-black text-[10px] uppercase tracking-widest">Return to Shop</button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-8 py-24">
      <h1 className="text-[14px] uppercase tracking-[0.6em] mb-16 text-center italic font-serif">Secure Checkout</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">
        
        {/* Left Section: Shipping Form (7 Columns) */}
        <div className="lg:col-span-7 space-y-12">
          <section>
            <h2 className="text-[10px] uppercase tracking-[0.3em] font-bold border-b pb-4 mb-8">Shipping Information</h2>
            <form className="space-y-6">
              <div>
                <label className="text-[9px] uppercase tracking-widest text-gray-400 block mb-2">Contact Number</label>
                <input 
                  type="text" 
                  placeholder="017XXXXXXXX"
                  className="w-full bg-gray-50 border-b border-gray-200 py-3 px-4 text-[11px] outline-none focus:border-black transition-colors"
                  value={shippingData.phone}
                  onChange={(e) => setShippingData({ ...shippingData, phone: e.target.value })}
                />
              </div>
              <div>
                <label className="text-[9px] uppercase tracking-widest text-gray-400 block mb-2">Delivery Address</label>
                <textarea 
                  rows="3"
                  placeholder="House, Road, Area..."
                  className="w-full bg-gray-50 border-b border-gray-200 py-3 px-4 text-[11px] outline-none focus:border-black transition-colors resize-none"
                  value={shippingData.address}
                  onChange={(e) => setShippingData({ ...shippingData, address: e.target.value })}
                />
              </div>
            </form>
          </section>

          <section>
            <h2 className="text-[10px] uppercase tracking-[0.3em] font-bold border-b pb-4 mb-8">Cart Review</h2>
            <div className="space-y-6">
              {cart.map((item) => (
                <div key={`${item.id}-${item.size}-${item.color}`} className="flex justify-between items-center text-[11px]">
                  <div className="flex gap-4">
                    <img src={item.imageUrl} className="w-14 h-18 object-cover grayscale" alt={item.name} />
                    <div>
                      <p className="uppercase tracking-[0.2em] font-bold">{item.name}</p>
                      <p className="text-gray-400 mt-1 text-[9px] uppercase">{item.size} • {item.color} (x{item.quantity})</p>
                    </div>
                  </div>
                  <span className="font-bold">${(item.basePrice * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Right Section: Order Summary & Pay Button (5 Columns) */}
        <div className="lg:col-span-5">
          <div className="bg-neutral-50 p-10 sticky top-32 border border-gray-100">
            <h2 className="text-[10px] uppercase tracking-[0.3em] font-bold mb-8">Summary</h2>
            
            <div className="space-y-4 mb-10">
              <div className="flex justify-between text-[11px] uppercase tracking-widest text-gray-500">
                <span>Subtotal</span>
                <span>${cartTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-[11px] uppercase tracking-widest text-gray-500">
                <span>Shipping</span>
                <span className="text-[9px] font-bold italic">Free (Standard)</span>
              </div>
              <div className="flex justify-between border-t border-gray-200 pt-6 text-[13px] uppercase tracking-[0.3em] font-black text-gray-950">
                <span>Total</span>
                <span>${cartTotal.toFixed(2)}</span>
              </div>
            </div>

            <button 
              onClick={handlePayment}
              disabled={loading}
              className="w-full bg-black text-white py-5 text-[10px] uppercase tracking-[0.4em] hover:bg-zinc-800 transition-all disabled:bg-gray-300 font-bold"
            >
              {loading ? "Establishing Gateway..." : "Proceed to Payment"}
            </button>
            
            <p className="text-center text-[8px] uppercase tracking-widest text-gray-400 mt-6 leading-relaxed">
              Secure payment processed via SSLCommerz.<br/>Supporting bKash, Nagad, and local cards.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Checkout;