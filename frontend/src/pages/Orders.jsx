import React, { useState, useEffect, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom'; 
import { useCart } from '../context/CartContext'; 
import api from '../api/axios';
import { AuthContext } from '../context/AuthContext';
import OrderStepper from '../components/OrderStepper';
import { Search, CheckCircle } from 'lucide-react'; 

/**
 * Orders Component
 * Handles the "Return Journey" from SSLCommerz and displays the order archive.
 */
const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useContext(AuthContext);

  // Payment Success Handling Hooks
  const location = useLocation();
  const navigate = useNavigate();
  const { clearCart } = useCart();
  const [showSuccess, setShowSuccess] = useState(false);

  // --- 1. Handle Redirect Success Logic (Stabilized) ---
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    let timeoutId; // 1. Create a variable to hold our timer

    if (params.get('status') === 'success') {
      setShowSuccess(true);
      clearCart(); // Clear the context cart
      
      // 2. Start the timer to clean the URL after 6 seconds
      timeoutId = setTimeout(() => {
        // We check if we are still on the "success" URL before navigating
        if (window.location.search.includes('status=success')) {
          navigate('/orders', { replace: true });
          setShowSuccess(false);
        }
      }, 6000);
    }

    // --- 3. THE CLEANUP FUNCTION (CRITICAL) ---
    // This tells React: "If the user leaves this component, KILL THE TIMER."
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
        console.log("Aurae Timer: Navigation detected, ghost timer killed.");
      }
    };
  }, [location.search, clearCart, navigate]);

  // --- 2. Fetch Orders from Ledger ---
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem('aurae_token'); 
        const response = await api.get('/orders/my-orders', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setOrders(response.data);
      } catch (err) {
        setError('AURA-ERR: Failed to connect to order ledger.');
        console.error("Order Fetch Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) return (
    <div className="flex h-screen items-center justify-center font-serif uppercase tracking-[0.5em] text-gray-800 animate-pulse bg-neutral-50">
      Consulting the Aurae Archive...
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto px-6 py-24">
      
      {/* --- SUCCESS NOTIFICATION --- */}
      {showSuccess && (
        <div className="bg-black text-white p-8 mb-16 flex items-center gap-6 animate-in fade-in slide-in-from-top-6 duration-1000 rounded-sm shadow-2xl">
          <div className="bg-white rounded-full p-2">
            <CheckCircle className="text-black" size={24} />
          </div>
          <div>
            <p className="text-[11px] uppercase tracking-[0.4em] font-black">Transaction Authenticated</p>
            <p className="text-[9px] uppercase tracking-widest opacity-60 mt-2 italic">Your curated selection has been secured and moved to the processing phase.</p>
          </div>
        </div>
      )}

      <header className="mb-20">
        <h1 className="text-5xl font-serif mb-4 text-gray-950 tracking-tight italic">My Orders</h1>
        <p className="text-gray-800 font-medium text-sm tracking-wide">A high-contrast record of your curated Aurae collection.</p>
      </header>

      {error && (
        <div className="p-5 bg-red-100 text-red-900 text-xs mb-10 border-l-4 border-red-600 uppercase tracking-widest font-bold text-center">
          {error}
        </div>
      )}

      {orders.length === 0 ? (
        <div className="text-center py-40 border-2 border-dashed border-gray-300 rounded-sm bg-neutral-50">
          <Search size={32} className="text-gray-300 mx-auto mb-6" />
          <p className="text-gray-900 uppercase tracking-[0.4em] text-[11px] font-bold">Your archive is awaiting its first discovery.</p>
        </div>
      ) : (
        <div className="space-y-20">
          {orders.map((order) => (
            <div key={order.id} className="border-2 border-gray-200 p-8 sm:p-12 bg-white transition-all duration-500 hover:shadow-2xl hover:border-gray-900 rounded-sm">
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12 border-b-2 border-gray-100 pb-12">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.25em] text-gray-700 mb-3 font-bold">Reference</p>
                  <p className="text-sm font-mono text-gray-950 font-extrabold bg-gray-100 px-2 py-1 rounded-sm inline-block">#AUR-{String(order.id).padStart(4, '0')}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-[0.25em] text-gray-700 mb-3 font-bold">Date Entry</p>
                  <p className="text-xs text-gray-950 font-bold">{new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-[0.25em] text-gray-700 mb-3 font-bold">Investment</p>
                  <p className="text-lg font-serif font-bold text-gray-950 tracking-tight">${order.totalAmount}</p>
                </div>
                <div className="text-right sm:text-left">
                  <p className="text-[10px] uppercase tracking-[0.25em] text-gray-700 mb-3 font-bold">Journey Status</p>
                  <span className={`text-[10px] font-bold uppercase tracking-[0.2em] px-4 py-2 rounded-sm border-2 ${
                    order.status === 'DELIVERED' 
                      ? 'bg-green-100 text-green-950 border-green-300' 
                      : 'bg-black text-white border-black'
                  }`}>
                    {order.status}
                  </span>
                </div>
              </div>

              <div className="max-w-2xl mx-auto mb-20 px-4">
                <p className="text-center text-[10px] uppercase tracking-[0.4em] text-gray-800 mb-10 font-bold italic">Visual Timeline</p>
                <OrderStepper currentStatus={order.status} />
              </div>

              <div className="space-y-12 pt-12 border-t-2 border-gray-100">
                <p className="text-[10px] uppercase tracking-[0.3em] text-gray-800 font-bold mb-8">Manifest: Items Delivered</p>
                {order.orderItems.map((item, index) => (
                  <div key={index} className="flex justify-between items-center group">
                    <div className="flex gap-10">
                      <div className="w-24 h-32 bg-neutral-100 overflow-hidden border-2 border-gray-100 group-hover:border-black transition-colors rounded-sm shadow-inner">
                        {item.product?.imageUrl ? (
                          <img 
                            src={item.product.imageUrl} 
                            alt={item.product.name} 
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-[9px] text-gray-300 uppercase tracking-[0.3em] font-bold">Aurae / Archiv</div>
                        )}
                      </div>

                      <div className="flex flex-col justify-center">
                        <p className="font-serif text-gray-950 mb-3 text-lg uppercase tracking-wider font-medium">
                          {item.product?.name || `Archive Item #${item.productId}`}
                        </p>
                        <div className="flex items-center gap-6 text-[11px] text-gray-700 uppercase tracking-[0.2em]">
                          <span className="font-extrabold bg-neutral-100 px-2 py-0.5 rounded-sm">{item.color}</span>
                          <span className="w-1.5 h-1.5 bg-gray-300 rounded-full"></span>
                          <span className="font-extrabold bg-neutral-100 px-2 py-0.5 rounded-sm">{item.size}</span>
                          <span className="w-1.5 h-1.5 bg-gray-300 rounded-full"></span>
                          <span className="italic font-bold">MANIFEST: {item.quantity} UNITS</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-serif text-gray-950 text-xl font-bold tracking-tighter">${item.price}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;