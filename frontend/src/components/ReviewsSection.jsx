import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Star, MessageSquare, ShieldCheck, Loader2 } from 'lucide-react';

/**
 * ReviewsSection Component
 * Elegantly handles listing public feedback and posting authenticated reflections.
 */
const ReviewsSection = ({ productId }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  
  // Review Form States
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [hoveredRating, setHoveredRating] = useState(null);

  // --- 1. Fetch Existing Reviews for this Product ---
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

  // --- 2. Handle Review Submission ---
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

      // Successfully posted: add the new review to the top of our list
      setReviews((prevReviews) => [response.data.review, ...prevReviews]);
      setComment(''); // Reset text box
      setRating(5);   // Reset stars
      alert("Review authenticated and published successfully.");
    } catch (err) {
      console.error("Review submission fault:", err);
      // Capture 403 (Not Purchased) or 400 (Already Reviewed) errors from backend
      setError(err.response?.data?.message || 'Verification failed. Could not authenticate review.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mt-24 border-t border-gray-200 pt-16 max-w-4xl mx-auto">
      <h2 className="text-[12px] uppercase tracking-[0.4em] font-bold mb-12 text-gray-950 flex items-center gap-3">
        <MessageSquare size={16} /> Reflections & Ledger Accounts
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-16 items-start">
        
        {/* --- LEFT SIDE: THE VERIFIED SUBMISSION FORM (5 Columns) --- */}
        <div className="md:col-span-5 bg-neutral-50 p-6 border border-gray-100 rounded-sm">
          <h3 className="text-[10px] uppercase tracking-[0.25em] font-bold mb-6 text-gray-900 flex items-center gap-2">
            <ShieldCheck size={14} className="text-gray-950" /> Document Reflection
          </h3>
          
          <form onSubmit={handleSubmitReview} className="space-y-6">
            {/* Interactive Star Picker Selection */}
            <div>
              <label className="text-[9px] uppercase tracking-widest text-gray-400 block mb-2">Assigned Investment Rating</label>
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
                      size={18}
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

            {/* Comment Text Box */}
            <div>
              <label className="text-[9px] uppercase tracking-widest text-gray-400 block mb-2">Statement of Verification</label>
              <textarea
                rows="4"
                required
                placeholder="Share details regarding texture, execution, and fitting..."
                className="w-full bg-white border border-gray-200 py-3 px-4 text-[11px] outline-none focus:border-black transition-colors resize-none rounded-sm"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
            </div>

            {/* Error Message Notice Display Block */}
            {error && (
              <p className="text-[9px] text-red-700 bg-red-50 border border-red-100 p-3 rounded-sm font-bold uppercase tracking-wider leading-relaxed">
                AURA-GATE-DENIED: {error}
              </p>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={submitting || !comment.trim()}
              className="w-full bg-black text-white py-3.5 text-[9px] uppercase tracking-[0.3em] font-bold hover:bg-zinc-800 transition-colors disabled:bg-gray-300 flex justify-center items-center gap-2"
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

        {/* --- RIGHT SIDE: THE REVIEWS FEED ELEMENT LIST (7 Columns) --- */}
        <div className="md:col-span-7 space-y-8">
          {loading ? (
            <div className="text-[10px] text-gray-400 uppercase tracking-widest flex items-center gap-2">
              <Loader2 className="animate-spin" size={12} /> Syncing testimonials...
            </div>
          ) : reviews.length === 0 ? (
            <div className="text-center py-12 border border-dashed border-gray-200 rounded-sm bg-white">
              <p className="text-gray-400 uppercase tracking-[0.3em] text-[10px]">No reflections have been logged for this product.</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100 max-h-[500px] overflow-y-auto pr-2 space-y-6">
              {reviews.map((review) => (
                <div key={review.id} className="pt-6 first:pt-0 animate-in fade-in duration-500">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      {/* Customer Name + Verified Purchaser Tag Badge */}
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-bold text-gray-950 uppercase tracking-wider">
                          {review.user?.name}
                        </span>
                        <span className="text-[8px] bg-neutral-900 text-white font-mono font-bold px-1.5 py-0.5 rounded-xs flex items-center gap-1 scale-90">
                          <ShieldCheck size={10} className="text-white fill-none" /> VERIFIED
                        </span>
                      </div>
                      <p className="text-[8px] font-mono text-gray-400 mt-0.5">
                        {new Date(review.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </p>
                    </div>

                    {/* Star Breakdown Output */}
                    <div className="flex gap-0.5">
                      {[1, 2, 3, 4, 5].map((starIndex) => (
                        <Star
                          key={starIndex}
                          size={11}
                          className={
                            starIndex <= review.rating
                              ? "fill-black text-black"
                              : "text-gray-200"
                          }
                        />
                      ))}
                    </div>
                  </div>

                  {/* Comment Text Content */}
                  <p className="text-[11px] text-gray-700 leading-relaxed font-normal bg-neutral-50/50 p-3 rounded-sm border border-neutral-100/50 italic">
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