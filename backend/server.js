import 'dotenv/config';
import express from 'express';
import cors from 'cors';

// Route Imports
import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js'; // new payment routes
import reviewRoutes from './routes/reviewRoutes.js'; // new review routes

const app = express();

// Middleware
app.use(cors({
  origin: 'http://localhost:5173', 
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization'] 
})); 

// JSON Middleware: Allows the server to parse JSON data from the frontend
app.use(express.json()); 

// URLENCODED Middleware: CRITICAL for SSLCommerz. 
// SSLCommerz sends data back in a "form-style" format (not JSON). 
// This line allows your server to read that specific type of data.
app.use(express.urlencoded({ extended: true })); 

// Mount API Routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/payment", paymentRoutes); //MOUNT the payment routes at /api/payment
app.use("/api/reviews", reviewRoutes); // Mount review routes

// A simple test route
app.get("/", (req, res) => {
    res.send("Aurae backend is running");
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});