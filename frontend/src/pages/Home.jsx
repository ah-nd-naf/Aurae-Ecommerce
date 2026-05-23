import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../api/axios';

const Home = () => {
  // --- Hooks & State ---
  const { user } = useContext(AuthContext);
  const navigate = useNavigate(); // Hook to enable navigation to product details
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- Side Effects ---
  useEffect(() => {
    /**
     * Fetches all products from the PostgreSQL database via the Express backend.
     * Hits endpoint: GET /api/products/all
     */
    const fetchProducts = async () => {
      try {
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
      
      {/* 1. HERO SECTION 
          Editorial background image with central brand call-to-action.
      */}
      <section className="relative h-[60vh] w-full bg-neutral-900 overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?auto=format&fit=crop&q=80&w=2000" 
          alt="Aurae Collection"
          className="absolute inset-0 w-full h-full object-cover opacity-60"
        />
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-white px-6">
          <h2 className="text-[10px] uppercase tracking-[0.5em] mb-4">New Arrivals</h2>
          <h1 className="text-5xl md:text-7xl font-serif tracking-tight text-center">Essential Aesthetics</h1>
          <button 
          onClick={() => document.getElementById('catalog').scrollIntoView({ behavior: 'smooth' })}
          className="mt-8 px-8 py-3 border border-white text-[10px] uppercase tracking-widest hover:bg-white hover:text-black transition-all duration-300">
            Explore Collection
          </button>
        </div>
      </section>

      {/* 2. PRODUCT GRID SECTION 
          The main shop catalog displaying dynamic products from the DB.
      */}
      <main id="catalog" className="max-w-7xl mx-auto px-8 py-20">
        
        {/* Catalog Header Info */}
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-2xl font-serif text-gray-900">The Catalog</h2>
            <p className="text-gray-500 text-xs uppercase tracking-widest mt-2">Quality Over Quantity</p>
          </div>
          <div className="text-[10px] text-gray-500 uppercase tracking-widest">
            {products.length} Products Found
          </div>
        </div>

        {/* Loading State: Pulse animation for a premium feel */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <span className="text-[10px] uppercase tracking-[0.3em] animate-pulse">Loading Collection...</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-16">
            {products.map((product) => (
              /**
               * Each Product Card:
               * Clicking anywhere on the card navigates to the detailed view.
               */
              <div 
                key={product.id} 
                className="group cursor-pointer"
                onClick={() => navigate(`/product/${product.id}`)}
              >
                {/* Product Image with Hover Effects */}
                <div className="aspect-[3/4] bg-neutral-100 mb-6 overflow-hidden relative">
                  {product.imageUrl ? (
                    <img 
                      src={product.imageUrl} 
                      alt={product.name} 
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-[10px] uppercase tracking-widest text-gray-400 group-hover:scale-110 transition-transform duration-700">
                      {product.name}
                    </div>
                  )}
                  {/* Subtle dark overlay on hover */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />
                </div>

                {/* Product Text Details */}
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-[11px] font-bold uppercase tracking-wider text-gray-900">{product.name}</h3>
                    <p className="text-[10px] text-gray-500 mt-1 uppercase tracking-widest">
                      {product.category?.name || 'Essentials'}
                    </p>
                  </div>
                  <span className="text-sm font-serif text-gray-900">${product.basePrice}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* 3. FOOTER 
          Simple copyright and brand philosophy.
      */}
      <footer className="border-t border-gray-100 py-12 text-center">
        <p className="text-[10px] text-gray-1000 uppercase tracking-[0.4em]">
          © 2026 AURAE — Timeless Minimalism
        </p>
      </footer>
    </div>
  );
};

export default Home;