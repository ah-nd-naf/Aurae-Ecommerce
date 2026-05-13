import prisma from "../config/db.js";

export const getCategories = async (req, res) => {
    try {
        const categories = await prisma.category.findMany({
            orderBy: { name: 'asc' }
        });
        res.json(categories);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch categories"});
    }
};

/**
 * @desc    Create a new category
 * @route   POST /api/categories
 * @access  Private (Admin Only)
 */

export const createCategory = async (req, res) => {
    try {
        const { name } = req.body;
        const category = await prisma.category.create({
            data: { name }
        });
        res.status(201).json(category);
    } catch (error) {
        res.status(500).json({ error: "Failed to create category. It might already exist." });
    }
};