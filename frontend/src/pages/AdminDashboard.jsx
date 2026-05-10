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
      // Refresh list to show updated status
      fetchAllOrders();
    } catch (err) {
      alert("Failed to update status");
    }
  };

  if (loading) return <div className="p-20 text-center font-serif uppercase tracking-widest text-gray-400">Loading Master Ledger...</div>;

  return (
    <div className="max-w-7xl mx-auto px-6 py-16">
      <div className="mb-12">
        <h1 className="text-3xl font-serif mb-2">Order Management</h1>
        <p className="text-gray-500 text-sm italic">Admin Control Center</p>
      </div>

      <div className="overflow-x-auto border border-gray-100">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-neutral-50 border-b border-gray-100">
              <th className="p-4 text-[10px] uppercase tracking-widest font-bold text-gray-400">Order ID</th>
              <th className="p-4 text-[10px] uppercase tracking-widest font-bold text-gray-400">Customer</th>
              <th className="p-4 text-[10px] uppercase tracking-widest font-bold text-gray-400">Items</th>
              <th className="p-4 text-[10px] uppercase tracking-widest font-bold text-gray-400">Total</th>
              <th className="p-4 text-[10px] uppercase tracking-widest font-bold text-gray-400">Status</th>
              <th className="p-4 text-[10px] uppercase tracking-widest font-bold text-gray-400">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-neutral-50/50 transition-colors">
                <td className="p-4 text-xs font-mono">#{order.id}</td>
                <td className="p-4">
                  <p className="text-sm font-medium">{order.user?.name || 'Unknown'}</p>
                  <p className="text-[10px] text-gray-400">{order.user?.email}</p>
                </td>
                <td className="p-4 text-xs text-gray-600">
                  {order.orderItems.length} {order.orderItems.length === 1 ? 'item' : 'items'}
                </td>
                <td className="p-4 text-sm font-serif">${order.totalAmount}</td>
                <td className="p-4">
                  <span className={`text-[9px] font-bold uppercase tracking-widest px-2 py-1 rounded-sm ${
                    order.status === 'DELIVERED' ? 'bg-green-50 text-green-700' : 'bg-orange-50 text-orange-700'
                  }`}>
                    {order.status}
                  </span>
                </td>
                <td className="p-4">
                  <select 
                    className="text-[10px] uppercase tracking-tight border-gray-200 rounded-sm focus:ring-0"
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