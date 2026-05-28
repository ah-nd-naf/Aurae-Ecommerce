import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../config/db.js';
import { sendOTP } from '../utils/mailer.js';

const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

const signup = async (req, res) => {
  try {
    const { email, password, name } = req.body;
    
    if (!email || !password || !name) {
      return res.status(400).json({ error: "Name, email, and password are required" });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    const otp = generateOTP();
    const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);
    const hashedPassword = await bcrypt.hash(password, 10);

    if (existingUser) {
      if (existingUser.isVerified) {
        return res.status(400).json({ error: "Email is already registered and verified." });
      }
      // Update unverified user
      await prisma.user.update({
        where: { email },
        data: {
          password: hashedPassword,
          name, // Store plain text name
          otp,
          otpExpiresAt,
        }
      });
      try {
        await sendOTP(email, otp);
      } catch (mailError) {
        console.warn("SMTP failed, auto-verifying user on update:", mailError.message);
        await prisma.user.update({
          where: { email },
          data: { isVerified: true, otp: null, otpExpiresAt: null }
        });
        return res.status(200).json({ message: "Signup successful. Account automatically verified." });
      }
      return res.status(200).json({ message: "OTP sent to email. Please verify your account." });
    }

    // CREATE NEW USER - Fixed: added name here
    await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name, // Store plain text name
        otp,
        otpExpiresAt,
      }
    });

    try {
      await sendOTP(email, otp);
    } catch (mailError) {
      console.warn("SMTP failed, auto-verifying new user:", mailError.message);
      await prisma.user.update({
        where: { email },
        data: { isVerified: true, otp: null, otpExpiresAt: null }
      });
      return res.status(201).json({ message: "Signup successful. Account automatically verified." });
    }
    res.status(201).json({ message: "Signup successful. OTP sent to email." });

  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ 
      error: "Internal server error during signup", 
      details: error.message 
    });
  }
};

// verifyOTP remains the same as your version...
const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      return res.status(400).json({ error: "Email and OTP are required" });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(404).json({ error: "User not found" });
    if (user.isVerified) return res.status(200).json({ message: "Email verified. You can now log in." });

    if (user.otp !== otp || !user.otpExpiresAt || user.otpExpiresAt < new Date()) {
      return res.status(400).json({ error: "Invalid or expired OTP" });
    }

    await prisma.user.update({
      where: { email },
      data: { isVerified: true, otp: null, otpExpiresAt: null }
    });

    res.status(200).json({ message: "Email verified. You can now log in." });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !user.isVerified) {
      return res.status(401).json({ error: "Invalid credentials or unverified email" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: "Invalid credentials" });

    // Added 'role' to the token payload
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role }, 
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Updated response to include name and role for the Frontend
    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    });

  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export { signup, verifyOTP, login };