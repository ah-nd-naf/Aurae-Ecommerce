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

// --- Logic: Fetch all orders for the logged-in user ---

export const getUserOrders = async (req, res) => {
  try {
    // Get the ID from the protect middleware
    const userId = req.user.id || req.user.userId;

    // Fetch the orders
    const orders = await prisma.order.findMany({
      where: {
        userId: userId,
      },
      include: {
        orderItems: {
          include: {
            product: true, // Return product details including image
          }
        }
      },
      orderBy: {
        createdAt: 'desc' // Newest orders first
      },
    });

    res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching user orders:", error);
    res.status(500).json({ message: "Failed to fetch orders", error: error.message });
  }
};

// This fetches EVERYTHING for the admin dashboard

export const getAllOrders = async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      include: {
        user: {
          select: { name: true, email: true } // Let's see who placed the order
        },
        orderItems: {
          include: { product: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch all orders" });
  }
};