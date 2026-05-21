import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Star, MessageSquare, ShieldCheck, Loader2 } from 'lucide-react';

/**
 * ReviewsSection Component
 * High-Contrast version to fix visibility and text styling issues.
 */
const ReviewsSection = ({ productId }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [hoveredRating, setHoveredRating] = useState(null);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/reviews/${productId}`);
        setReviews(response.data);
      } catch (err) {
        console.error("Fetch reviews error:", err);
      } finally {
        setLoading(false);
      }
    };

    if (productId) fetchReviews();
  }, [productId]);

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;

    setSubmitting(true);
    setError('');

    try {
      const token = localStorage.getItem('aurae_token');
      const response = await axios.post(
        'http://localhost:5000/api/reviews',
        { productId, rating, comment },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setReviews((prevReviews) => [response.data.review, ...prevReviews]);
      setComment('');
      setRating(5);
      alert("Review authenticated and published successfully.");
    } catch (err) {
      console.error("Review submission fault:", err);
      setError(err.response?.data?.message || 'Verification failed. Could not authenticate review.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mt-24 border-t-2 border-gray-900 pt-16 max-w-4xl mx-auto">
      <h2 className="text-[12px] uppercase tracking-[0.4em] font-black mb-12 text-gray-950 flex items-center gap-3">
        <MessageSquare size={16} className="text-black" /> Reflections & Ledger Accounts
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-16 items-start">
        
        {/* --- LEFT SIDE: FORM --- */}
        <div className="md:col-span-5 bg-white p-6 border-2 border-gray-900 rounded-sm shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <h3 className="text-[11px] uppercase tracking-[0.25em] font-black mb-6 text-gray-9ments-center gap-2 flex items-center">
            <ShieldCheck size={14} className="text-black" /> Document Reflection
          </h3>
          
          <form onSubmit={handleSubmitReview} className="space-y-6">
            <div>
              <label className="text-[10px] uppercase tracking-widest text-gray-900 font-bold block mb-2">Assigned Rating</label>
              <div className="flex gap-1.5">
                {[1, 2, 3, 4, 5].map((starValue) => (
                  <button
                    key={starValue}
                    type="button"
                    className="transition-transform hover:scale-110 outline-none"
                    onClick={() => setRating(starValue)}
                    onMouseEnter={() => setHoveredRating(starValue)}
                    onMouseLeave={() => setHoveredRating(null)}
                  >
                    <Star
                      size={20}
                      className={
                        starValue <= (hoveredRating || rating)
                          ? "fill-black text-black"
                          : "text-gray-300"
                      }
                    />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-[10px] uppercase tracking-widest text-gray-900 font-bold block mb-2">Statement of Verification</label>
              <textarea
                rows="4"
                required
                placeholder="Share details regarding texture, execution, and fitting..."
                className="w-full bg-neutral-50 border-2 border-gray-900 py-3 px-4 text-xs font-medium text-gray-950 outline-none focus:bg-white transition-colors resize-none rounded-sm"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
            </div>

            {error && (
              <p className="text-[10px] text-red-600 bg-red-50 border-2 border-red-600 p-3 rounded-sm font-black uppercase tracking-wider leading-relaxed">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={submitting || !comment.trim()}
              className="w-full bg-black text-white py-4 text-[10px] uppercase tracking-[0.3em] font-black hover:bg-neutral-800 transition-colors disabled:bg-gray-300 flex justify-center items-center gap-2"
            >
              {submitting ? (
                <>
                  <Loader2 className="animate-spin" size={12} /> Verifying Ledger...
                </>
              ) : (
                "Publish Entry"
              )}
            </button>
          </form>
        </div>

        {/* --- RIGHT SIDE: HIGH CONTRAST REVIEWS FEED --- */}
        <div className="md:col-span-7 space-y-8">
          {loading ? (
            <div className="text-[11px] text-gray-900 font-bold uppercase tracking-widest flex items-center gap-2">
              <Loader2 className="animate-spin" size={12} /> Syncing ledger files...
            </div>
          ) : reviews.length === 0 ? (
            <div className="text-center py-16 border-2 border-dashed border-gray-300 rounded-sm bg-white">
              <p className="text-gray-900 font-bold uppercase tracking-[0.3em] text-[11px]">No reflections have been logged for this product.</p>
            </div>
          ) : (
            <div className="space-y-6 max-h-[600px] overflow-y-auto pr-2">
              {reviews.map((review) => (
                <div key={review.id} className="p-5 border-2 border-gray-200 bg-white rounded-sm hover:border-black transition-colors duration-300">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <div className="flex items-center gap-3">
                        {/* CHANGED: Swapped gray text out for high-visibility bold black typography */}
                        <span className="text-[12px] font-black text-gray-950 uppercase tracking-wider">
                          {review.user?.name}
                        </span>
                        <span className="text-[9px] bg-black text-white font-mono font-black px-2 py-0.5 rounded-sm flex items-center gap-1">
                          <ShieldCheck size={10} className="text-white fill-none" /> VERIFIED PURCHASER
                        </span>
                      </div>
                      {/* CHANGED: Made timestamp clear and high-contrast */}
                      <p className="text-[10px] font-mono font-bold text-gray-500 mt-1">
                        LOG ENTRY: {new Date(review.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).toUpperCase()}
                      </p>
                    </div>

                    <div className="flex gap-0.5">
                      {[1, 2, 3, 4, 5].map((starIndex) => (
                        <Star
                          key={starIndex}
                          size={12}
                          className={
                            starIndex <= review.rating
                              ? "fill-black text-black"
                              : "text-gray-200"
                          }
                        />
                      ))}
                    </div>
                  </div>

                  {/* CHANGED: Dark crisp text inside the user feedback comment block */}
                  <p className="text-[12px] text-gray-900 font-medium leading-relaxed bg-neutral-50 p-4 border border-neutral-200 rounded-sm italic">
                    "{review.comment}"
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default ReviewsSection;