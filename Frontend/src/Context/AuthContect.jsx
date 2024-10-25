import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth } from '../firebase'; // Ensure you're importing the correct auth instance
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  async function signup(email, password) {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      return userCredential.user; // Return the user object
    } catch (error) {
      console.error("Signup error:", error); // Log error for debugging
      throw error; // Rethrow the error to handle it in the component
    }
  }

  async function login(email, password) {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return userCredential.user; // Return the user object
    } catch (error) {
      console.error("Login error:", error); // Log error for debugging
      throw error; // Rethrow the error to handle it in the component
    }
  }

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      setCurrentUser(user);
      setLoading(false);
    });
    return () => unsubscribe(); // Clean up subscription on unmount
  }, []);

  const value = {
    currentUser,
    signup,
    login
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
