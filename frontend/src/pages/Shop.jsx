import React, { useState, useEffect, useRef } from 'react';
import api from '../api/axios';
import { Filter, ChevronRight, Search, X, SlidersHorizontal } from 'lucide-react';
import { Link } from 'react-router-dom';

/**
 * Shop Component
 * Features advanced live-filtering, category selection, and price ceiling.
 */
const Shop = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // --- Filter State ---
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [maxPrice, setMaxPrice] = useState(2000);
  const [sortBy, setSortBy] = useState('newest');

  // Ref for the search input to allow auto-focus
  const searchInputRef = useRef(null);

  useEffect(() => {
    const fetchShopData = async () => {
      try {
        const [prodRes, catRes] = await Promise.all([
          api.get('/products/all'),
          api.get('/categories')
        ]);
        setProducts(prodRes.data);
        setCategories(catRes.data);
        
        // Auto-focus the search bar after data loads
        if (searchInputRef.current) {
          searchInputRef.current.focus();
        }
      } catch (err) {
        console.error("Shop Data Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchShopData();
  }, []);

  // --- Filtering & Sorting Logic ---
  const filteredProducts = products
    .filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = activeCategory === 'All' || product.category?.name === activeCategory;
      const matchesPrice = product.basePrice <= maxPrice;
      return matchesSearch && matchesCategory && matchesPrice;
    })
    .sort((a, b) => {
      if (sortBy === 'price-low') return a.basePrice - b.basePrice;
      if (sortBy === 'price-high') return b.basePrice - a.basePrice;
      if (sortBy === 'newest') return new Date(b.createdAt) - new Date(a.createdAt);
      return 0;
    });

  if (loading) return (
    <div className="flex h-screen items-center justify-center font-serif uppercase tracking-[0.5em] text-gray-900 animate-pulse bg-white">
      Consulting the Archive...
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-6 py-24">
      {/* Search Header */}
      <header className="mb-20">
        <div className="max-w-xl mx-auto text-center mb-12">
           <h1 className="text-5xl font-serif mb-6 italic text-gray-950">Collection</h1>
           <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-black transition-colors" size={18} />
              <input 
                ref={searchInputRef}
                type="text"
                placeholder="SEARCH THE CATALOGUE..."
                className="w-full bg-white text-gray-900 placeholder:text-gray-400 border-b-2 border-gray-200 py-4 pl-12 pr-4 text-[11px] uppercase tracking-[0.3em] focus:border-black outline-none transition-all"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <X 
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer hover:text-black" 
                  size={16} 
                  onClick={() => setSearchQuery('')}
                />
              )}
           </div>
        </div>
      </header>

      <div className="flex flex-col lg:flex-row gap-16">
        {/* Sidebar Filters */}
        <aside className="w-full lg:w-64 space-y-12">
          
          {/* Categories */}
          <div>
            <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] mb-8 text-gray-900 flex items-center gap-2">
              <Filter size={14} strokeWidth={2.5} /> Classification
            </h3>
            <ul className="space-y-4">
              <li>
                <button 
                  onClick={() => setActiveCategory('All')}
                  className={`text-[10px] uppercase tracking-[0.2em] transition-all ${activeCategory === 'All' ? 'font-black border-b-2 border-black' : 'text-gray-400 hover:text-black'}`}
                >
                  All Archive
                </button>
              </li>
              {categories.map(cat => (
                <li key={cat.id}>
                  <button 
                    onClick={() => setActiveCategory(cat.name)}
                    className={`text-[10px] uppercase tracking-[0.2em] transition-all ${activeCategory === cat.name ? 'font-black border-b-2 border-black' : 'text-gray-400 hover:text-black'}`}
                  >
                    {cat.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Price Range */}
          <div className="pt-8 border-t border-gray-100">
            <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] mb-8 text-gray-900 flex items-center gap-2">
              <SlidersHorizontal size={14} strokeWidth={2.5} /> Price Ceiling
            </h3>
            <input 
              type="range" min="0" max="2000" step="50"
              className="w-full accent-black cursor-pointer"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
            />
            <div className="flex justify-between mt-4 text-[10px] font-mono font-bold text-gray-500 uppercase tracking-widest">
              <span>$0</span>
              <span className="text-black bg-gray-100 px-2 py-1 rounded-sm border border-gray-200">Up to ${maxPrice}</span>
            </div>
          </div>

          {/* Sort */}
          <div className="pt-8 border-t border-gray-100">
            <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] mb-6 text-gray-900">Sort By</h3>
            <select 
              className="w-full bg-white text-gray-900 border-b border-gray-300 py-2 px-1 text-[10px] uppercase tracking-widest outline-none focus:border-black cursor-pointer"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="newest" className="text-gray-900 bg-white">Newest Arrivals</option>
              <option value="price-low" className="text-gray-900 bg-white">Price: Low to High</option>
              <option value="price-high" className="text-gray-900 bg-white">Price: High to Low</option>
            </select>
          </div>
        </aside>

        {/* Product Grid */}
        <main className="flex-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-20">
            {filteredProducts.map((product) => (
              <Link to={`/product/${product.id}`} key={product.id} className="group block">
                <div className="relative aspect-[3/4] overflow-hidden bg-neutral-50 mb-8 border border-transparent group-hover:border-gray-200 transition-all duration-500">
                  {product.imageUrl ? (
                    <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 group-hover:scale-110 transition-all duration-1000" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[10px] uppercase tracking-[0.4em] text-gray-300 font-bold">Aurae Pieces</div>
                  )}
                  <div className="absolute bottom-0 left-0 w-full p-6 translate-y-full group-hover:translate-y-0 transition-transform duration-700 bg-white/95 backdrop-blur-sm flex justify-between items-center">
                    <span className="text-[10px] font-bold uppercase tracking-[0.3em]">Examine Detail</span>
                    <ChevronRight size={16} />
                  </div>
                </div>

                <div className="space-y-2 px-1">
                  <p className="text-[9px] uppercase tracking-[0.3em] text-gray-400 font-black">{product.category?.name || 'Collection'}</p>
                  <h3 className="font-serif text-xl text-gray-950 uppercase tracking-tight group-hover:italic transition-all duration-300">{product.name}</h3>
                  <p className="text-sm font-bold text-gray-900 tracking-tighter">${product.basePrice}</p>
                </div>
              </Link>
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-40 bg-neutral-50 border-2 border-dashed border-gray-200 rounded-sm">
              <p className="text-[11px] uppercase tracking-[0.5em] text-gray-400 font-bold mb-4">Discovery Failed</p>
              <button 
                onClick={() => {setSearchQuery(''); setActiveCategory('All'); setMaxPrice(2000);}}
                className="mt-8 text-[10px] font-bold uppercase tracking-widest border-b border-black pb-1 hover:text-gray-500 hover:border-gray-500 transition-all"
              >
                Reset Search Filters
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Shop;