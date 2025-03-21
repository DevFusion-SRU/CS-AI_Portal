import React, { useEffect, useRef, useState } from "react";
import { useAuth } from "../Context/AuthContext";
import { NavLink, useNavigate } from "react-router-dom";

const Login = () => {
  const emailRef = useRef();
  const passwordRef = useRef();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [attempts, setAttempts] = useState(0); // Track login attempts
  const { login, currentUser, currentUserRole } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await login(emailRef.current.value, passwordRef.current.value, "student");
    } catch (error) {
      setAttempts((prev) => prev + 1); // Increment attempts on failure
      if (attempts + 1 >= 3) {
        setError("Wrong credentials, try again."); // Keep default message
        alert("You have exceeded 3 login attempts. Please contact your college administration.");
      } else {
        setError(error.message || "Wrong credentials, try again.");
      }
      setLoading(false);
    }
  }

  useEffect(() => {
    if (currentUser) {
      console.log("Logged-in user:", currentUser);
      if (currentUserRole !== "student") {
        setError("Invalid credentials. Only students can log in here.");
        setLoading(false);
        return;
      }
      navigate("/");
    }
  }, [currentUser, currentUserRole, navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-gray-200 to-blue-100">
      <div className="w-11/12 max-w-lg p-8 bg-white rounded-xl shadow-xl">
        <div className="flex justify-center gap-4 mb-6">
          <NavLink
            to="/login"
            className={({ isActive }) =>
              `px-6 py-2 rounded-lg text-sm font-semibold transition-all duration-300 ${
                isActive
                  ? "bg-blue-600 text-white shadow-md"
                  : "bg-gray-200 text-gray-700 hover:bg-blue-100"
              }`
            }
          >
            Student
          </NavLink>
          <NavLink
            to="/adminlogin"
            className={({ isActive }) =>
              `px-6 py-2 rounded-lg text-sm font-semibold transition-all duration-300 ${
                isActive
                  ? "bg-blue-600 text-white shadow-md"
                  : "bg-gray-200 text-gray-700 hover:bg-blue-100"
              }`
            }
          >
            Admin
          </NavLink>
        </div>

        {error && (
          <p className="text-red-500 text-center mb-4 bg-red-100 p-2 rounded">{error}</p>
        )}
        <h1 className="text-4xl font-bold text-center text-blue-600 mb-2">
          SRU<span className="text-xs align-bottom">CS-AI</span>
        </h1>
        <p className="text-center text-lg font-medium text-gray-600 mb-6">
          Student Login
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <input
              type="text"
              ref={emailRef}
              placeholder="Enter User ID"
              required
              className="w-full p-4 pl-5 pr-12 bg-gray-100 rounded-lg border-none outline-none text-gray-700 font-medium placeholder-gray-400 focus:ring-2 focus:ring-blue-500 transition duration-200"
            />
            <i className="bx bxs-user absolute right-4 top-1/2 transform -translate-y-1/2 text-xl text-gray-500"></i>
          </div>

          <div className="relative">
            <input
              type="password"
              ref={passwordRef}
              placeholder="Enter your password"
              required
              className="w-full p-4 pl-5 pr-12 bg-gray-100 rounded-lg border-none outline-none text-gray-700 font-medium placeholder-gray-400 focus:ring-2 focus:ring-blue-500 transition duration-200"
            />
            <i className="bx bxs-lock-alt absolute right-4 top-1/2 transform -translate-y-1/2 text-xl text-gray-500"></i>
          </div>

          <div className="text-right">
            <NavLink
              to="/forgotpassword"
              className="text-sm text-blue-500 hover:text-blue-700 transition duration-200"
            >
              Forgot Password?
            </NavLink>
          </div>

          <button
            type="submit"
            disabled={loading} // Only disable during loading, not after 3 attempts
            className="w-full p-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition duration-300 shadow-md disabled:bg-blue-400 disabled:cursor-not-allowed"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;