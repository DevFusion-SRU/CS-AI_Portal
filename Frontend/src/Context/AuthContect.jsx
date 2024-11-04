import React, { useContext, useEffect, useState } from 'react';
import { auth } from "../firebase"; // Ensure you're importing the correct auth instance
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';

const AuthContext = React.createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState();
  const [loading, setLoading] = useState(true);

  async function signup(email, password) {
    return createUserWithEmailAndPassword(auth, email, password);
  }

  async function signout(){
    return signOut(auth)
  }
  async function login(email, password) {
    return await signInWithEmailAndPassword(auth, email, password);
  }

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      console.log("Auth state changed:", user);
      setCurrentUser(user);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    signup,
    login,
    signout
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
