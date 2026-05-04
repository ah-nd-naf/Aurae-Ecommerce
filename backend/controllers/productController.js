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

module.exports = { createProduct, getProducts };