const prisma = require('../config/db');

// Create the products
const createProduct = async (req, res) => {
    try {
        const { name, description, basePrice, categoryId, variants} = req.body;

        // We use a transaction to ensure either EVERYTHING is saved or NOTHING is
        // This prevents having a product with no variants if something crashes halfway
        const newProduct = await prisma.product.create({
            data:{
                name,
                description,
                basePrice: parseFloat(basePrice),
                categoryId: parseInt(categoryId),
                variants: {
                    create: variants.map(v => ({
                        size: v.size,
                        color: v.color,
                        stock: parseInt(v.stock),
                        price: v.price ? parseFloat(v.price) : null,
                    }))
                }
            }, include: {variants: true} // Return the variants back to us in the response
        });

        res.status(201).json(newProduct);
    } catch (error) {
        console.log("Create Product Error:", error);
        res.status(500).json({ error: "Failed to create product and variants" });
    }
};

// fetching products

const getProducts = async (req, res) => {
    try {
        const products = await prisma.product.findMany({
            include: {
                variants: true, // Automatically includes the variants
                category: true // Automatically includes the category
            }
        });
        res.status(200).json(products);
    } catch (error) {
        console.log("Fetch Products Error", error);
        res.status(500).json({ error: "Failed to fetch products" });
    }
};

// Fetch specific product by ID using Prisma
const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    // Prisma findUnique is much cleaner than raw SQL!
    const product = await prisma.product.findUnique({
      where: {
        id: parseInt(id), // Ensure the ID is a number
      },
      include: {
        variants: true, // Include the different sizes/colors
        category: true  // Include the category name (Shirts, Shoes, etc.)
      },
    });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json(product);
  } catch (error) {
    console.error("Error in getProductById:", error);
    res.status(500).json({ error: "Server error fetching product details" });
  }
};

module.exports = { createProduct, getProducts, getProductById };