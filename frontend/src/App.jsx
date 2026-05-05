import { Routes, Route, Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from './context/AuthContext';
import Signup from './pages/Signup';
import VerifyOTP from './pages/VerifyOTP';
import Login from './pages/Login';
import Home from './pages/Home';
import './index.css';

function App() {
  const { user } = useContext(AuthContext);

  return (
    <Routes>
      {/* Dynamic Redirection: If logged in, go to Home. If not, go to Signup */}
      <Route 
        path="/" 
        element={user ? <Navigate to="/home" replace /> : <Navigate to="/signup" replace />} 
      />
      
      <Route path="/signup" element={<Signup />} />
      <Route path="/verify-otp" element={<VerifyOTP />} />
      <Route path="/login" element={<Login />} />
      <Route path="/home" element={<Home />} />

      {/* Fallback route */}
      <Route path="*" element={<Navigate to="/signup" replace />} />
    </Routes>
  );
}

export default App;