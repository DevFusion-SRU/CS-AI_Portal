import React, { useContext, useEffect, useState } from "react";
import { auth, db } from "../firebase"; // Ensure you're importing the correct auth and Firestore instance
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { doc, getDoc } from "firebase/firestore"; // Firestore utilities to fetch user roles

const AuthContext = React.createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState();
  const [currentUserRole, setCurrentUserRole] = useState(null); // State to store user role
  const [loading, setLoading] = useState(true);

  // Signup function (creates a new user)
  async function signup(email, password) {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.error("Error during signup:", error);
    }
  }

  // Login function
  async function login(email, password) {
    try {
      return await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.error("Error during login:", error);
      throw error;
    }
  }

  // Signout function
  async function signout() {
    setCurrentUserRole(null); // Clear role on signout
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error during signout:", error);
    }
  }

  // Fetch user role from Firestore
  async function fetchUserRole(uid) {
    try {
      const userDoc = await getDoc(doc(db, "users", uid));
      if (userDoc.exists()) {
        const role = userDoc.data().role; // Assuming "role" field exists in Firestore document
        setCurrentUserRole(role);
      } else {
        console.error("No user document found in Firestore for UID:", uid);
        setCurrentUserRole(null); // In case the role isn't set or doc doesn't exist
      }
    } catch (error) {
      console.error("Error fetching user role:", error);
      setCurrentUserRole(null); // Reset role if error occurs
    }
  }

  useEffect(() => {
    // Listen for auth state changes
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
      if (user) {
        // Fetch the user's role when they log in
        fetchUserRole(user.uid);
      } else {
        setCurrentUserRole(null); // Clear role if no user is logged in
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    currentUserRole, // Expose the user role to the context consumers
    signup,
    login,
    signout,
  };
  console.log(currentUserRole)

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
