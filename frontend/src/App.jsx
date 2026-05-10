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
// Component Imports
import Navbar from './components/Navbar';
import CartDrawer from './components/CartDrawer'; // Added this
import './index.css';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  const { user } = useContext(AuthContext);

  return (
    <div className="min-h-screen bg-white pt-20">
      {/* Global Navigation Bar */}
      <Navbar />

      {/* Global Cart Drawer - It's outside Routes so it works on every page */}
      <CartDrawer /> 

      <Routes>
        <Route 
          path="/" 
          element={user ? <Navigate to="/home" replace /> : <Navigate to="/login" replace />} 
        />
        
        <Route path="/signup" element={<Signup />} />
        <Route path="/verify-otp" element={<VerifyOTP />} />
        <Route path="/login" element={<Login />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/home" element={<Home />} />
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
        
        <Route path="/admin" 
          element={
            user && user.role === "ADMIN" ? (
              <AdminDashboard/>
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
        
        <Route path="*" element={<Navigate to="/signup" replace />} />
      </Routes>
    </div>
  );
}

export default App;
