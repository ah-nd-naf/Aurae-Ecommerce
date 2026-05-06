const express = require("express");
const { createProduct, getProducts, getProductById } = require("../controllers/productController");

const router = express.Router();

// Route to add a new product with variants
router.post("/add", createProduct);

// Route to fetch all products
router.get("/all", getProducts);

// Route to fetch specific product by ID
router.get("/:id", getProductById);

module.exports = router;