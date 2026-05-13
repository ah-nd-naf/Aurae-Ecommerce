import express from "express";
import { 
    createProduct, 
    getProducts, 
    getProductById, 
    updateProduct, 
    deleteProduct 
} from "../controllers/productController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * @route   GET /api/products/all
 * @desc    Fetch all products with variants and categories
 * @access  Public
 */
router.get("/all", getProducts);

/**
 * @route   GET /api/products/:id
 * @desc    Fetch a single product by its ID
 * @access  Public
 */
router.get("/:id", getProductById);

/**
 * @route   POST /api/products/add
 * @desc    Create a new product and its variants
 * @access  Private (Admin Only)
 */
router.post("/add", protect, admin, createProduct);

/**
 * @route   PUT /api/products/:id
 * @desc    Update product details (e.g., price, description)
 * @access  Private (Admin Only)
 */
router.put("/:id", protect, admin, updateProduct);

/**
 * @route   DELETE /api/products/:id
 * @desc    Remove a product and its associated variants
 * @access  Private (Admin Only)
 */
router.delete("/:id", protect, admin, deleteProduct);

export default router;