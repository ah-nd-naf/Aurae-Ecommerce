import express from "express";
import { protect, admin } from "../middleware/authMiddleware.js";
import { getCategories, createCategory } from "../controllers/categoryController.js";

const router = express.Router();

/**
 * @route GET /api/categories
 * @desc Fetch all categories for display
 * @access Public
 */
router.get("/", getCategories);
router.post("/", protect, admin, createCategory);

export default router;
