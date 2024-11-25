import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AuthContext = React.createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [currentUserRole, setCurrentUserRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  // Signup function
  async function signup(email, password) {
    try {
      const response = await fetch("http://localhost:5000/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username: email, password: password }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        alert("Signup successful!");
      } else {
        handleError(result.message || "Signup failed. Please try again.");
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
        "http://localhost:5000/api/auth/login",
        {
          'username': email,
          'password': password,
        },
        { withCredentials: true } // Important to include this for sending cookies
      );

      console.log("Response Data:", response);

      if (response.data.success) {
        console.log(response.data.token)
        localStorage.setItem("authToken", response.data.token);
        fetchCurrentUser();
      } else {
        setError("Invalid response from server.");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError(
        err.response?.data?.message || "Failed to login. Check your credentials."
      );
    }
  }

  // Fetch current user data
  async function fetchCurrentUser() {
   
    try {
      const response = await fetch("http://localhost:5000/api/auth/verify", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });

      const result = await response.json();
      
      if (response.ok && result.success) {
        setCurrentUser(result.user);
        setCurrentUserRole(result.user.role);
      } else {
        handleError("Failed to fetch user data.");
      }
    } catch (error) {
      console.error("Error fetching user:", error);
    }
    finally {
      // Set loading to false regardless of success or failure
      setLoading(false);
    }
  }

  // Helper function to get token
  
  // Signout function
  async function signout() {
    try {
      const token = localStorage.getItem("authToken");; // Get token from your token management function
      if (!token) {
        console.log("No token found, can't log out.");
        handleError("No token found. Please log in again.");
        return;
      }


      const response = await fetch("http://localhost:5000/api/auth/logout", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`, // Ensure token is being sent
        },
        credentials: "include", // Ensure cookies are sent if needed
      });
      if (!response.ok) {
        const errorText = await response.text();
        
        console.log(localStorage.getItem("authToken"))
        console.error("Logout error:", errorText);
        handleError("Logout failed. Please try again.");
        return;
      }
  
      const result = await response.json();
      if (result.success) {
        console.log("Logged out successfully");
        localStorage.removeItem("authToken");
        setCurrentUser(null);
        setCurrentUserRole(null);
// Any other state clearing related to the user

        // Optionally, clear any user state in the frontend
      } else {
        handleError(result.message || "Logout failed. Please try again.");
      }
    } catch (error) {
      console.error("Error during signout:", error);
      handleError("An error occurred during logout.");
    }
  }
  
  
  

  function getAuthToken() {
    const match = localStorage.getItem("authToken").match(new RegExp('(^| )' + "token" + '=([^;]+)'));
    
    return match ? match[2] : null;
  }

  const handleError = (message) => {
    setErrorMessage(message);
    setTimeout(() => setErrorMessage(""), 5000);
  };

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      fetchCurrentUser();
    } else {
      setLoading(false);
    }
  }, []);

  const value = {
    currentUser,
    currentUserRole,
    getAuthToken,
    signup,
    login,
    signout,
    errorMessage,
  };

  return (
    <AuthContext.Provider value={value}>
      {loading ? <div>Loading...</div> : children}
    </AuthContext.Provider>
  );
}
