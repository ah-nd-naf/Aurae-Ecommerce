import express from "express";
import { createProduct, getProducts, getProductById } from "../controllers/productController.js";

const router = express.Router();

// Route to add a new product with variants
router.post("/add", createProduct);

// Route to fetch all products
router.get("/all", getProducts);

// Route to fetch specific product by ID
router.get("/:id", getProductById);

export default router;