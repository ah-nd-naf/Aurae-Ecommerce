import prisma from '../config/db.js';

/**
 * @desc    Create a new product with multiple variants
 * @route   POST /api/products
 * @access  Admin
 */
const createProduct = async (req, res) => {
    try {
        const { name, description, basePrice, categoryId, variants } = req.body;

        // We use a transaction logic here: product and variants are created together
        const newProduct = await prisma.product.create({
            data: {
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
            }, 
            include: { variants: true } // Returns the nested variants in the response
        });

        res.status(201).json(newProduct);
    } catch (error) {
        console.error("Create Product Error:", error);
        res.status(500).json({ error: "Failed to create product and variants" });
    }
};

/**
 * @desc    Get all products with their variants and categories
 * @route   GET /api/products
 * @access  Public
 */
const getProducts = async (req, res) => {
    try {
        const products = await prisma.product.findMany({
            include: {
                variants: true, 
                category: true 
            },
            orderBy: { createdAt: 'desc' } // Shows newest products first
        });
        res.status(200).json(products);
    } catch (error) {
        console.error("Fetch Products Error:", error);
        res.status(500).json({ error: "Failed to fetch products" });
    }
};

/**
 * @desc    Get a single product by ID
 * @route   GET /api/products/:id
 * @access  Public
 */
const getProductById = async (req, res) => {
    try {
        const { id } = req.params;

        const product = await prisma.product.findUnique({
            where: { id: parseInt(id) },
            include: {
                variants: true,
                category: true 
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

/**
 * @desc    Delete a product and all its associated variants
 * @route   DELETE /api/products/:id
 * @access  Admin
 */
const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;

        // Note: If your Prisma schema has 'onDelete: Cascade', 
        // deleting the product will automatically delete variants.
        await prisma.product.delete({
            where: { id: parseInt(id) }
        });

        res.status(200).json({ message: "Product and associated variants deleted successfully" });
    } catch (error) {
        console.error("Delete Product Error:", error);
        // Handle case where product doesn't exist
        if (error.code === 'P2025') {
            return res.status(404).json({ error: "Product not found" });
        }
        res.status(500).json({ error: "Failed to delete product" });
    }
};

/**
 * @desc    Update basic product info (Name, Price, etc.)
 * @route   PUT /api/products/:id
 * @access  Admin
 */
const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, basePrice, categoryId, stock } = req.body;

        const updatedProduct = await prisma.product.update({
            where: { id: parseInt(id) },
            data: {
                name,
                description,
                basePrice: basePrice ? parseFloat(basePrice) : undefined,
                categoryId: categoryId ? parseInt(categoryId) : undefined,
                // We keep variants update separate or handled via a specific variant controller
            }
        });

        res.status(200).json(updatedProduct);
    } catch (error) {
        console.error("Update Product Error:", error);
        res.status(500).json({ error: "Failed to update product" });
    }
};

export { 
    createProduct, 
    getProducts, 
    getProductById, 
    deleteProduct, 
    updateProduct 
};