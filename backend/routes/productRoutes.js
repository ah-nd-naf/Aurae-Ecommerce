const express = require("express");
const { createProduct, getProducts } = require("../controllers/productController");

const router = express.Router();

// Route to add a new product with variants
router.post("/add", createProduct);

router.get("/all", getProducts);

module.exports = router;