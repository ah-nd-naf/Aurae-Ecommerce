import express from 'express';
import * as paymentController from '../controllers/paymentController.js'; // * to grab every single function
import { protect } from '../middleware/authMiddleware.js';
const router = express.Router();

// Route to start payment
router.post('/init', protect, paymentController.initPayment);

// Callbacks from SSLCommerz (Must be POST)
router.post('/success/:tranId', paymentController.paymentSuccess);
router.post('/fail/:tranId', paymentController.paymentFail);

export default router;