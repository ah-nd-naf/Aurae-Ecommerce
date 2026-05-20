import express from 'express';
import { createReview, getProductReviews } from '../controllers/reviewController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Route to post a new review - Heavily protected by purchase verification logic
router.post('/', protect, createReview);

// Route to fetch reviews for a specific item - Publicly readable for all shop visitors
router.get('/:productId', getProductReviews);

export default router;