import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Checkout = () => {
  const { cart, cartTotal, cartCount } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handlePlaceOrder = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('http://localhost:5000/api/orders', {
        items: cart,
        totalAmount: cartTotal
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.status === 201) {
        alert("Order placed successfully!");
        // We'll add cart clearing logic next
        navigate('/home');
      }
    } catch (error) {
      console.error("Checkout error:", error);
      alert("Failed to place order. Please try again.");
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
    <div className="max-w-4xl mx-auto px-8 py-20">
      <h1 className="text-[12px] uppercase tracking-[0.5em] mb-12 text-center">Checkout</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
        {/* Left: Summary */}
        <div className="space-y-8">
          <h2 className="text-[10px] uppercase tracking-widest border-b pb-4">Order Summary</h2>
          {cart.map((item) => (
            <div key={`${item.id}-${item.size}-${item.color}`} className="flex justify-between items-center text-[11px]">
              <div className="flex gap-4">
                <img src={item.imageUrl} className="w-16 h-20 object-cover bg-gray-50" alt={item.name} />
                <div>
                  <p className="uppercase tracking-widest font-medium">{item.name}</p>
                  <p className="text-gray-400 mt-1">{item.size} / {item.color} (x{item.quantity})</p>
                </div>
              </div>
              <span>${(item.basePrice * item.quantity).toFixed(2)}</span>
            </div>
          ))}
        </div>

        {/* Right: Payment Logic */}
        <div className="bg-gray-50 p-8 flex flex-col justify-between">
          <div>
            <div className="flex justify-between mb-4 text-[11px] uppercase tracking-widest text-gray-500">
              <span>Subtotal</span>
              <span>${cartTotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between mb-8 text-[11px] uppercase tracking-widest text-gray-500">
              <span>Shipping</span>
              <span className="text-[9px]">Calculated at next step</span>
            </div>
            <div className="flex justify-between border-t pt-4 text-[12px] uppercase tracking-[0.2em] font-bold">
              <span>Total</span>
              <span>${cartTotal.toFixed(2)}</span>
            </div>
          </div>

          <button 
            onClick={handlePlaceOrder}
            disabled={loading}
            className="w-full bg-black text-white py-4 mt-12 text-[10px] uppercase tracking-[0.3em] hover:bg-gray-800 transition-colors disabled:bg-gray-400"
          >
            {loading ? "Processing..." : "Place Order"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Checkout;