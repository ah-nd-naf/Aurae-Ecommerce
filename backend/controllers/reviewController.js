import prisma from '../config/db.js';

/**
 * CREATE VERIFIED REVIEW
 * Checks the database to ensure the logged-in user has bought the item 
 * before allowing them to post a review.
 */
export const createReview = async (req, res) => {
  try {
    const { productId, rating, comment } = req.body;
    const userId = req.user.id || req.user.userId; // Pull user ID from authorization token

    // 1. Validation: Ensure all fields are filled
    if (!productId || !rating || !comment) {
      return res.status(400).json({ message: "Missing required review parameters." });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: "Rating value must range between 1 and 5 stars." });
    }

    // 2. VERIFICATION GATEWAY: Check if the user has purchased this exact item
    // We look up their order ledger and check if any matching order item exists
    const verifiedPurchase = await prisma.order.findFirst({
      where: {
        userId: userId,
        // Optional strictly enforced safety measure: Only let them review if paid
        status: { in: ['PROCESSING', 'SHIPPED', 'DELIVERED'] }, 
        orderItems: {
          some: {
            productId: parseInt(productId)
          }
        }
      }
    });

    // If no matching transaction row is discovered, block the submission immediately
    if (!verifiedPurchase) {
      return res.status(403).json({ 
        message: "Access Denied. Reviews are exclusive to verified purchasers of this item." 
      });
    }

    // 3. SPAM PROTECTION: Verify they haven't reviewed this item already
    const existingReview = await prisma.review.findUnique({
      where: {
        userId_productId: {
          userId: userId,
          productId: parseInt(productId)
        }
      }
    });

    if (existingReview) {
      return res.status(400).json({ message: "You have already documented a reflection for this item." });
    }

    // 4. DATABASE ACTION: Save the clean, verified review
    const newReview = await prisma.review.create({
      data: {
        userId: userId,
        productId: parseInt(productId),
        rating: parseInt(rating),
        comment: comment
      },
      include: {
        user: {
          select: { name: true } // Return author's name to display in the frontend
        }
      }
    });

    res.status(201).json({ 
      message: "Verified review authenticated and published successfully.", 
      review: newReview 
    });

  } catch (error) {
    console.error("❌ Review Controller Error:", error);
    res.status(500).json({ message: "Failed to submit review.", error: error.message });
  }
};

/**
 * GET PRODUCT REVIEWS
 * Public route to fetch all reviews listed under an individual product page.
 */
export const getProductReviews = async (req, res) => {
  try {
    const { productId } = req.params;

    const reviews = await prisma.review.findMany({
      where: { productId: parseInt(productId) },
      include: {
        user: {
          select: { name: true }
        }
      },
      orderBy: { createdAt: 'desc' } // Display newest testimonials first
    });

    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ message: "Failed to collect reviews.", error: error.message });
  }
};