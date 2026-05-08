import prisma from '../config/db.js';

export const createOrder = async (req, res) => {
  try {
    const { items, totalAmount } = req.body;
    const userId = req.user.id || req.user.userId; // Support old and new token formats

    // We use a transaction to ensure both Order and OrderItems are created together
    const newOrder = await prisma.$transaction(async (tx) => {
      // 1. Create the Order header
      const order = await tx.order.create({
        data: {
          userId: userId,
          totalAmount: totalAmount,
          status: 'PENDING',
          // 2. Create all OrderItems at the same time
          orderItems: {
            create: items.map((item) => ({
              productId: item.id,
              quantity: item.quantity,
              price: item.basePrice,
              size: item.size,
              color: item.color,
            })),
          },
        },
        include: {
          orderItems: true, // Return the items back to the frontend for confirmation
        },
      });

      return order;
    });

    res.status(201).json({
      message: "Order placed successfully",
      order: newOrder
    });
  } catch (error) {
    console.error("Order Error:", error);
    res.status(500).json({ message: "Failed to create order", error: error.message });
  }
};