import SSLCommerzPayment from 'sslcommerz-lts';
import { v4 as uuidv4 } from 'uuid'; // import v4 func & rename it to uuidv4

const store_id = process.env.STORE_ID;
const store_passwd = process.env.STORE_PASSWORD;
const is_live = false; // false = sandbox/test mode, true = live mode

/**
 * INIT PAYMENT
 * This function handles the request from your React Frontend to start a transaction.
 */
export const initPayment = async (req, res) => {
    try {
        // Create a unique Transaction ID for this specific order (e.g., AUR-A1B2C3D4)
        const transactionId = `AUR-${uuidv4().substring(0, 8).toUpperCase()}`;
        
        // customer information sent from the React Frontend (destructuring)
        const { totalAmount, customerName, customerEmail, customerPhone, address } = req.body;

        // SSLCommerz requires these specific field names.
        const data = {
            total_amount: totalAmount, 
            currency: 'BDT',           
            tran_id: transactionId,   
            
            // if the bKash/Nagad payment is successful
            success_url: `${process.env.BACKEND_URL}/api/payment/success/${transactionId}`,
            // if the payment fails
            fail_url: `${process.env.BACKEND_URL}/api/payment/fail/${transactionId}`,
            // if the user clicks 'Cancel'
            cancel_url: `${process.env.BACKEND_URL}/api/payment/cancel/${transactionId}`,
            // IPN (Instant Payment Notification) is a background 'ping' from SSLCommerz to your server
            ipn_url: `${process.env.BACKEND_URL}/api/payment/ipn`,
            
            // General information about the shipment and product type
            shipping_method: 'Courier',
            product_name: 'Aurae Order',
            product_category: 'Apparel',
            product_profile: 'general',

            // --- Customer Details (Mandatory) ---
            cus_name: customerName,
            cus_email: customerEmail,
            cus_add1: address,
            cus_city: 'Dhaka',
            cus_postcode: '1000', // Mandatory field for SSLCommerz
            cus_country: 'Bangladesh',
            cus_phone: customerPhone,

            // --- Shipping Details (Mandatory) ---
            ship_name: customerName,
            ship_add1: address,
            ship_city: 'Dhaka',
            ship_postcode: '1000', // Mandatory field
            ship_country: 'Bangladesh',
        };

        // Initialize the SSLCommerz tool with your Store credentials and environment setting
        const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live);
        
        // Wait for SSLCommerz to process our data and generate a session
        const apiResponse = await sslcz.init(data);

        // If SSLCommerz gives us a Gateway URL, it means the request was accepted
        if (apiResponse?.GatewayPageURL) {
            console.log("✅ Payment URL Generated Successfully");
            // Send the URL back to React so the browser can redirect the user
            return res.status(200).json({ url: apiResponse.GatewayPageURL });
        } else {
            // If GatewayPageURL is missing, log the error response for debugging
            console.log("❌ SSLCommerz Error Response:", apiResponse);
            return res.status(400).json({ 
                message: "SSLCommerz failed to generate URL", 
                details: apiResponse 
            });
        }

    } catch (error) {
        // If the code crashes (e.g., network error), log the full error stack
        console.error("❌ Internal Server Error during Payment Init:", error);
        // Send a 500 error back to React
        res.status(500).json({ error: error.message });
    }
};

/**
 * PAYMENT SUCCESS
 * SSLCommerz calls this route automatically after the user pays.
 */
export const paymentSuccess = async (req, res) => {
    // Log the transaction ID to the server console
    console.log("✅ Payment Success for Transaction:", req.params.tranId);
    
    // In the future, you will add code here to find the order in your Database 
    // and change its status from 'PENDING' to 'PAID'.

    // Redirect the user's browser back to your React Frontend's orders page
    res.redirect(`${process.env.FRONTEND_URL}/orders?status=success`);
};

/**
 * PAYMENT FAIL
 * SSLCommerz calls this if the user's card is declined or bKash fails.
 */
export const paymentFail = async (req, res) => {
    // Redirect the user back to the checkout page so they can try again
    res.redirect(`${process.env.FRONTEND_URL}/checkout?status=fail`);
};