import React, { createContext, useContext, useEffect, useState } from "react";
import { auth, googleProvider } from "../config/firebase";
import { onAuthStateChanged, signInWithPopup, signOut as firebaseSignOut, signInAnonymously } from "firebase/auth";
import { getProfile, signUp as authSignUp, signIn as authSignIn } from "../config/auth";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  console.log("🔵 AuthProvider: render start");

  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profileLoading, setProfileLoading] = useState(false);

  const refreshProfile = async (userId) => {
    if (!userId) {
      setProfile(null);
      return;
    }
    setProfileLoading(true);
    try {
      const { profile, error } = await getProfile(userId);
      if (!error && profile) {
        setProfile(profile);
      } else {
        setProfile(null);
      }
    } catch (err) {
      console.error("refreshProfile error:", err.message);
      setProfile(null);
    } finally {
      setProfileLoading(false);
    }
  };

  useEffect(() => {
    console.log("🔵 AuthProvider: useEffect init");
    const unsubscribe = onAuthStateChanged(auth, async (newUser) => {
      console.log("🔵 AuthProvider: onAuthStateChange ->", newUser);
      
      if (newUser) {
        setUser(newUser);
        await refreshProfile(newUser.uid);
      } else {
        setUser(null);
        setProfile(null);
      }
      setLoading(false);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const signUp = async (email, password, firstName, lastName, age, mobile) => {
    return await authSignUp({ email, password, firstName, lastName, age, mobile });
  };

  const signIn = async (email, password) => {
    return await authSignIn({ email, password });
  };

  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      return { user: result.user };
    } catch (error) {
      console.error("Google Sign-In error:", error.message);
      return { error };
    }
  };

  const signInAsGuest = async () => {
    try {
      const result = await signInAnonymously(auth);
      return { user: result.user };
    } catch (error) {
      console.error("Guest Sign-In error:", error.message);
      return { error };
    }
  };

  const signOut = async () => {
    await firebaseSignOut(auth);
    setUser(null);
    setProfile(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        profileLoading,
        refreshProfile,
        signUp,
        signIn,
        signInWithGoogle,
        signInAsGuest,
        signOut,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  console.log("🟢 useAuth() ->", ctx);
  return ctx;
};
