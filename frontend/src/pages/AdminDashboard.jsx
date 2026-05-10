import React, { useState, useEffect } from 'react';
import api from '../api/axios';

const AdminDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAllOrders = async () => {
    try {
      const token = localStorage.getItem('aurae_token');
      const response = await api.get('/orders/all', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOrders(response.data);
    } catch (err) {
      console.error("Failed to fetch orders", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllOrders();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const token = localStorage.getItem('aurae_token');
      await api.put(`/orders/${orderId}/status`, { status: newStatus }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchAllOrders();
    } catch (err) {
      alert("Failed to update status");
    }
  };

  if (loading) return (
    <div className="flex h-screen items-center justify-center font-serif uppercase tracking-widest text-gray-400 animate-pulse">
      Retrieving Master Ledger...
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-6 py-20">
      <header className="mb-16">
        <h1 className="text-4xl font-serif mb-3 text-gray-900">Order Management</h1>
        <div className="flex items-center gap-4">
          <p className="text-gray-500 text-sm italic tracking-wide">Aurae Administrative Control</p>
          <div className="h-[1px] w-20 bg-gray-200"></div>
          <span className="text-[10px] font-bold uppercase tracking-widest bg-black text-white px-3 py-1">
            {orders.length} Total Orders
          </span>
        </div>
      </header>

      {/* Table Container with more visible border */}
      <div className="overflow-hidden border-2 border-gray-100 rounded-lg shadow-sm bg-white">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b-2 border-gray-100">
              <th className="p-5 text-[11px] uppercase tracking-widest font-extrabold text-gray-500">ID</th>
              <th className="p-5 text-[11px] uppercase tracking-widest font-extrabold text-gray-500">Customer</th>
              <th className="p-5 text-[11px] uppercase tracking-widest font-extrabold text-gray-500">Inventory</th>
              <th className="p-5 text-[11px] uppercase tracking-widest font-extrabold text-gray-500">Amount</th>
              <th className="p-5 text-[11px] uppercase tracking-widest font-extrabold text-gray-500">Current Status</th>
              <th className="p-5 text-[11px] uppercase tracking-widest font-extrabold text-gray-500 text-right">Update Status</th>
            </tr>
          </thead>
          <tbody className="divide-y-2 divide-gray-50">
            {orders.map((order) => (
              <tr key={order.id} className="group hover:bg-neutral-50 transition-all duration-300">
                <td className="p-5 text-xs font-mono text-gray-400">#{order.id}</td>
                <td className="p-5">
                  <p className="text-sm font-semibold text-gray-900 uppercase tracking-tight">
                    {order.user?.name || 'Guest User'}
                  </p>
                  <p className="text-[10px] text-gray-400 font-mono italic">{order.user?.email}</p>
                </td>
                <td className="p-5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-600">{order.orderItems.length} SKU</span>
                    <div className="group-hover:block hidden text-[10px] text-gray-600 font-medium">
                      ({order.orderItems.map(i => i.product?.name).join(', ')})
                    </div>
                  </div>
                </td>
                <td className="p-5 text-sm font-serif font-bold text-gray-800">${order.totalAmount}</td>
                <td className="p-5">
                  <span className={`text-[9px] font-bold uppercase tracking-[0.2em] px-3 py-1.5 rounded-full border ${
                    order.status === 'DELIVERED' 
                      ? 'bg-green-50 text-green-700 border-green-200' 
                      : order.status === 'PENDING'
                      ? 'bg-amber-50 text-amber-700 border-amber-200'
                      : 'bg-blue-50 text-blue-700 border-blue-200'
                  }`}>
                    {order.status}
                  </span>
                </td>
                <td className="p-5 text-right">
                  {/* VISIBILITY FIX: Stronger border and high-contrast focus */}
                  <select 
                    className="text-[10px] font-bold uppercase tracking-widest border-2 border-gray-800 rounded-sm px-3 py-2 bg-white cursor-pointer hover:bg-black hover:text-white transition-all focus:ring-0"
                    value={order.status}
                    onChange={(e) => handleStatusChange(order.id, e.target.value)}
                  >
                    <option value="PENDING">Pending</option>
                    <option value="PROCESSING">Processing</option>
                    <option value="SHIPPED">Shipped</option>
                    <option value="DELIVERED">Delivered</option>
                    <option value="CANCELLED">Cancelled</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboard;