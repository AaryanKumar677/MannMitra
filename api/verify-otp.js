import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc, updateDoc } from "firebase/firestore";

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

  const { email, otp } = req.body;
  if (!email || !otp) {
    return res.status(400).json({ error: "Email and OTP are required" });
  }

  try {
    const otpDocRef = doc(db, "email_otps", email);
    const otpDoc = await getDoc(otpDocRef);

    if (!otpDoc.exists()) {
      return res.status(400).json({ error: "OTP not found or expired. Please request a new one." });
    }

    const data = otpDoc.data();

    // Check expiry
    const now = new Date();
    const expiryDate = new Date(data.expiresAt);
    if (now > expiryDate) {
      return res.status(400).json({ error: "OTP has expired. Please request a new one." });
    }

    // Check match
    if (data.otp !== otp) {
      return res.status(400).json({ error: "Invalid OTP. Please try again." });
    }

    // Mark as verified (optional, you can also delete the document)
    await updateDoc(otpDocRef, { verified: true });

    return res.status(200).json({ success: true, message: "Email verified successfully" });
  } catch (error) {
    console.error("Error in verify-otp:", error);
    return res.status(500).json({ error: "Failed to verify OTP", details: error.message });
  }
}
