import express from "express";
import { createOrder, getUserOrders } from "../controllers/orderController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Route to place a new order (Protected)
// The URL will be POST /api/orders
router.post('/', protect, createOrder);

// Route to get a user's order history (Protected)
// The URL will be GET /api/orders/my-orders
router.get('/my-orders', protect, getUserOrders);

export default router;