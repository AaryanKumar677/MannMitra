// src/utils/guest.js
import { db } from "../config/firebase";
import { collection, addDoc } from "firebase/firestore";

/**
 * Guest conversations ko localStorage se uthata hai
 * aur nayi user_id ke saath firebase me daal deta hai.
 */
export async function migrateGuestConversations(userId) {
  try {
    const guestData = localStorage.getItem("mann_guest_conversations");
    if (!guestData) {
      console.log("⚠️ No guest conversations found.");
      return;
    }

    const conversations = JSON.parse(guestData);
    if (!Array.isArray(conversations) || conversations.length === 0) {
      console.log("⚠️ Guest conversations empty.");
      return;
    }

    // Firestore collection: conversations
    const batchPromises = conversations.map((c) =>
      addDoc(collection(db, "conversations"), {
        user_id: userId,
        message: c.message,
        response: c.response,
        created_at: c.created_at || new Date().toISOString(),
      })
    );

    await Promise.all(batchPromises);

    console.log("✅ Guest conversations migrated to DB.");
    localStorage.removeItem("mann_guest_conversations"); // cleanup
  } catch (err) {
    console.error("Guest migration error:", err.message);
  }
}
