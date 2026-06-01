import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    agreed: false
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.agreed) {
      setError("Please agree to the Terms of Service and Privacy Policy.");
      return;
    }
    setError('');
    setLoading(true);

    try {
      // Backend expects email and password. We send name but backend might ignore it for now.
      await api.post('/auth/signup', {
        name: formData.name,
        email: formData.email,
        password: formData.password
      });
      navigate('/verify-otp', { state: { email: formData.email } });
    } catch (err) {
      setError(err.response?.data?.error || "Failed to create account. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-white">
      {/* Left Column - Image & Overlay */}
      <div className="hidden lg:flex w-1/2 relative bg-neutral-100 overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&q=80&w=1200"
          alt="Aurae Editorial Signup"
          className="absolute inset-0 w-full h-full object-cover animate-scale-in"
          loading='lazy'
        />
        <div className="absolute inset-0 bg-black/40" /> {/* Subtle overlay */}
        
        <div className="relative z-10 flex flex-col justify-end p-12 text-white h-full w-full">
          <h2 className="text-4xl font-serif tracking-widest mb-4">AURAE</h2>
          <p className="text-lg font-light max-w-md italic">
            Quality over quantity. A journey into timeless aesthetics.
          </p>
        </div>
      </div>

      {/* Right Column - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 lg:p-24">
        <div className="w-full max-w-md animate-slide-in-right">
          {/* Mobile Header (Hidden on Desktop) */}
          <h2 className="text-2xl font-serif tracking-widest text-center mb-10 lg:hidden">Aurae</h2>

          <h1 className="text-4xl font-serif text-gray-900 mb-2">Create an Account</h1>
          <p className="text-gray-600 mb-10">Enter your details to join our community.</p>

          {error && (
            <div className="mb-6 p-3 bg-red-50 text-red-700 rounded-md text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-[11px] font-bold tracking-widest text-gray-800 uppercase mb-2">Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Jean-Luc Godard"
                required
                className="w-full px-4 py-3 text-sm bg-white text-gray-900 placeholder:text-gray-400 border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400 transition-colors"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold tracking-widest text-gray-800 uppercase mb-2">Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="hello@lessence.com"
                required
                className="w-full px-4 py-3 text-sm bg-white text-gray-900 placeholder:text-gray-400 border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400 transition-colors"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold tracking-widest text-gray-800 uppercase mb-2">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
                minLength={6}
                className="w-full px-4 py-3 text-sm bg-white text-gray-900 placeholder:text-gray-400 border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400 transition-colors"
              />
            </div>

            <div className="flex items-start mt-6">
              <div className="flex items-center h-5">
                <input
                  id="agreed"
                  name="agreed"
                  type="checkbox"
                  checked={formData.agreed}
                  onChange={handleChange}
                  className="w-4 h-4 border border-gray-300 rounded-sm bg-white checked:bg-[#4A5D4E] checked:border-[#4A5D4E] focus:ring-0 focus:ring-offset-0 cursor-pointer accent-[#4A5D4E]"
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="agreed" className="text-gray-600 cursor-pointer select-none">
                  I agree to the <a href="#" className="underline text-gray-800 hover:text-black">Terms of Service</a> and <a href="#" className="underline text-gray-800 hover:text-black">Privacy Policy</a>.
                </label>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 px-4 bg-[#4A5D4E] hover:bg-[#3d4d40] text-white font-bold text-xs tracking-widest uppercase rounded-sm transition-colors mt-8 disabled:opacity-70 flex justify-center items-center"
            >
              {loading ? "Creating..." : "Create Account"}
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-gray-100 text-center relative">
            <span className="absolute bg-white px-4 text-[10px] text-gray-600 uppercase tracking-widest -top-2.5 left-1/2 -translate-x-1/2">
              OR
            </span>
            <p className="text-sm text-gray-600 mt-4">
              Already have an account? <Link to="/login" className="text-gray-900 font-semibold hover:underline">Sign In</Link>
            </p>
          </div>

          <div className="mt-16 text-center lg:text-left text-[10px] text-gray-600 uppercase tracking-widest">
            &copy; 2026 AURAE. QUALITY OVER QUANTITY.
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
