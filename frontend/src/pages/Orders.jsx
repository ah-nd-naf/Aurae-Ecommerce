import React, { useState, useEffect, useContext } from 'react';
import api from '../api/axios';
import { AuthContext } from '../context/AuthContext';
import OrderStepper from '../components/OrderStepper'; // Import the new stepper

/**
 * Orders Component
 * The customer's archive of purchases. 
 * Featuring a visual progress stepper to track order fulfillment in real-time.
 */
const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem('aurae_token'); 
        const response = await api.get('/orders/my-orders', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setOrders(response.data);
      } catch (err) {
        setError('Failed to load your order history. Please try again later.');
        console.error("Order Fetch Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) return (
    <div className="flex h-screen items-center justify-center font-serif uppercase tracking-[0.4em] text-gray-400 animate-pulse">
      Retrieving Archive...
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto px-4 py-24">
      <header className="mb-16">
        <h1 className="text-4xl font-serif mb-3 text-gray-900 tracking-tight">Purchase History</h1>
        <p className="text-gray-500 font-light italic text-sm tracking-wide">A curated record of your Aurae collection.</p>
      </header>

      {error && (
        <div className="p-4 bg-red-50 text-red-700 text-[10px] mb-8 border border-red-100 uppercase tracking-widest text-center">
          {error}
        </div>
      )}

      {orders.length === 0 ? (
        <div className="text-center py-32 border border-dashed border-gray-200">
          <p className="text-gray-400 uppercase tracking-[0.3em] text-[10px]">Your archive is currently empty.</p>
        </div>
      ) : (
        <div className="space-y-16">
          {orders.map((order) => (
            <div key={order.id} className="border border-gray-100 p-8 sm:p-12 bg-white transition-all duration-500 hover:shadow-xl hover:border-gray-200">
              
              {/* Order Metadata Block */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12 border-b border-gray-50 pb-10">
                <div>
                  <p className="text-[9px] uppercase tracking-[0.2em] text-gray-400 mb-2 font-bold">Reference</p>
                  <p className="text-xs font-mono text-gray-900 font-bold">#AUR-{String(order.id).padStart(4, '0')}</p>
                </div>
                <div>
                  <p className="text-[9px] uppercase tracking-[0.2em] text-gray-400 mb-2 font-bold">Date</p>
                  <p className="text-xs text-gray-800 font-medium">{new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                </div>
                <div>
                  <p className="text-[9px] uppercase tracking-[0.2em] text-gray-400 mb-2 font-bold">Investment</p>
                  <p className="text-sm font-serif font-bold text-gray-900">${order.totalAmount}</p>
                </div>
                <div className="text-right sm:text-left">
                  <p className="text-[9px] uppercase tracking-[0.2em] text-gray-400 mb-2 font-bold">Current Phase</p>
                  <span className={`text-[9px] font-bold uppercase tracking-[0.2em] px-3 py-1 rounded-full border ${
                    order.status === 'DELIVERED' 
                      ? 'bg-green-50 text-green-700 border-green-100' 
                      : 'bg-stone-50 text-stone-600 border-stone-100'
                  }`}>
                    {order.status}
                  </span>
                </div>
              </div>

              {/* VISUAL ORDER TRACKER SECTION */}
              <div className="max-w-2xl mx-auto mb-20 px-4">
                <p className="text-center text-[9px] uppercase tracking-[0.3em] text-gray-300 mb-8 font-bold italic">Journey Status</p>
                <OrderStepper currentStatus={order.status} />
              </div>

              {/* Order Items List */}
              <div className="space-y-10 pt-10 border-t border-gray-50">
                <p className="text-[9px] uppercase tracking-[0.2em] text-gray-400 font-bold mb-6">Manifest</p>
                {order.orderItems.map((item, index) => (
                  <div key={index} className="flex justify-between items-center group">
                    <div className="flex gap-8">
                      {/* Product Image */}
                      <div className="w-20 h-28 bg-neutral-50 overflow-hidden border border-gray-100">
                        {item.product?.imageUrl ? (
                          <img 
                            src={item.product.imageUrl} 
                            alt={item.product.name} 
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-[8px] text-gray-200 uppercase tracking-widest">Aurae</div>
                        )}
                      </div>

                      <div className="flex flex-col justify-center">
                        <p className="font-serif text-gray-900 mb-2 text-sm uppercase tracking-widest">
                          {item.product?.name || `Archive Item #${item.productId}`}
                        </p>
                        <div className="flex items-center gap-4 text-[10px] text-gray-500 uppercase tracking-widest">
                          <span className="font-bold">{item.color}</span>
                          <span className="w-1 h-1 bg-gray-200 rounded-full"></span>
                          <span className="font-bold">{item.size}</span>
                          <span className="w-1 h-1 bg-gray-200 rounded-full"></span>
                          <span className="italic">Qty {item.quantity}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-serif text-gray-900 text-sm font-bold tracking-tighter">${item.price}</p>
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