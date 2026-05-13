import express from "express";
import { getCategories } from "../controllers/categoryController.js";

const router = express.Router();

/**
 * @route GET /api/categories
 * @desc Fetch all categories for display
 * @access Public
 */
router.get("/", getCategories);

export default router;
