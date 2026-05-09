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
        // MATCHING KEY: Using 'aurae_token' as defined in your AuthContext
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
    <div className="flex h-screen items-center justify-center font-serif uppercase tracking-widest text-gray-400">
      Loading your history...
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <header className="mb-12">
        <h1 className="text-4xl font-serif mb-2">My Orders</h1>
        <p className="text-gray-500 font-light italic">A record of your journey with Aurae.</p>
      </header>

      {error && (
        <div className="p-4 bg-red-50 text-red-700 text-sm mb-8 border border-red-100">
          {error}
        </div>
      )}

      {orders.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-gray-200">
          <p className="text-gray-400 uppercase tracking-widest text-[10px]">No orders found yet.</p>
        </div>
      ) : (
        <div className="space-y-10">
          {orders.map((order) => (
            <div key={order.id} className="border border-gray-100 p-6 sm:p-8 hover:shadow-md transition-all duration-300">
              
              {/* Order Header: Basic Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8 border-b border-gray-50 pb-6">
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-1 font-bold">Order ID</p>
                  <p className="text-xs font-mono text-gray-600">#{order.id.slice(-8)}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-1 font-bold">Placed On</p>
                  <p className="text-xs">{new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-1 font-bold">Total</p>
                  <p className="text-sm font-serif font-bold text-[#4A5D4E]">${order.totalAmount}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-1 font-bold">Status</p>
                  <span className={`text-[9px] font-bold uppercase tracking-widest px-2 py-1 rounded-sm ${
                    order.status === 'DELIVERED' ? 'bg-green-100 text-green-800' : 'bg-neutral-100 text-neutral-600'
                  }`}>
                    {order.status}
                  </span>
                </div>
              </div>

              {/* Order Items: List of specific products */}
              <div className="space-y-6">
                {order.orderItems.map((item, index) => (
                  <div key={index} className="flex justify-between items-center text-sm group">
                    <div className="flex gap-4">
                      {/* Product Placeholder Image */}
                      <div className="w-16 h-20 bg-neutral-50 flex items-center justify-center border border-gray-100">
                         <span className="text-[8px] text-gray-300 uppercase tracking-widest">Aurae</span>
                      </div>
                      <div className="flex flex-col justify-center">
                        <p className="font-medium text-gray-900 mb-1 uppercase tracking-tight">Product SKU: {item.productId}</p>
                        <div className="flex items-center gap-3 text-[10px] text-gray-400 uppercase tracking-widest">
                          <span>{item.size}</span>
                          <span className="w-1 h-1 bg-gray-200 rounded-full"></span>
                          <span>{item.color}</span>
                          <span className="w-1 h-1 bg-gray-200 rounded-full"></span>
                          <span>Qty: {item.quantity}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-serif text-gray-900">${item.price}</p>
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