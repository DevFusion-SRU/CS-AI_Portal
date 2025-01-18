import React, { useRef, useState } from 'react';
import { useAuth } from "../Context/AuthContext"; 
import { NavLink, useNavigate } from 'react-router-dom';

const Signup = () => {
  const emailRef = useRef();
  const passwordRef = useRef();
  const passwordConfirmRef = useRef();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signup} = useAuth(); 
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    if (passwordConfirmRef.current.value !== passwordRef.current.value) {
      return setError("Passwords do not match");
    }
    try {
      setError('');
      setLoading(true);
      await signup(emailRef.current.value, passwordRef.current.value);
      navigate('/')
    } catch (error) {
      console.error("Signup error:", error); // Log error for debugging
      setError("Failed to create an account. " + (error.code ? error.code : ''));
    }
    setLoading(false);
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="w-11/12 max-w-lg p-4 shadow-md mx-3">
       {error && <p style={{ color: 'red' }}>{error}</p>}
        <h1 className="text-4xl font-bold text-center text-blue-600">SRU<span className="text-xs align-bottom">CS-AI</span></h1>
        <p className="text-center text-lg font-semibold mt-2">Login to Continue</p>

        <div className="mt-8">
          <div className="mb-4">
            <input type="email" ref={emailRef} className="w-full p-3 border border-gray-300 rounded-lg focus:border-gray-500 focus:outline-none" placeholder="Enter your Roll Number" />
          </div>

          <div className="mb-4">
            <input type="password" ref={passwordRef} className="w-full p-3 border border-gray-300 rounded-lg focus:border-gray-500 focus:outline-none" placeholder="Enter your password" />
          </div>

          <div className="mb-6">
            <input type="password" ref={passwordConfirmRef} className="w-full p-3 border border-gray-300 rounded-lg focus:border-gray-500 focus:outline-none" placeholder="Confirm password" />
          </div>

          <button disabled={loading} onClick={handleSubmit} className="w-full bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600">{loading ? 'Signing up...' : 'Signup'}</button>
        </div>

        <div className='flex flex-row justify-end mt-2'>
          <span>Have an account?</span>
          <NavLink to="/login" className="ml-2 text-blue-500">Login</NavLink>
        </div>
      </div>
    </div>
  );
};

export default Signup;
