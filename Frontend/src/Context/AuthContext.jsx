import React, { useContext, useEffect, useState, useRef } from "react";
import axios from "axios";
axios.defaults.withCredentials = true;
import { useNavigate } from 'react-router-dom';

const AuthContext = React.createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [currentUserRole, setCurrentUserRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const isMounted = useRef(true);
  const navigate = useNavigate();

  const BASE_URL = import.meta.env.VITE_BASE_API_URL;

  const signup = async (email, password) => {
    try {
      const response = await axios.post(
        `${BASE_URL}auth/signup`,
        { username: email, password: password },
        { withCredentials: true }
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
  };

  const login = async (email, password) => {
    try {
      const response = await axios.post(
        `${BASE_URL}auth/login`,
        { username: email, password: password },
        { withCredentials: true }
      );
      if (response.data.success) {
        isMounted.current = true;
        checkAuthState();
        return () => {
          isMounted.current = false;
        };
      } else {
        handleError("Invalid login credentials.");
      }
    } catch (error) {
      console.error("Login error:", error);
      handleError(error.response?.data?.message || "Failed to login. Check your credentials.");
    }
  };

  const signout = async () => {
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
  };

  const handleError = (message) => {
    setErrorMessage(message);
    setTimeout(() => setErrorMessage(""), 5000);
  };

  const checkAuthState = async () => {
    try {
      const response = await axios.get(`${BASE_URL}auth/verify`, {
        withCredentials: true,
      });
      console.log(response.data)
      console.log(isMounted.current)
      if (isMounted.current) {
        if (response?.data?.success) {
          const user = response.data.user;
          console.log(response.data.user,"if")
          const role = user.role;
          console.log(user,role)
          setCurrentUser(user);
          setCurrentUserRole(role);
        } else {
          console.warn("Unexpected response structure or user not authenticated.");
          setCurrentUser(null);
          setCurrentUserRole(null);
        }
      }
    } catch (error) {
      if (isMounted.current) {
        setCurrentUser(null);
        setCurrentUserRole(null);
  
        if (error.response?.status === 401) {
          console.warn("User not authenticated or session expired.");
        } else {
          console.error(
            "Error during authentication check:",
            error.response?.data?.message || error.message
          );
        }
      }
    } finally {
      if (isMounted.current) {
        setLoading(false);
      }
    }
  };
  
  // Call the function on mount
  useEffect(() => {
    const isMounted = { current: true };
    checkAuthState();
  
    return () => {
      isMounted.current = false;
    };
  }, []);
  

  const value = {
    currentUser,
    currentUserRole,
    signup,
    login,
    signout,
    errorMessage,
    BASE_URL,
  };

  return (
    <AuthContext.Provider value={value}>
      {loading ? <div>Loading...</div> : children}
    </AuthContext.Provider>
  );
};
