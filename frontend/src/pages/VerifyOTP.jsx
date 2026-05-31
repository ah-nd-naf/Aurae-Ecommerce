import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../api/axios';

const VerifyOTP = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Get email from navigation state
  const email = location.state?.email;

  useEffect(() => {
    // If they landed here without going through signup, redirect to signup
    if (!email) {
      navigate('/signup');
    }
  }, [email, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (otp.length !== 6) {
      setError("OTP must be exactly 6 digits.");
      return;
    }
    
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      await api.post('/auth/verify-otp', {
        email,
        otp
      });
      setSuccess("Account verified successfully! Redirecting to login...");
      setTimeout(() => {
        navigate('/login');
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.error || "Invalid or expired OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-white">
      {/* Left Column - Image & Overlay */}
      <div className="hidden lg:flex w-1/2 relative bg-neutral-100 overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1529139574466-a303027c1d8b?q=80&w=800&auto=format&fit=crop"
          alt="Fashion Model"
          className="absolute inset-0 w-full h-full object-cover animate-scale-in"
        />
        <div className="absolute inset-0 bg-black/40" />
        
        <div className="relative z-10 flex flex-col justify-end p-12 text-white h-full w-full">
          <h2 className="text-4xl font-serif tracking-widest mb-4">AURAE</h2>
          <p className="text-lg font-light max-w-md italic">
            Quality over quantity. A journey into timeless aesthetics.
          </p>
        </div>
      </div>

      {/* Right Column - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 lg:p-24">
        <div className="w-full max-w-md animate-fade-in-up">
          <h2 className="text-2xl font-serif tracking-widest text-center mb-10 lg:hidden">AURAE</h2>

          <h1 className="text-4xl font-serif text-gray-900 mb-2">Verify Your Email</h1>
          <p className="text-gray-600 mb-10">We sent a 6-digit code to <span className="font-semibold text-gray-900">{email}</span></p>

          {error && (
            <div className="mb-6 p-3 bg-red-50 text-red-700 rounded-md text-sm">
              {error}
            </div>
          )}
          
          {success && (
            <div className="mb-6 p-3 bg-green-50 text-green-700 rounded-md text-sm">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-[11px] font-bold tracking-widest text-gray-800 uppercase mb-2">Verification Code</label>
              <input
                type="text"
                name="otp"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, '').slice(0, 6))}
                placeholder="123456"
                required
                className="w-full px-4 py-4 text-center text-3xl tracking-[0.5em] bg-white text-gray-900 placeholder:text-gray-400 border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400 transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={loading || otp.length !== 6 || !!success}
              className="w-full py-4 px-4 bg-[#4A5D4E] hover:bg-[#3d4d40] text-white font-bold text-xs tracking-widest uppercase rounded-sm transition-colors mt-8 disabled:opacity-70 flex justify-center items-center"
            >
              {loading ? "Verifying..." : "Verify Code"}
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-gray-100 text-center">
            <p className="text-sm text-gray-600">
              Didn't receive the code? <button className="text-gray-900 font-semibold hover:underline">Resend</button>
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

export default VerifyOTP;
