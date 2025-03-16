import React, { useEffect, useRef, useState } from 'react';
import { useAuth } from "../Context/AuthContext"; 
import { NavLink, useNavigate } from 'react-router-dom';

const Adminlogin = () => {
  const emailRef = useRef();
  const passwordRef = useRef();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, currentUser, signout, currentUserRole } = useAuth(); 
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await login(emailRef.current.value, passwordRef.current.value,"admin");
    } catch (err) {
      if (err.response?.status === 404) {
        setError("Admin not found.");
      } else {
        setError("Failed to login. Please check your credentials.");
      }
      setLoading(false);
    }
  }

  // ✅ Check user role AFTER authentication state updates
  useEffect(() => {
    if (currentUserRole) { 
      console.log("Logged-in user:", currentUser);

      if (currentUserRole !== "staff") {
        setError("Invalid credentials. Only admins can log in here.");
        signout(); // 🚀 Log out unauthorized users
        setLoading(false);
        return;
      }

      navigate('/'); // ✅ Redirect only if role is "admin"
    }
  }, [currentUserRole, navigate, signout]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="w-11/12 max-w-lg p-4 shadow-md mx-3">
        {error && <p className="text-red-500 text-center">{error}</p>}
        
        <h1 className="text-4xl font-bold text-center text-blue-600">SRU<span className="text-xs align-bottom">CS-AI</span></h1>
        <p className="text-center text-lg font-semibold mt-2">Admin Login</p>

        <div className="mt-8">
          <div className="mb-4">
            <input type="email" ref={emailRef} className="w-full p-3 border border-gray-300 rounded-lg focus:border-gray-500 focus:outline-none" placeholder="Enter Admin ID" />
          </div>

          <div className="mb-4">
            <input type="password" ref={passwordRef} className="w-full p-3 border border-gray-300 rounded-lg focus:border-gray-500 focus:outline-none" placeholder="Enter your password" />
          </div>

          <button disabled={loading} onClick={handleSubmit} className="w-full bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600">
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </div>

        <div className="text-right mt-3">
          <NavLink to='/forgotpassword' className="text-sm text-blue-500 hover:underline">Forgot Password?</NavLink>
        </div>
      </div>
    </div>
  );
};

export default Adminlogin;
