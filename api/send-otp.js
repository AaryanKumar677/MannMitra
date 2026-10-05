import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import nodemailer from "nodemailer";

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY || "AIzaSyDeUtKIvBXeuvcIWeJet-iGnQj0MosdwxY",
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN || "mannmitra-1.firebaseapp.com",
  projectId: process.env.VITE_FIREBASE_PROJECT_ID || "mannmitra-1",
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET || "mannmitra-1.firebasestorage.app",
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "453995153947",
  appId: process.env.VITE_FIREBASE_APP_ID || "1:453995153947:web:7a805f4fd807e9829ec6be"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }

  try {
    // Generate a 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Store OTP in Firestore (temporary collection 'email_otps')
    // Expiry time: 10 minutes from now
    const expiryDate = new Date(Date.now() + 10 * 60000).toISOString();
    await setDoc(doc(db, "email_otps", email), {
      otp: otp,
      expiresAt: expiryDate,
      verified: false
    });

    // Configure Nodemailer
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.SMTP_USER, // Will be read from .env
        pass: process.env.SMTP_PASS  // Will be read from .env
      },
    });

    // Send the email
    const mailOptions = {
      from: `"MannMitra Support" <${process.env.SMTP_USER}>`,
      to: email,
      subject: "Your Verification Code for MannMitra",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
          <h2 style="color: #0d9488; text-align: center;">Welcome to MannMitra!</h2>
          <p>Please use the following 6-digit verification code to complete your registration.</p>
          <div style="background-color: #f0fdfa; padding: 15px; text-align: center; border-radius: 8px; margin: 20px 0;">
            <h1 style="color: #0f766e; letter-spacing: 5px; margin: 0;">${otp}</h1>
          </div>
          <p style="color: #666; font-size: 13px; text-align: center;">This code will expire in 10 minutes.</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    return res.status(200).json({ success: true, message: "OTP sent successfully" });
  } catch (error) {
    console.error("Error in send-otp:", error);
    return res.status(500).json({ error: "Failed to send OTP", details: error.message });
  }
}
