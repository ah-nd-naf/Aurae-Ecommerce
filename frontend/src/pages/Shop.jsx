import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { Filter, ChevronRight, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');

  useEffect(() => {
    const fetchShopData = async () => {
      try {
        const [prodRes, catRes] = await Promise.all([
          api.get('/products/all'),
          api.get('/categories')
        ]);
        setProducts(prodRes.data);
        setCategories(catRes.data);
      } catch (err) {
        console.error("Shop Data Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchShopData();
  }, []);

  // Filter logic
  const filteredProducts = activeCategory === 'All' 
    ? products 
    : products.filter(p => p.category?.name === activeCategory);

  if (loading) return (
    <div className="flex h-screen items-center justify-center font-serif uppercase tracking-[0.5em] text-gray-900 animate-pulse">
      Loading Collection...
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-6 py-24">
      {/* Page Header */}
      <header className="mb-20 text-center">
        <h1 className="text-5xl font-serif mb-4 italic text-gray-950">Aurae Collection</h1>
        <p className="text-[10px] uppercase tracking-[0.4em] text-gray-500 font-bold">
          Curated Essentials / {filteredProducts.length} Pieces
        </p>
      </header>

      <div className="flex flex-col md:flex-row gap-16">
        {/* Sidebar Filters */}
        <aside className="w-full md:w-48 space-y-12">
          <div>
            <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
              <Filter size={14} /> Categories
            </h3>
            <ul className="space-y-4">
              <li>
                <button 
                  onClick={() => setActiveCategory('All')}
                  className={`text-[10px] uppercase tracking-widest transition-colors ${activeCategory === 'All' ? 'text-black font-extrabold' : 'text-gray-400 hover:text-black'}`}
                >
                  All Archive
                </button>
              </li>
              {categories.map(cat => (
                <li key={cat.id}>
                  <button 
                    onClick={() => setActiveCategory(cat.name)}
                    className={`text-[10px] uppercase tracking-widest transition-colors ${activeCategory === cat.name ? 'text-black font-extrabold' : 'text-gray-400 hover:text-black'}`}
                  >
                    {cat.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        {/* Product Grid */}
        <main className="flex-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
            {filteredProducts.map((product) => (
              <Link to={`/product/${product.id}`} key={product.id} className="group block">
                {/* Image Wrapper */}
                <div className="relative aspect-[3/4] overflow-hidden bg-neutral-100 mb-6 border border-transparent group-hover:border-gray-200 transition-all shadow-sm">
                  {product.imageUrl ? (
                    <img 
                      src={product.imageUrl} 
                      alt={product.name} 
                      className="w-full h-full object-cover grayscale-[0.3] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[10px] uppercase tracking-widest text-gray-300">Aurae Image</div>
                  )}
                  {/* Quick Add Overlay */}
                  <div className="absolute bottom-0 left-0 w-full p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-500 bg-white/90 backdrop-blur-sm border-t border-gray-100 flex justify-between items-center">
                    <span className="text-[9px] font-bold uppercase tracking-widest">View Details</span>
                    <ChevronRight size={14} />
                  </div>
                </div>

                {/* Info */}
                <div className="space-y-1">
                  <p className="text-[9px] uppercase tracking-[0.2em] text-gray-400 font-bold">{product.category?.name}</p>
                  <h3 className="font-serif text-lg text-gray-950 uppercase tracking-tight group-hover:italic transition-all">{product.name}</h3>
                  <p className="text-sm font-bold text-gray-900">${product.basePrice}</p>
                </div>
              </Link>
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-40 border border-dashed border-gray-200">
              <p className="text-[10px] uppercase tracking-[0.3em] text-gray-400 font-bold">No pieces found in this category.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Shop;