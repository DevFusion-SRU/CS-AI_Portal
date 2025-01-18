import { React, useRef, useState } from "react";
import axios from "axios";
axios.defaults.withCredentials=true
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";

const Forgotpassword = () => {
  const emailRef = useRef();
  const { BASE_URL } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState(Array(6).fill(""));
  const [otpVerified, setOtpVerified] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [ischanged, setIschanged] = useState(false)
  const[success, setSuccess]=useState(false)

  const [username, setUsername] = useState("")

  async function requestOtp() {
    const email = emailRef.current.value;

    if (!email) {
      setAlertMessage("Please enter a valid email address.");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${BASE_URL}auth/reset-password`,{ "username": email }, {
        headers: { "Content-Type": "application/json" },
        withCredentials:true
      });
      

      const data = await response.data;
      if (response.status===200) {
        setOtpSent(true);
        setUsername(email)
        setAlertMessage(data.message || "OTP sent successfully!");
      } else {
        setAlertMessage(data.message || "Failed to send OTP. Please try again.");
      }
    } catch (error) {
      setAlertMessage("An error occurred. Please try again.");
      console.log(error)
    } finally {
      setLoading(false);
    }
  }

  async function verifyOtp() {
    const enteredOtp = otp.join("");

    if (enteredOtp.length < 6) {
      setAlertMessage("Please enter a valid 6-digit OTP.");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${BASE_URL}auth/reset-password`,{
        username: username,
        otp: enteredOtp,
      },{
        headers: { "Content-Type": "application/json" },
        withCredentials:true
        });

        const data = await response.data;
        if (response.status===200) {
        setOtpVerified(true);
        setAlertMessage(data.message || "OTP verified successfully!");
      } else {
        setAlertMessage(data.message || "Invalid OTP. Please try again.");
      }
    } catch (error) {
      setAlertMessage("An error occurred. Please try again.");
      console.log(error)
    } finally {
      setLoading(false);
    }
  }

  async function resetPassword() {
    if (!newPassword || !confirmPassword) {
      setAlertMessage("Please fill in both password fields.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setAlertMessage("Passwords do not match. Please try again.");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${BASE_URL}auth/reset-password`, { "username": username, "newPassword": newPassword }, {
        headers: { "Content-Type": "application/json" },
        withCredentials:true
      });
      
      const data = await response.data;
      if (response.status===200) {
        setAlertMessage(data.message || "Password reset successfully!");
        setIschanged(true)
      } else {
        setAlertMessage(data.message || "Failed to reset password. Please try again.");
      }
    } catch (error) {
      setAlertMessage("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function handleOtpChange(e, index) {
    const value = e.target.value;
    if (/^\d*$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      // Automatically move to the next input
      if (value && index < otp.length - 1) {
        e.target.nextSibling?.focus();
      }
    }
  }

  function handleOtpKeyDown(e, index) {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      e.target.previousSibling?.focus();
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="w-11/12 max-w-lg p-4 shadow-md mx-3 font-sans">
        <h1 className="text-4xl font-bold text-center text-blue-600">
          SRU<span className="text-xs align-bottom">CS-AI</span>
        </h1>
        <p className="text-center text-lg font-semibold mt-2">Forgot Password?</p>
        {!ischanged && (
          <p className="text-center text-base text-gray-600">
            Please enter the details below to reset your password.
          </p>
        )}

        {alertMessage && !ischanged && (
          <div className="bg-red-100 text-red-700 p-3 mt-4 rounded-lg text-center">
            {alertMessage}
          </div>
        )}

        {!otpSent && (
          <div className="flex flex-col items-center justify-center mt-8 mb-4">
            <input
              type="email"
              ref={emailRef}
              required
              className="w-2/3 p-3 border border-gray-300 rounded-lg focus:border-gray-500 focus:outline-none"
              placeholder="Enter your Roll Number"
            />
            <button
              disabled={loading}
              onClick={requestOtp}
              className="w-2/3 bg-blue-500 text-white p-3 rounded-lg mt-4 hover:bg-blue-600"
            >
              {loading ? "Requesting OTP..." : "Request OTP"}
            </button>
          </div>
        )}

        {otpSent && !otpVerified && (
          <div className="flex flex-col items-center justify-center mt-8 mb-4">
            <p className="text-center text-gray-600">Enter the 6-digit OTP sent to your email.</p>
            <div className="flex gap-2 mt-4">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  type="text"
                  maxLength="1"
                  value={digit}
                  onChange={(e) => handleOtpChange(e, index)}
                  onKeyDown={(e) => handleOtpKeyDown(e, index)}
                  className="w-10 h-10 text-center border border-gray-300 rounded-lg focus:border-gray-500 focus:outline-none"
                />
              ))}
            </div>
            <button
              onClick={verifyOtp}
              className="w-2/3 bg-blue-500 text-white p-3 rounded-lg mt-4 hover:bg-blue-600"
            >
              Verify OTP
            </button>
          </div>
        )}

        {otpVerified && !ischanged && (
          <div className="flex flex-col items-center justify-center mt-8 mb-4">
            <p className="text-center text-gray-600">Set your new password below.</p>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-2/3 p-3 mt-4 border border-gray-300 rounded-lg focus:border-gray-500 focus:outline-none"
              placeholder="New Password"
            />
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-2/3 p-3 mt-4 border border-gray-300 rounded-lg focus:border-gray-500 focus:outline-none"
              placeholder="Confirm Password"
            />
            <button
              onClick={resetPassword}
              className="w-2/3 bg-blue-500 text-white p-3 rounded-lg mt-4 hover:bg-blue-600"
            >
              Reset Password
            </button>
          </div>
        )}
        {ischanged && (
          <div className="flex flex-col items-center justify-center mt-8 mb-4">
            <p className="text-center text-gray-600">Password Reset Successfully ✔️</p>
            <button
              onClick={() => navigate("/login")}
              className="w-2/3 bg-blue-500 text-white p-3 rounded-lg mt-4 hover:bg-blue-600"
            >
              Login
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Forgotpassword;
