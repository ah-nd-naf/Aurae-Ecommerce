import React, { useState, useEffect, useContext } from 'react';
import api from '../api/axios';
import { AuthContext } from '../context/AuthContext';

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
          headers: { 
            Authorization: `Bearer ${token}` 
          }
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
    <div className="flex h-screen items-center justify-center font-serif uppercase tracking-widest text-gray-400 animate-pulse">
      Retrieving History...
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <header className="mb-12">
        <h1 className="text-4xl font-serif mb-2 text-gray-900">My Orders</h1>
        <p className="text-gray-500 font-light italic text-sm tracking-wide">A curated record of your Aurae collection.</p>
      </header>

      {error && (
        <div className="p-4 bg-red-50 text-red-700 text-xs mb-8 border border-red-100 uppercase tracking-widest">
          {error}
        </div>
      )}

      {orders.length === 0 ? (
        <div className="text-center py-24 border border-dashed border-gray-200">
          <p className="text-gray-400 uppercase tracking-[0.2em] text-[10px]">No orders discovered yet.</p>
        </div>
      ) : (
        <div className="space-y-12">
          {orders.map((order) => (
            <div key={order.id} className="border border-gray-100 p-6 sm:p-10 bg-white transition-all duration-500 hover:border-gray-300">
              
              {/* Order Metadata Block */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10 border-b border-gray-50 pb-8">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.15em] text-gray-400 mb-2 font-bold">Ref No.</p>
                  {/* FIXED: Converting ID to string before slicing to prevent crash */}
                  <p className="text-xs font-mono text-gray-800">#{String(order.id).padStart(4, '0')}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-[0.15em] text-gray-400 mb-2 font-bold">Ordered On</p>
                  <p className="text-xs text-gray-800">{new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-[0.15em] text-gray-400 mb-2 font-bold">Total Investment</p>
                  <p className="text-sm font-serif font-bold text-[#4A5D4E]">${order.totalAmount}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-[0.15em] text-gray-400 mb-2 font-bold">Status</p>
                  <span className={`text-[9px] font-bold uppercase tracking-[0.2em] px-2.5 py-1 rounded-sm ${
                    order.status === 'DELIVERED' ? 'bg-green-50 text-green-700' : 'bg-stone-100 text-stone-500'
                  }`}>
                    {order.status}
                  </span>
                </div>
              </div>

              {/* Order Items List */}
              <div className="space-y-8">
                {order.orderItems.map((item, index) => (
                  <div key={index} className="flex justify-between items-center group">
                    <div className="flex gap-6">
                      {/* Product Image Update */}
                      <div className="w-20 h-24 bg-neutral-50 overflow-hidden border border-gray-50">
                        {item.product?.imageUrl ? (
                          <img 
                            src={item.product.imageUrl} 
                            alt={item.product.name} 
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-[8px] text-gray-300 uppercase tracking-widest">Aurae</div>
                        )}
                      </div>

                      <div className="flex flex-col justify-center">
                        {/* Showing Actual Product Name */}
                        <p className="font-serif text-gray-900 mb-1.5 text-sm uppercase tracking-wider">
                          {item.product?.name || `Product Archive #${item.productId}`}
                        </p>
                        <div className="flex items-center gap-4 text-[9px] text-gray-400 uppercase tracking-[0.15em]">
                          <span className="text-gray-600">{item.color}</span>
                          <span className="w-1 h-1 bg-gray-200 rounded-full"></span>
                          <span className="text-gray-600">{item.size}</span>
                          <span className="w-1 h-1 bg-gray-200 rounded-full"></span>
                          <span>Quantity {item.quantity}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-serif text-gray-900 text-sm font-bold">${item.price}</p>
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