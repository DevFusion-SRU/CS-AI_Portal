import React, { useContext, useEffect, useState } from "react";
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
        fetchCurrentUser();
      } else {
        handleError("Invalid login credentials.");
      }
    } catch (error) {
      console.error("Login error:", error);
      handleError(error.response?.data?.message || "Failed to login. Check your credentials.");
    }
  };

  const fetchCurrentUser = async () => {
    try {
      const response = await axios.get(`${BASE_URL}auth/verify`, {
        withCredentials: true,
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
      setLoading(false);
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
            setCurrentUserRole(role);
          } else {
            setCurrentUser(null);
            setCurrentUserRole(null);
            console.warn("Unexpected response structure or user not authenticated.");
          }
        }
      } catch (error) {
        if (isMounted) {
          setCurrentUser(null);
          setCurrentUserRole(null);

          if (error.response?.status === 401) {
            console.warn("User not authenticated or session expired.");
            
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
    BASE_URL,
  };

  return (
    <AuthContext.Provider value={value}>
      {loading ? <div>Loading...</div> : children}
    </AuthContext.Provider>
  );
};
