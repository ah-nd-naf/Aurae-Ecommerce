import 'dotenv/config';
import express from 'express';
import cors from 'cors';

// Route Imports - Note the .js extensions (required in modern Node)
import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import orderRoutes from './routes/orderRoutes.js';

const app = express();

// Middleware
app.use(cors({
  origin: 'http://localhost:5173', // Allow requests from the frontend
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization'] // Explicitly allow the token header
})); 
app.use(express.json()); // Allows us to read JSON data sent to the server

// Mount API Routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes); // Fixed: Added missing starting slash

// A simple test route to see if the server is alive
app.get("/", (req, res) => {
    res.send("Aurae backend is running");
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});