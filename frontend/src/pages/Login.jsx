import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import { AuthContext } from '../context/AuthContext'; // Import your context

const Login = () => {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext); // Access the global login function
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await api.post('/auth/login', {
        email: formData.email,
        password: formData.password
      });
      
      // UPDATED: Save user data and token as separate arguments
      // This matches the new (userData, token) => { ... } signature in AuthContext
      login(response.data.user, response.data.token);
      
      // Redirect to the shop home page
      navigate('/home'); 
    } catch (err) {
      setError(err.response?.data?.error || "Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-white">
      {/* Left Column - Image & Overlay */}
      <div className="hidden lg:flex w-1/2 relative bg-neutral-100">
        <img
          src="https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&q=80&w=1200"
          alt="Aurae Editorial Login"
          className="absolute inset-0 w-full h-full object-cover object-full"
          loading='lazy'
        />
        <div className="absolute inset-0 bg-black/40" />
        
        <div className="relative z-10 flex flex-col justify-end p-12 text-white h-full w-full">
          <h2 className="text-4xl font-serif tracking-widest mb-4 uppercase">AURAE</h2>
          <p className="text-lg font-light max-w-md italic">
            Quality over quantity. A journey into timeless aesthetics.
          </p>
        </div>
      </div>

      {/* Right Column - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 lg:p-24">
        <div className="w-full max-w-md">
          {/* Mobile Header (Hidden on Desktop) */}
          <h2 className="text-2xl font-serif tracking-widest text-center mb-10 lg:hidden uppercase">AURAE</h2>

          <h1 className="text-4xl font-serif text-gray-900 mb-2">Welcome Back</h1>
          <p className="text-gray-600 mb-10">Enter your credentials to access your account.</p>

          {error && (
            <div className="mb-6 p-3 bg-red-50 text-red-700 rounded-md text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
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
              <div className="flex justify-between items-center mb-2">
                <label className="block text-[11px] font-bold tracking-widest text-gray-800 uppercase">Password</label>
                <a href="#" className="text-xs text-gray-600 hover:text-gray-900 hover:underline">Forgot password?</a>
              </div>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
                className="w-full px-4 py-3 text-sm bg-white text-gray-900 placeholder:text-gray-400 border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400 transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 px-4 bg-[#4A5D4E] hover:bg-[#3d4d40] text-white font-bold text-xs tracking-widest uppercase rounded-sm transition-colors mt-8 disabled:opacity-70 flex justify-center items-center"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-gray-100 text-center relative">
            <span className="absolute bg-white px-4 text-[10px] text-gray-600 uppercase tracking-widest -top-2.5 left-1/2 -translate-x-1/2">
              OR
            </span>
            <p className="text-sm text-gray-600 mt-4">
              Don't have an account? <Link to="/signup" className="text-gray-900 font-semibold hover:underline">Sign Up</Link>
            </p>
          </div>

          <div className="mt-16 text-center lg:text-left text-[10px] text-gray-500 uppercase tracking-widest">
            &copy; 2026 AURAE. QUALITY OVER QUANTITY.
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;