import express from "express";
import { protect, admin } from "../middleware/authMiddleware.js";
import { createOrder, getUserOrders, getAllOrders, updateOrderStatus } from "../controllers/orderController.js";

const router = express.Router();

// Route to place a new order (Protected)
// The URL will be POST /api/orders
router.post('/', protect, createOrder);

// Route to get a user's order history (Protected)
// The URL will be GET /api/orders/my-orders
router.get('/my-orders', protect, getUserOrders);

// Get ALL orders (Admin Only)
// URL: GET /api/orders
router.get('/all', protect, admin, getAllOrders);

// Update order status (Admin Only)

router.put('/:id/status', protect, admin, updateOrderStatus);

export default router;
