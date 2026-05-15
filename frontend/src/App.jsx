import { Routes, Route, Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from './context/AuthContext';

// Page Imports
import Signup from './pages/Signup';
import VerifyOTP from './pages/VerifyOTP';
import Login from './pages/Login';
import Home from './pages/Home';
import ProductDetail from './pages/ProductDetail';
import Checkout from './pages/Checkout';
import Orders from './pages/Orders';
import AdminDashboard from './pages/AdminDashboard';
import Shop from './pages/Shop'; // Import verified

// Component Imports
import Navbar from './components/Navbar';
import CartDrawer from './components/CartDrawer';
import './index.css';
import ProtectedRoute from './components/ProtectedRoute';

/**
 * App Component
 * Central routing configuration for Aurae.
 */
function App() {
  const { user } = useContext(AuthContext);

  return (
    <div className="min-h-screen bg-white pt-20">
      {/* Global Components */}
      <Navbar />
      <CartDrawer /> 

      <Routes>
        {/* Root Redirect Logic */}
        <Route 
          path="/" 
          element={user ? <Navigate to="/home" replace /> : <Navigate to="/login" replace />} 
        />
        
        {/* Public Authentication Routes */}
        <Route path="/signup" element={<Signup />} />
        <Route path="/verify-otp" element={<VerifyOTP />} />
        <Route path="/login" element={<Login />} />
        
        {/* Browsing Routes (Accessible to everyone) */}
        <Route path="/home" element={<Home />} />
        <Route path="/shop" element={<Shop />} /> {/* ADDED: Connection point for the Navbar button */}
        <Route path="/product/:id" element={<ProductDetail />} />
        
        {/* Customer Protected Routes */}
        <Route path="/checkout"
         element={
          <ProtectedRoute>
            <Checkout />
          </ProtectedRoute>
         }
        />
        <Route path="/orders"
         element={
          <ProtectedRoute>
            <Orders />
          </ProtectedRoute>
         }
        />
        
        {/* Administrative Routes */}
        <Route path="/admin" 
          element={
            user && user.role === "ADMIN" ? (
              <AdminDashboard/>
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
        
        {/* Fallback Catch-all */}
        <Route path="*" element={<Navigate to="/signup" replace />} />
      </Routes>
    </div>
  );
}

export default App;