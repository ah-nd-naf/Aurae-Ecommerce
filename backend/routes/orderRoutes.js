import express from "express";
import { createOrder } from "../controllers/orderController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// The URL will be POST /api/orders
router.post('/', protect, createOrder);

export default router;