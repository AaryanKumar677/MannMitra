import { auth, db } from "../config/firebase";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile as firebaseUpdateProfile } from "firebase/auth";
import { doc, setDoc, getDoc, updateDoc } from "firebase/firestore";

export async function signUp({ email, password, firstName, lastName, age, mobile }) {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    const profileData = {
      user_id: user.uid,
      first_name: firstName,
      last_name: lastName,
      age: age || null,
      phone_number: mobile || null,
      email: email,
    };

    await setDoc(doc(db, "profiles", user.uid), profileData);
    console.log("✅ Profile row inserted for user:", user.uid);

    return { user };
  } catch (error) {
    console.error("Signup error:", error.message);
    return { error };
  }
}

export async function signIn({ email, password }) {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return { user: userCredential.user };
  } catch (error) {
    console.error("Login error:", error.message);
    return { error };
  }
}

export async function getProfile(userId) {
  try {
    console.log("➡️ Fetching profile for userId:", userId);
    
    const docRef = doc(db, "profiles", userId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return { profile: docSnap.data() };
    } else {
      console.log("No such profile!");
      return { profile: null };
    }
  } catch (error) {
    console.error("❌ Get profile error:", error.message);
    return { error };
  }
}

export async function updateProfile(userId, updates, currentUser = null) {
  try {
    const docRef = doc(db, "profiles", userId);
    await updateDoc(docRef, updates);
    
    if (currentUser && updates.photo_url) {
      await firebaseUpdateProfile(currentUser, {
        photoURL: updates.photo_url
      });
    }

    const docSnap = await getDoc(docRef);

    return { profile: docSnap.data() };
  } catch (error) {
    console.error("Update profile error:", error.message);
    return { error };
  }
}