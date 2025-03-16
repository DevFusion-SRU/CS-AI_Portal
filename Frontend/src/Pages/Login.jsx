import React, { useEffect, useRef, useState } from 'react';
import { useAuth } from "../Context/AuthContext"; 
import { NavLink, useNavigate } from 'react-router-dom';

const Login = () => {
  const emailRef = useRef();
  const passwordRef = useRef();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, currentUser,currentUserRole} = useAuth(); 
  const navigate=useNavigate()
  

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError('');
  
    try {
      await login(emailRef.current.value, passwordRef.current.value,"student"); // Call login function
    } catch {
      setError("Failed to login");
      setLoading(false);
    }
  }
  
  // ✅ Check user role after authentication
  useEffect(() => {
    if (currentUser) {
      console.log("Logged-in user:", currentUser);
  
      if (currentUserRole !== "student") {
        setError("Invalid credentials. Only students can log in here.");
        signout(); // 🚀 Immediately log out unauthorized user
        setLoading(false);
        return;
      }
  
      navigate('/'); // ✅ Redirect only if the role is correct
    }
  }, [currentUserRole]); // Runs when `currentUserRole` updates
  
  
  


  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="w-11/12 max-w-lg p-4 shadow-md mx-3">
       {error && <p style={{ color: 'red' }}>{error}</p>}
        <h1 className="text-4xl font-bold text-center text-blue-600">SRU<span className="text-xs align-bottom">CS-AI</span></h1>
        <p className="text-center text-lg font-semibold mt-2">Login to Continue</p>

        <div className="mt-8">
          <div className="mb-4">
            <input type="email" ref={emailRef} className="w-full p-3 border border-gray-300 rounded-lg focus:border-gray-500 focus:outline-none" placeholder="Enter User ID" />
          </div>

          <div className="mb-4">
            <input type="password" ref={passwordRef} className="w-full p-3 border border-gray-300 rounded-lg focus:border-gray-500 focus:outline-none" placeholder="Enter your password" />
          </div>

          <div className="text-right mb-6">
            <NavLink to='/forgotpassword' className="text-sm text-blue-500 hover:underline">Forgot Password?</NavLink>
          </div>

          <button disabled={loading} onClick={handleSubmit} className="w-full bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600">{loading ? 'loging in...' : 'login'}</button>
        </div >
        <div className="text-right">
        <NavLink to='/adminlogin' className="text-sm text-blue-500 hover:underline">login as Staff</NavLink>
                  </div>

        {/* <div className='flex flex-row justify-end mt-2'>
          <span>Have an account?</span>
          <NavLink to="/signup" className="ml-2 text-blue-500">Login</NavLink>
        </div> */}
      </div>
    </div>
  );
};

export default Login;
