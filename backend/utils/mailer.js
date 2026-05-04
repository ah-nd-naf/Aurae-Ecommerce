const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendOTP = async (email, otp) => {
  const mailOptions = {
    from: `"Aurae Support" <${process.env.EMAIL_USER}>`, 
    to: email,
    subject: 'Verify Your Aurae Account',
    // Branded HTML Template
    html: `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
        <div style="background-color: #000; padding: 20px; text-align: center;">
          <h1 style="color: #ffffff; margin: 0; letter-spacing: 2px;">AURAE</h1>
        </div>
        <div style="padding: 40px; text-align: center; background-color: #ffffff;">
          <h2 style="color: #333;">Verify Your Email</h2>
          <p style="color: #666; font-size: 16px;">Thank you for joining Aurae. Use the 6-digit code below to complete your registration. This code is valid for 10 minutes.</p>
          <div style="margin: 30px 0;">
            <span style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #000; border: 2px dashed #000; padding: 10px 20px; border-radius: 4px;">
              ${otp}
            </span>
          </div>
          <p style="color: #999; font-size: 12px;">If you didn't request this, please ignore this email.</p>
        </div>
        <div style="background-color: #f9f9f9; padding: 20px; text-align: center; border-top: 1px solid #e0e0e0;">
          <p style="color: #999; font-size: 12px; margin: 0;">&copy; 2026 Aurae E-Commerce. All rights reserved.</p>
        </div>
      </div>
    `,
  };

  return transporter.sendMail(mailOptions);
};

module.exports = { sendOTP };