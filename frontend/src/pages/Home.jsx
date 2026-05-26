import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../api/axios';
import { ChevronRight, Loader2 } from 'lucide-react';

const Home = () => {
  // --- Hooks & State ---
  const { user } = useContext(AuthContext);
  const navigate = useNavigate(); 
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Pagination limits state for independent category loading
  const [visibleLimits, setVisibleLimits] = useState({});

  // --- Side Effects ---
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get('/products/all');
        setProducts(response.data);

        // Dynamically initialize visible limits for each unique category to 3
        const initialLimits = {};
        response.data.forEach(product => {
          const catName = product.category?.name || 'Essentials';
          if (!initialLimits[catName]) {
            initialLimits[catName] = 3;
          }
        });
        setVisibleLimits(initialLimits);
      } catch (err) {
        console.error("Failed to fetch products:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // --- Group Products by Category ---
  const groupedProducts = products.reduce((groups, product) => {
    const catName = product.category?.name || 'Essentials';
    if (!groups[catName]) groups[catName] = [];
    groups[catName].push(product);
    return groups;
  }, {});

  // --- Handle Load More (Adds 3 to the specific category limit) ---
  const handleLoadMore = (categoryName) => {
    setVisibleLimits(prev => ({
      ...prev,
      [categoryName]: (prev[categoryName] || 3) + 3
    }));
  };

  return (
    <div className="min-h-screen bg-white">
      
      {/* 1. HERO SECTION */}
      <section className="relative h-[60vh] w-full bg-neutral-900 overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?auto=format&fit=crop&q=80&w=2000" 
          alt="Aurae Collection"
          className="absolute inset-0 w-full h-full object-cover opacity-60"
        />
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-white px-6">
          <h2 className="text-[10px] uppercase tracking-[0.5em] mb-4 font-bold">New Arrivals</h2>
          <h1 className="text-5xl md:text-7xl font-serif tracking-tight text-center">Essential Aesthetics</h1>
          <button 
            onClick={() => document.getElementById('catalog').scrollIntoView({ behavior: 'smooth' })}
            className="mt-8 px-8 py-3 border border-white text-[10px] uppercase tracking-widest font-bold hover:bg-white hover:text-black transition-all duration-300"
          >
            Explore Collection
          </button>
        </div>
      </section>

      {/* 2. DYNAMIC CATALOG SECTION (Sectors Layout) */}
      <main id="catalog" className="max-w-7xl mx-auto px-6 py-24 space-y-32">
        {loading ? (
          <div className="flex py-20 items-center justify-center text-[10px] uppercase tracking-[0.5em] text-gray-900 font-bold animate-pulse">
            <Loader2 className="animate-spin mr-3" size={16} /> Curating Catalog...
          </div>
        ) : (
          Object.keys(groupedProducts).map((categoryName) => {
            const allCategoryItems = groupedProducts[categoryName];
            const currentLimit = visibleLimits[categoryName] || 3;
            
            // Slice to show only up to the current limit
            const visibleItems = allCategoryItems.slice(0, currentLimit);
            const hasMore = allCategoryItems.length > currentLimit;

            return (
              <section key={categoryName} className="animate-in fade-in duration-700">
                
                {/* Sector Header */}
                <div className="flex justify-between items-end mb-12 border-b-2 border-gray-900 pb-4">
                  <h2 className="text-4xl font-serif italic text-gray-950 tracking-tight uppercase">
                    {categoryName}
                  </h2>
                  <Link 
                    to="/shop" 
                    className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-900 border-b border-black pb-0.5 hover:text-gray-500 hover:border-gray-500 transition-all"
                  >
                    View Full Catalog
                  </Link>
                </div>

                {/* Sector Grid (Strictly 3 Columns) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-16">
                  {visibleItems.map((product) => (
                    <Link to={`/product/${product.id}`} key={product.id} className="group block">
                      
                      {/* High-Contrast Image Card */}
                      <div className="relative aspect-[3/4] overflow-hidden bg-neutral-50 mb-6 transition-all duration-500 rounded-sm">
                        {product.imageUrl ? (
                          <img 
                            src={product.imageUrl} 
                            alt={product.name} 
                            className="w-full h-full object-cover grayscale-[0.1] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700" 
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-[10px] uppercase tracking-[0.4em] text-gray-400 font-black bg-neutral-100">
                            {product.name} Image
                          </div>
                        )}
                        
                        {/* Hover Slide-Up Bar */}
                        <div className="absolute bottom-0 left-0 w-full p-5 translate-y-full group-hover:translate-y-0 transition-transform duration-500 bg-white/95 backdrop-blur-sm flex justify-between items-center border-t-2 border-gray-900">
                          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-black">Examine Detail</span>
                          <ChevronRight size={16} className="text-black" strokeWidth={3} />
                        </div>
                      </div>

                      {/* Typography below image */}
                      <div className="space-y-1 px-1">
                        <p className="text-[9px] uppercase tracking-[0.3em] text-gray-500 font-black mb-1">
                          {product.category?.name || 'Collection'}
                        </p>
                        <div className="flex justify-between items-start">
                          <h3 className="font-serif text-lg text-gray-950 uppercase tracking-tight group-hover:italic transition-all duration-300 font-bold">
                            {product.name}
                          </h3>
                          <p className="text-sm font-black text-gray-900 tracking-tighter">
                            ${Number(product.basePrice).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>

                {/* Independent Load More Button for this specific category */}
                {hasMore && (
                  <div className="mt-16 flex justify-center">
                    <button
                      onClick={() => handleLoadMore(categoryName)}
                      className="bg-white hover:bg-black text-black hover:text-white border-2 border-black py-3.5 px-10 text-[10px] uppercase tracking-[0.3em] font-black transition-all duration-300 rounded-sm shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px]"
                    >
                      Load More {categoryName}
                    </button>
                  </div>
                )}
                
              </section>
            );
          })
        )}
      </main>

      {/* 3. FOOTER */}
      <footer className="border-t border-gray-100 py-12 text-center">
        <p className="text-[10px] text-gray-900 uppercase tracking-[0.4em] font-bold">
          © 2026 AURAE — Timeless Minimalism
        </p>
      </footer>
    </div>
  );
};

export default Home;