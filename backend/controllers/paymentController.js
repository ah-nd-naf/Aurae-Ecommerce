import SSLCommerzPayment from 'sslcommerz-lts'; // to talk to the payment gateway
import prisma from '../config/db.js';

// Pull credentials from your .env file
const store_id = process.env.STORE_ID;
const store_passwd = process.env.STORE_PASSWORD;
const is_live = false; // Set to false because we are using the Sandbox (test mode)

/**
 * INIT PAYMENT
 * This function creates the order in your database as 'PENDING' 
 * and then generates the bKash/Nagad payment link.
 */
export const initPayment = async (req, res) => {
    try {
        // 1. Extract order details sent from the React Frontend
        const { items, totalAmount, customerName, customerEmail, customerPhone, address } = req.body;
        
        // Safety check: if items list is missing or empty, stop immediately
        if (!items || items.length === 0) {
            return res.status(400).json({ message: "Cart is empty" });
        }
        
        // 2. Identify the logged-in user from the request (attached by your auth middleware)
        const userId = req.user.id || req.user.userId;

        // 3. DATABASE ACTION: Create the Order and OrderItems in your PostgreSQL database
        // We use a Prisma transaction to ensure the header and the items are saved together.
        const newOrder = await prisma.$transaction(async (tx) => {
            const order = await tx.order.create({
                data: {
                    userId: userId,
                    totalAmount: totalAmount,
                    status: 'PENDING', // The order starts as 'PENDING' until payment is confirmed
                    orderItems: {
                        // Map through the items array to create rows in the orderItems table
                        create: items.map((item) => ({
                            productId: item.id,
                            quantity: item.quantity,
                            price: item.basePrice,
                            size: item.size,
                            color: item.color,
                        })),
                    },
                },
            });
            return order;
        });

        // 4. Create a unique Transaction ID based on the actual Database ID
        // This links the bKash payment directly to Order #X in your database.
        const transactionId = `AUR-${newOrder.id}`;

        // 5. Prepare the data object for SSLCommerz
        const data = {
            total_amount: totalAmount,
            currency: 'BDT',
            tran_id: transactionId, // The ID we just generated
            
            // Redirect URLs: Where the user goes after the payment screen
            success_url: `${process.env.BACKEND_URL}/api/payment/success/${transactionId}`,
            fail_url: `${process.env.BACKEND_URL}/api/payment/fail/${transactionId}`,
            cancel_url: `${process.env.BACKEND_URL}/api/payment/cancel/${transactionId}`,
            ipn_url: `${process.env.BACKEND_URL}/api/payment/ipn`, // Background verification ping
            
            // General Product Info
            shipping_method: 'Courier',
            product_name: 'Aurae Collection',
            product_category: 'Clothing',
            product_profile: 'general',

            // Customer Details (Mandatory for SSLCommerz)
            cus_name: customerName,
            cus_email: customerEmail,
            cus_add1: address,
            cus_city: 'Dhaka',
            cus_postcode: '1000', // We use a dummy postcode to satisfy the API
            cus_country: 'Bangladesh',
            cus_phone: customerPhone,

            // Shipping Details (Mandatory for SSLCommerz)
            ship_name: customerName,
            ship_add1: address,
            ship_city: 'Dhaka',
            ship_postcode: '1000', // Fixed: SSLCommerz rejects the request if this is missing
            ship_country: 'Bangladesh',
        };

        // 6. Initialize the SSLCommerz Instance with your Store ID and Password
        const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live);
        
        // 7. Request the Payment URL from SSLCommerz
        const apiResponse = await sslcz.init(data);

        // 8. If successful, send the bKash/Nagad link back to your React app
        if (apiResponse?.GatewayPageURL) {
            console.log(`✅ Order #${newOrder.id} saved. Payment URL generated.`);
            return res.status(200).json({ url: apiResponse.GatewayPageURL });
        } else {
            // If SSLCommerz fails, log the response so you can see why in the terminal
            console.log("❌ SSLCommerz Error:", apiResponse);
            return res.status(400).json({ message: "SSLCommerz failed", details: apiResponse });
        }

    } catch (error) {
        // If the code crashes (e.g., database error), log it and send an error to the frontend
        console.error("❌ Payment Init Error:", error);
        res.status(500).json({ error: error.message });
    }
};

/**
 * PAYMENT SUCCESS
 * This is called by SSLCommerz after the user pays successfully.
 * It updates the database status from 'PENDING' to 'PROCESSING' and deducts stock.
 */
export const paymentSuccess = async (req, res) => {
    try {
        // 1. Get the transaction ID from the URL (e.g., AUR-25)
        const { tranId } = req.params;
        
        // 2. Extract the numeric Order ID (Remove 'AUR-' and convert to a number)
        const orderId = parseInt(tranId.replace('AUR-', ''));

        // 3. SECURE TRANSACTION: Change order status and deduct physical item stock amounts.
        // We pack this inside a transaction so if a step fails, the whole database safely reverts.
        await prisma.$transaction(async (tx) => {
            
            // Step A: Fetch the target order along with its collection of specific order items
            const order = await tx.order.findUnique({
                where: { id: orderId },
                include: { orderItems: true }
            });

            // If the order has already been processed or doesn't exist, exit immediately
            if (!order || order.status !== 'PENDING') {
                throw new Error("Order not found or has already been completed.");
            }

            // Step B: Update the primary Order status tracker to 'PROCESSING'
            await tx.order.update({
                where: { id: orderId },
                data: { status: 'PROCESSING' }
            });

            // Step C: Loop through every distinct apparel piece inside the order manifest
            for (const item of order.orderItems) {
                
                // Track down the corresponding size/color record row inside the productVariant table
                const variant = await tx.productVariant.findFirst({
                    where: {
                        productId: item.productId,
                        size: item.size,
                        color: item.color
                    }
                });

                // If a matching item variant row exists, deduct the units bought
                if (variant) {
                    await tx.productVariant.update({
                        where: { id: variant.id },
                        data: {
                            stock: {
                                decrement: item.quantity // Automatically drops stock levels safely
                            }
                        }
                    });
                    console.log(`📉 Stock reduced for Product ID ${item.productId} (${item.size}/${item.color}) by ${item.quantity} units.`);
                }
            }
        });

        console.log(`✅ Transaction Fully Confirmed & Stock Adjusted: Order #${orderId} is now paid.`);

        // 4. Redirect the user's browser back to the Aurae Orders page
        // We add '?status=success' so the frontend can show a "Thank You" banner
        res.redirect(`${process.env.FRONTEND_URL}/orders?status=success`);
        
    } catch (error) {
        console.error("❌ Success Callback Error:", error);
        // If something fails here, send the user back to checkout to see the error
        res.redirect(`${process.env.FRONTEND_URL}/checkout?status=error`);
    }
};

/**
 * PAYMENT FAIL
 * This is called if the user's payment is declined.
 */
export const paymentFail = async (req, res) => {
    console.log("❌ Payment Failed for Transaction:", req.params.tranId);
    // Send user back to checkout so they can try a different payment method
    res.redirect(`${process.env.FRONTEND_URL}/checkout?status=fail`);
};