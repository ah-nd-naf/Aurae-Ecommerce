import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await api.get(`/products/${id}`);
        setProduct(response.data);
      } catch (err) {
        console.error("Error fetching product:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) return <div className="h-screen flex items-center justify-center uppercase tracking-widest text-xs">Loading Piece...</div>;
  if (!product) return <div className="h-screen flex items-center justify-center">Product not found.</div>;

  return (
    <div className="max-w-7xl mx-auto px-8 py-12">
      <button 
        onClick={() => navigate(-1)} 
        className="text-[10px] uppercase tracking-[0.2em] mb-12 flex items-center gap-2 hover:text-gray-400 transition-colors"
      >
        ← Back to Collection
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
        {/* Left: Product Image */}
        <div className="aspect-[3/4] bg-neutral-100 overflow-hidden">
          <div className="w-full h-full flex items-center justify-center text-neutral-400 uppercase tracking-widest text-xs">
            {product.name} Image
          </div>
        </div>

        {/* Right: Product Info */}
        <div className="flex flex-col justify-center">
          <p className="text-[10px] uppercase tracking-[0.3em] text-gray-400 mb-2">
            {product.category?.name || 'Essentials'}
          </p>
          <h1 className="text-4xl font-serif text-gray-900 mb-4">{product.name}</h1>
          <p className="text-2xl font-light text-gray-900 mb-8">${product.basePrice}</p>
          
          <div className="border-t border-gray-100 pt-8">
            <p className="text-sm text-gray-600 leading-relaxed mb-10">
              {product.description || "A masterclass in minimalist design, this piece embodies the Aurae philosophy of quality over quantity. Crafted with precision and designed to last a lifetime."}
            </p>

            <button className="w-full bg-[#4A5D4E] text-white py-4 text-[11px] uppercase tracking-[0.3em] hover:bg-[#3d4d41] transition-colors">
              Add to Bag
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;