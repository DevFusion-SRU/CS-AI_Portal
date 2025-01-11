import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
axios.defaults.withCredentials=true
import { useNavigate } from 'react-router-dom';

const AuthContext = React.createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [currentUserRole, setCurrentUserRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate=useNavigate()

  const BASE_URL = import.meta.env.VITE_BASE_API_URL;

  // Signup function
  async function signup(email, password) {
    try {
      const response = await axios.post(
        `${BASE_URL}auth/signup`,
        { username: email, password: password },
        { withCredentials: true } // Ensures cookies are sent/received
      );

      if (response.data.success) {
        alert("Signup successful!");
      } else {
        handleError(response.data.message || "Signup failed. Please try again.");
      }
    } catch (error) {
      console.error("Error during signup:", error);
      handleError("Something went wrong. Please try again.");
    }
  }

  // Login function
  async function login(email, password) {
    try {
      const response = await axios.post(
        `${BASE_URL}auth/login`,
        { username: email, password: password },
        { withCredentials: true } // Ensure cookies are sent/received
      );

      if (response.data.success) {
        fetchCurrentUser(); // Fetch user info after login
      } else {
        handleError("Invalid login credentials.");
      }
    } catch (error) {
      console.error("Login error:", error);
      handleError(
        error.response?.data?.message || "Failed to login. Check your credentials."
      );
    }
  }

  // Fetch current user data
  async function fetchCurrentUser() {
    try {
      const response = await axios.get(`${BASE_URL}auth/verify`, {
        withCredentials: true, // Send cookies to authenticate
      });

      if (response.data.success) {
        setCurrentUser(response.data.user);
        setCurrentUserRole(response.data.user.role);
      } else {
        handleError("Failed to fetch user data.");
      }
    } catch (error) {
      console.error("Error fetching user:", error);
    } finally {
      setLoading(false); // Loading ends whether fetch is successful or not
    }
  }

  // Logout function
  async function signout() {
    try {
      const response = await axios.post(`${BASE_URL}auth/logout`, {}, { withCredentials: true });

      if (response.data.success) {
        setCurrentUser(null);
        setCurrentUserRole(null);
      } else {
        handleError(response.data.message || "Logout failed. Please try again.");
      }
    } catch (error) {
      console.error("Error during logout:", error);
      handleError("An error occurred during logout.");
    }
  }

  const handleError = (message) => {
    setErrorMessage(message);
    setTimeout(() => setErrorMessage(""), 5000);
  };

  // Monitor authentication state on component mount
  useEffect(() => {
    let isMounted = true;

    const checkAuthState = async () => {
      try {
        const response = await axios.get(`${BASE_URL}auth/verify`, {
          withCredentials: true,
        });
    
        if (isMounted) {
          if (response?.data?.success) {
            const user = response.data.user || null;
            const role = user?.role || null;
            setCurrentUser(user);
            console.log(user)
            setCurrentUserRole(role);
          } else {
            // Handle unexpected cases where `success` is false
            setCurrentUser(null);
            setCurrentUserRole(null);
            navigate("/login")
            console.warn("Unexpected response structure or user not authenticated.");
          }
        }
      } catch (error) {
        if (isMounted) {
          setCurrentUser(null);
          setCurrentUserRole(null);
    
          if (error.response?.status === 401) {
            console.warn("User not authenticated or session expired.");
            navigate("/login")
          } else {
            console.error("Error during authentication check:", error.message);
          }
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };
    
    checkAuthState();
    

    // Cleanup function
    return () => {
      isMounted = false;
    };
  }, []);

  const value = {
    currentUser,
    currentUserRole,
    signup,
    login,
    signout,
    errorMessage,
    BASE_URL
  };

  return (
    <AuthContext.Provider value={value}>
      {loading ? <div>Loading...</div> : children}
    </AuthContext.Provider>
  );
}
