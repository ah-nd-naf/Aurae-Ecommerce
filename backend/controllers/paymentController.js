import SSLCommerzPayment from 'sslcommerz-lts'; // Use 'import' instead of 'require'
import { v4 as uuidv4 } from 'uuid';

const store_id = process.env.STORE_ID;
const store_passwd = process.env.STORE_PASSWORD;
const is_live = false; 

/**
 * Initiates the payment process.
 */
export const initPayment = async (req, res) => {
    const transactionId = `AUR-${uuidv4().substring(0, 8).toUpperCase()}`;
    const { totalAmount, customerName, customerEmail, customerPhone, address } = req.body;

    const data = {
        total_amount: totalAmount,
        currency: 'BDT',
        tran_id: transactionId,
        success_url: `${process.env.BACKEND_URL}/api/payment/success/${transactionId}`,
        fail_url: `${process.env.BACKEND_URL}/api/payment/fail/${transactionId}`,
        cancel_url: `${process.env.BACKEND_URL}/api/payment/cancel/${transactionId}`,
        ipn_url: `${process.env.BACKEND_URL}/api/payment/ipn`,
        shipping_method: 'Courier',
        product_name: 'Aurae Order',
        product_category: 'Apparel',
        product_profile: 'general',
        cus_name: customerName,
        cus_email: customerEmail,
        cus_add1: address,
        cus_city: 'Dhaka',
        cus_country: 'Bangladesh',
        cus_phone: customerPhone,
        ship_name: customerName,
        ship_add1: address,
        ship_city: 'Dhaka',
        ship_country: 'Bangladesh',
    };

    const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live);
    
    sslcz.init(data).then(apiResponse => {
        let GatewayPageURL = apiResponse.GatewayPageURL;
        res.send({ url: GatewayPageURL });
    });
};

/**
 * Handle Success callback.
 */
export const paymentSuccess = async (req, res) => {
    console.log("Success for:", req.params.tranId);
    // Logic to update order status goes here
    res.redirect(`${process.env.FRONTEND_URL}/orders?status=success`);
};

/**
 * Handle Failure callback.
 */
export const paymentFail = async (req, res) => {
    res.redirect(`${process.env.FRONTEND_URL}/checkout?status=fail`);
};