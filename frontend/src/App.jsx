import { Routes, Route, Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from './context/AuthContext';

// Page Imports
import Signup from './pages/Signup';
import VerifyOTP from './pages/VerifyOTP';
import Login from './pages/Login';
import Home from './pages/Home';

// Component Imports
import Navbar from './components/Navbar';
import './index.css';

function App() {
  // Access the global user state to determine if they are authenticated
  const { user } = useContext(AuthContext);

  return (
    /**
     * The wrapper div uses 'pt-20' to account for the height of the fixed Navbar.
     * This ensures your Signup/Login/Home content starts below the menu bar.
     */
    <div className="min-h-screen bg-white pt-20">
      {/* Global Navigation Bar - appears on every page */}
      <Navbar />

      <Routes>
        {/* Root Route Logic: 
          Check if user object exists in Context.
          - Yes: Redirect to Shop (/home)
          - No: Redirect to onboarding (/signup)
        */}
        <Route 
          path="/" 
          element={user ? <Navigate to="/home" replace /> : <Navigate to="/signup" replace />} 
        />
        
        {/* Authentication Flow Routes */}
        <Route path="/signup" element={<Signup />} />
        <Route path="/verify-otp" element={<VerifyOTP />} />
        <Route path="/login" element={<Login />} />

        {/* Main Shop Destination */}
        <Route path="/home" element={<Home />} />

        {/* 404/Catch-all Route: 
          If the user types a random URL, send them back to the start of the funnel.
        */}
        <Route path="*" element={<Navigate to="/signup" replace />} />
      </Routes>
    </div>
  );
}

export default App;