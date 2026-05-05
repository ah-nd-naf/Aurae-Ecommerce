import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../api/axios';

const Home = () => {
  const { user, logout } = useContext(AuthContext);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // This hits your backend route: http://localhost:5000/api/products/all
        const response = await api.get('/products/all');
        setProducts(response.data);
      } catch (err) {
        console.error("Failed to fetch products:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Simple Temporary Header */}
      <nav className="flex justify-between items-center px-8 py-6 border-b border-gray-100">
        <h1 className="text-2xl font-serif tracking-widest uppercase">AURAE</h1>
        <div className="flex items-center gap-6">
          <span className="text-[10px] uppercase tracking-widest text-gray-400">
            Welcome, {user?.email}
          </span>
          <button 
            onClick={logout}
            className="text-[10px] uppercase tracking-widest font-bold hover:text-red-600 transition-colors"
          >
            Logout
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="px-8 py-16 text-center">
        <h2 className="text-5xl font-serif text-gray-900 mb-4">The Collection</h2>
        <p className="text-gray-500 font-light italic">Timeless pieces for the modern individual.</p>
      </header>

      {/* Product Grid */}
      <main className="max-w-7xl mx-auto px-8 pb-24">
        {loading ? (
          <div className="text-center py-20 uppercase tracking-[0.2em] text-xs text-gray-400">Loading Collection...</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
            {products.map((product) => (
              <div key={product.id} className="group cursor-pointer">
                <div className="aspect-[3/4] bg-neutral-100 mb-6 overflow-hidden relative">
                  {/* Placeholder for images since we haven't added them to DB yet */}
                  <div className="absolute inset-0 flex items-center justify-center text-[10px] uppercase tracking-widest text-gray-400 group-hover:scale-110 transition-transform duration-500">
                    {product.name}
                  </div>
                </div>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 uppercase tracking-wider">{product.name}</h3>
                    <p className="text-xs text-gray-500 mt-1 uppercase tracking-widest">{product.category?.name}</p>
                  </div>
                  <p className="text-sm font-serif text-gray-900">${product.basePrice}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Home;