import React, { useEffect, useState } from "react";
import { useAuth } from "../Context/AuthContect"; 
import axios from "axios";

const EditProfile = () => {
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    dob: "",
    username: "",
    password: "",
    hallTicket: "",
    pan: "",
    mentor: "",
    aadhar: "",
    phone: "",
    profileImage: "", // New property for profile image
  });

  const [loading, setLoading] = useState(true);
  const { currentUser} = useAuth(); 

  // Fetch user data from the backend
  useEffect(() => {
    axios
      .get("https://your-backend-api.com/user-profile")
      .then((response) => {
        setUserData(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching user data:", error);
        setLoading(false);
      });
  }, []);

  if (loading) return <p className="text-center">Loading...</p>;

  return (
    <div className="flex flex-col items-center min-h-screen p-4 bg-gray-50">
      <div className="w-full max-w-4xl p-6 bg-white shadow-md rounded-lg">
        {/* Profile Image Section */}
        <div className="flex flex-col items-center mb-6">
          <img
            src={userData.profileImage || "https://via.placeholder.com/150"}
            alt="Profile"
            className="w-24 h-24 rounded-full object-cover border-2 border-gray-300"
          />
          <p className="mt-2 text-sm text-gray-500">Profile Picture</p>
        </div>

        {/* User Details Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium">Your Name</label>
            <input
              type="text"
              name="name"
              value={userData.name}
              readOnly
              className="w-full p-2 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">User Name</label>
            <input
              type="text"
              name="username"
              value={userData.username}
              readOnly
              className="w-full p-2 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Email</label>
            <input
              type="email"
              name="email"
              value={currentUser.email}
              readOnly
              className="w-full p-2 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Password</label>
            <input
              type="password"
              name="password"
              value={userData.password}
              readOnly
              className="w-full p-2 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Date of Birth</label>
            <input
              type="date"
              name="dob"
              value={userData.dob}
              readOnly
              className="w-full p-2 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Hallticket Number</label>
            <input
              type="text"
              name="hallTicket"
              value={userData.hallTicket}
              readOnly
              className="w-full p-2 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed"
            />
          </div>
          <div>
          <label className="block text-sm font-medium">Phone</label>
            <input
              type="tel"
              name="phone"
              value={userData.phone}
              readOnly
              className="w-full p-2 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Mentor</label>
            <input
              type="text"
              name="mentor"
              value={userData.mentor}
              readOnly
              className="w-full p-2 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed"
            />
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
