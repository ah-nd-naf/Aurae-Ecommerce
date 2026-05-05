import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../api/axios';

const Home = () => {
  const { user } = useContext(AuthContext);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Fetching your shirts, shoes, and pants from the Postgres DB
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
      {/* 1. Hero Section - The Brand Statement */}
      <section className="relative h-[60vh] w-full bg-neutral-900 overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?auto=format&fit=crop&q=80&w=2000" 
          alt="Aurae Collection"
          className="absolute inset-0 w-full h-full object-cover opacity-60"
        />
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-white px-6">
          <h2 className="text-[10px] uppercase tracking-[0.5em] mb-4">New Arrivals</h2>
          <h1 className="text-5xl md:text-7xl font-serif tracking-tight text-center">Essential Aesthetics</h1>
          <button className="mt-8 px-8 py-3 border border-white text-[10px] uppercase tracking-widest hover:bg-white hover:text-black transition-all duration-300">
            Explore Collection
          </button>
        </div>
      </section>

      {/* 2. Product Grid Section */}
      <main className="max-w-7xl mx-auto px-8 py-20">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-2xl font-serif text-gray-900">The Catalog</h2>
            <p className="text-gray-500 text-xs uppercase tracking-widest mt-2">Quality Over Quantity</p>
          </div>
          <div className="text-[10px] text-gray-400 uppercase tracking-widest">
            {products.length} Products Found
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <span className="text-[10px] uppercase tracking-[0.3em] animate-pulse">Loading Collection...</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-16">
            {products.map((product) => (
              <div key={product.id} className="group">
                {/* Product Image Placeholder */}
                <div className="aspect-[3/4] bg-neutral-100 mb-6 overflow-hidden relative cursor-pointer">
                  <div className="absolute inset-0 flex items-center justify-center text-[10px] uppercase tracking-widest text-gray-400 group-hover:scale-110 transition-transform duration-700">
                    {product.name}
                  </div>
                  {/* Overlay for quick view */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />
                </div>

                {/* Product Info */}
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-[11px] font-bold uppercase tracking-wider text-gray-900">{product.name}</h3>
                    <p className="text-[10px] text-gray-500 mt-1 uppercase tracking-widest">{product.category?.name || 'Essentials'}</p>
                  </div>
                  <span className="text-sm font-serif text-gray-900">${product.basePrice}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* 3. Footer Branding */}
      <footer className="border-t border-gray-100 py-12 text-center">
        <p className="text-[10px] text-gray-400 uppercase tracking-[0.4em]">© 2026 AURAE — Timeless Minimalism</p>
      </footer>
    </div>
  );
};

export default Home;