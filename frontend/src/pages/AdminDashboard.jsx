import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { Plus, Trash2, X, Package, ShoppingCart } from 'lucide-react';

/**
 * AdminDashboard Component
 * Professional management interface with high-visibility actions.
 */
const AdminDashboard = () => {
  // --- State Management ---
  const [activeTab, setActiveTab] = useState('orders'); 
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Modal & Form State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    basePrice: '',
    categoryId: '1', 
    imageUrl: '',    
    variants: [{ size: '', color: '', stock: 0, price: '' }]
  });

  // --- API Functions ---
  const fetchAllOrders = async () => {
    try {
      const token = localStorage.getItem('aurae_token');
      const response = await api.get('/orders/all', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOrders(response.data);
    } catch (err) {
      console.error("Failed to fetch orders", err);
    }
  };

  const fetchInventory = async () => {
    try {
      const response = await api.get('/products/all');
      setProducts(response.data);
    } catch (err) {
      console.error("Failed to fetch inventory", err);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      if (activeTab === 'orders') await fetchAllOrders();
      if (activeTab === 'inventory') await fetchInventory();
      setLoading(false);
    };
    loadData();
  }, [activeTab]);

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

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm("ARE YOU SURE? This action will permanently delete this product and its variants.")) return;
    try {
      const token = localStorage.getItem('aurae_token');
      await api.delete(`/products/${productId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchInventory();
    } catch (err) {
      alert("Failed to delete product");
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('aurae_token');
      await api.post('/products/add', newProduct, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setIsModalOpen(false);
      fetchInventory();
      alert("Product added successfully");
    } catch (err) {
      alert("Error adding product. Check all fields and Category ID.");
    }
  };

  if (loading) return (
    <div className="flex h-screen items-center justify-center font-serif uppercase tracking-widest text-gray-400 animate-pulse">
      Updating Master Ledger...
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-6 py-20">
      
      {/* Header & Navigation */}
      <header className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div>
          <h1 className="text-4xl font-serif mb-6 text-gray-900 tracking-tight">Admin Portal</h1>
          <div className="flex gap-8">
            <button 
              onClick={() => setActiveTab('orders')}
              className={`text-[11px] uppercase tracking-[0.3em] font-bold pb-2 border-b-2 transition-all ${activeTab === 'orders' ? 'border-black text-black' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
            >
              Order Flow
            </button>
            <button 
              onClick={() => setActiveTab('inventory')}
              className={`text-[11px] uppercase tracking-[0.3em] font-bold pb-2 border-b-2 transition-all ${activeTab === 'inventory' ? 'border-black text-black' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
            >
              Inventory Archive
            </button>
          </div>
        </div>

        {activeTab === 'inventory' && (
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-black text-white px-8 py-4 text-[10px] uppercase tracking-[0.3em] font-bold hover:bg-gray-800 transition-all shadow-lg"
          >
            <Plus size={16} /> Add New Item
          </button>
        )}
      </header>

      {/* --- Tab Content: Orders --- */}
      {activeTab === 'orders' && (
        <div className="overflow-hidden border-2 border-gray-100 rounded-lg bg-white">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b-2 border-gray-100">
                <th className="p-5 text-[11px] uppercase tracking-widest font-extrabold text-gray-500">ID</th>
                <th className="p-5 text-[11px] uppercase tracking-widest font-extrabold text-gray-500">Customer</th>
                <th className="p-5 text-[11px] uppercase tracking-widest font-extrabold text-gray-500">Inventory</th>
                <th className="p-5 text-[11px] uppercase tracking-widest font-extrabold text-gray-500">Amount</th>
                <th className="p-5 text-[11px] uppercase tracking-widest font-extrabold text-gray-500">Status</th>
                <th className="p-5 text-[11px] uppercase tracking-widest font-extrabold text-gray-500 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y-2 divide-gray-50">
              {orders.map((order) => (
                <tr key={order.id} className="group hover:bg-neutral-50 transition-all">
                  <td className="p-5 text-xs font-mono text-gray-400">#{order.id}</td>
                  <td className="p-5">
                    <p className="text-sm font-semibold uppercase tracking-tight">{order.user?.name || 'Guest'}</p>
                    <p className="text-[10px] text-gray-400 font-mono italic">{order.user?.email}</p>
                  </td>
                  <td className="p-5 text-xs text-gray-600 font-medium">{order.orderItems.length} SKU</td>
                  <td className="p-5 text-sm font-serif font-bold text-gray-800">${order.totalAmount}</td>
                  <td className="p-5">
                    <span className={`text-[9px] font-bold uppercase tracking-[0.2em] px-3 py-1.5 rounded-full border ${
                      order.status === 'DELIVERED' ? 'bg-green-50 text-green-700 border-green-200' : 
                      order.status === 'PENDING' ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-blue-50 text-blue-700 border-blue-200'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="p-5 text-right">
                    <select 
                      className="text-[10px] font-bold uppercase tracking-widest border-2 border-gray-800 rounded-sm px-3 py-2 bg-white hover:bg-black hover:text-white transition-all outline-none"
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
      )}

      {/* --- Tab Content: Inventory --- */}
      {activeTab === 'inventory' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {products.map(product => (
            <div key={product.id} className="group border-2 border-gray-100 p-0 bg-white relative hover:border-gray-300 transition-all shadow-sm">
              
              {/* HIGH VISIBILITY DELETE BUTTON */}
              <button 
                onClick={() => handleDeleteProduct(product.id)}
                className="absolute top-4 right-4 z-20 bg-white/90 p-3 rounded-full shadow-md text-gray-400 hover:text-red-600 hover:bg-white transition-all transform hover:scale-110 active:scale-95"
                title="Delete Product"
              >
                <Trash2 size={20} strokeWidth={2} />
              </button>
              
              {/* Image Section */}
              <div className="h-72 bg-neutral-100 flex items-center justify-center overflow-hidden border-b border-gray-100 relative">
                 {product.imageUrl ? (
                   <img 
                    src={product.imageUrl} 
                    alt={product.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                   />
                 ) : (
                   <Package size={48} className="text-gray-300" />
                 )}
                 <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors pointer-events-none" />
              </div>

              {/* Product Info */}
              <div className="p-8">
                <h3 className="font-serif text-xl mb-1 uppercase tracking-tight text-gray-900">{product.name}</h3>
                <p className="text-[10px] text-gray-400 uppercase tracking-[0.2em] mb-6 font-bold">
                  {product.category?.name || 'Aurae Collection'}
                </p>
                
                <div className="flex justify-between items-center pt-6 border-t border-gray-50">
                  <span className="font-serif font-bold text-lg text-gray-800">${product.basePrice}</span>
                  <div className="flex flex-col items-end">
                    <span className="text-[9px] font-bold uppercase tracking-widest text-gray-400 mb-1">Stock Level</span>
                    <span className={`text-[10px] font-bold px-3 py-1 rounded-sm ${product.variants?.reduce((acc, v) => acc + v.stock, 0) < 5 ? 'bg-red-50 text-red-600' : 'bg-gray-100 text-gray-600'}`}>
                      {product.variants?.reduce((acc, v) => acc + v.stock, 0) || 0} units
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* --- Add Product Modal --- */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-2xl p-12 rounded-sm shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-8 right-8 text-gray-400 hover:text-black transition-colors">
              <X size={28} strokeWidth={1.5} />
            </button>
            <h2 className="text-3xl font-serif mb-10 uppercase tracking-widest border-b border-gray-100 pb-6 italic">Add to Archive</h2>
            
            <form onSubmit={handleAddProduct} className="space-y-8">
              <div className="grid grid-cols-2 gap-8">
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Entry Name</label>
                  <input type="text" required className="border-b-2 border-gray-100 py-3 focus:border-black outline-none uppercase text-xs tracking-widest transition-colors"
                    onChange={(e) => setNewProduct({...newProduct, name: e.target.value})} />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Base Price ($)</label>
                  <input type="number" required className="border-b-2 border-gray-100 py-3 focus:border-black outline-none text-xs transition-colors"
                    onChange={(e) => setNewProduct({...newProduct, basePrice: e.target.value})} />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Source Image URL</label>
                <input type="text" required placeholder="https://..."
                  className="border-b-2 border-gray-100 py-3 focus:border-black outline-none text-[10px] uppercase tracking-widest transition-colors"
                  onChange={(e) => setNewProduct({...newProduct, imageUrl: e.target.value})} />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Description</label>
                <textarea rows="2" className="border-b-2 border-gray-100 py-3 focus:border-black outline-none text-xs uppercase tracking-widest resize-none transition-colors"
                  onChange={(e) => setNewProduct({...newProduct, description: e.target.value})} />
              </div>

              <div className="p-8 bg-neutral-50 border border-gray-100 rounded-sm">
                <p className="text-[10px] font-bold tracking-[0.2em] mb-8 text-gray-400 uppercase text-center border-b border-gray-200 pb-4">Variant Metadata</p>
                <div className="grid grid-cols-3 gap-8">
                  <div className="flex flex-col gap-2">
                    <label className="text-[9px] uppercase tracking-widest text-gray-400">Size</label>
                    <input type="text" required placeholder="EU 42 / XL" className="bg-transparent border-b border-gray-300 py-2 text-[10px] focus:border-black outline-none" 
                      onChange={(e) => {
                        let v = [...newProduct.variants];
                        v[0].size = e.target.value;
                        setNewProduct({...newProduct, variants: v});
                      }}
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-[9px] uppercase tracking-widest text-gray-400">Color</label>
                    <input type="text" required placeholder="Slate / Onyx" className="bg-transparent border-b border-gray-300 py-2 text-[10px] focus:border-black outline-none" 
                      onChange={(e) => {
                        let v = [...newProduct.variants];
                        v[0].color = e.target.value;
                        setNewProduct({...newProduct, variants: v});
                      }}
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-[9px] uppercase tracking-widest text-gray-400">Stock</label>
                    <input type="number" required placeholder="0" className="bg-transparent border-b border-gray-300 py-2 text-[10px] focus:border-black outline-none" 
                      onChange={(e) => {
                        let v = [...newProduct.variants];
                        v[0].stock = e.target.value;
                        setNewProduct({...newProduct, variants: v});
                      }}
                    />
                  </div>
                </div>
              </div>

              <button type="submit" className="w-full bg-black text-white py-6 text-[11px] uppercase tracking-[0.4em] font-bold hover:bg-gray-800 transition-all shadow-xl active:scale-[0.99]">
                Commit to Database
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;