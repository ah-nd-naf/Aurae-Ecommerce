import { useCart } from "../context/CartContext";
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
// Imported the brand new Verified Reviews Section component
import ReviewsSection from '../components/ReviewsSection';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  
  // --- Variant Selection State ---
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await api.get(`/products/${id}`);
        setProduct(response.data);
        
        // Auto-select the first variant by default
        if (response.data.variants?.length > 0) {
          setSelectedSize(response.data.variants[0].size);
          setSelectedColor(response.data.variants[0].color);
        }
      } catch (err) {
        console.error("Error fetching product:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) return <div className="h-screen flex items-center justify-center uppercase tracking-widest text-[10px] animate-pulse">Loading Piece...</div>;
  if (!product) return <div className="h-screen flex items-center justify-center">Product not found.</div>;

  // Logic to extract unique sizes and colors from the variants array seeded in the DB
  const uniqueSizes = [...new Set(product.variants?.map(v => v.size))];
  const uniqueColors = [...new Set(product.variants?.map(v => v.color))];

  return (
    <div className="max-w-7xl mx-auto px-8 py-12">
      {/* Back Navigation */}
      <button 
        onClick={() => navigate(-1)} 
        className="text-[10px] uppercase tracking-[0.2em] mb-12 flex items-center gap-2 hover:text-gray-400 transition-colors"
      >
        ← Back to Collection
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
        {/* Left: Dynamic Product Image */}
        <div className="aspect-[3/4] bg-neutral-100 overflow-hidden relative">
          {product.imageUrl ? (
            <img 
              src={product.imageUrl} 
              alt={product.name} 
              className="absolute inset-0 w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-neutral-400 uppercase tracking-widest text-[10px]">
              {product.name} Image
            </div>
          )}
        </div>

        {/* Right: Product Details & Selection */}
        <div className="flex flex-col justify-center">
          <p className="text-[10px] uppercase tracking-[0.3em] text-gray-400 mb-2">
            {product.category?.name || 'Essentials'}
          </p>
          <h1 className="text-4xl font-serif text-gray-900 mb-4">{product.name}</h1>
          <p className="text-2xl font-light text-gray-900 mb-8">${product.basePrice}</p>
          
          <div className="border-t border-gray-100 pt-8 space-y-10">
            <p className="text-sm text-gray-600 leading-relaxed">
              {product.description}
            </p>

            {/* Size Selector */}
            <div>
              <h4 className="text-[10px] uppercase tracking-widest mb-4 text-gray-400">Select Size</h4>
              <div className="flex gap-3">
                {uniqueSizes.map(size => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`w-12 h-12 text-[10px] border transition-all duration-300 ${
                      selectedSize === size 
                      ? 'border-black bg-black text-white' 
                      : 'border-gray-200 hover:border-black text-gray-900'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Color Selector */}
            <div>
              <h4 className="text-[10px] uppercase tracking-widest mb-4 text-gray-400">Color: {selectedColor}</h4>
              <div className="flex gap-3">
                {uniqueColors.map(color => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`w-8 h-8 rounded-full border-2 p-0.5 transition-all ${
                      selectedColor === color ? 'border-black' : 'border-transparent'
                    }`}
                  >
                    <div className="w-full h-full rounded-full bg-neutral-300" />
                  </button>
                ))}
              </div>
            </div>

            {/* Add to Bag Action */}
            <button onClick={() => addToCart(product, selectedSize, selectedColor)}
            className="w-full bg-[#4A5D4E] text-white py-4 text-[11px] uppercase tracking-[0.3em] hover:bg-[#3d4d41] transition-all duration-300">
              Add to Bag
            </button>
          </div>
        </div>
      </div>

      {/* --- MOUNTED VERIFIED REVIEWS SECTION SYSTEM --- */}
      {/* Placed below the fold to let buyers read and post real verified reviews */}
      <div className="mt-12 border-t border-gray-100">
        <ReviewsSection productId={id} />
      </div>
    </div>
  );
};

export default ProductDetail;