import React, { useEffect, useState } from "react";
import { useAuth } from "../Context/AuthContect";
import axios from "axios";

const EditProfile = () => {
  const [userData, setUserData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    dob: "",
    rollNumber: "",
    mobile: "",
    course: "",
    profileImage: "", // Profile image URL
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(""); // To capture error messages
  const { currentUser } = useAuth();

  // Fetch user data from the backend
  useEffect(() => {
    // Fetch user data from the backend using email as query parameter
    axios
      .get(`http://localhost:5000/api/students/${currentUser.email.split('@')[0].toUpperCase()}`)
      .then((response) => {
        setUserData(response.data); // Set user data from backend
        setLoading(false); // Set loading state to false
      })
      .catch((error) => {
        console.error("Error fetching user data:", error);
        setLoading(false); // Set loading to false in case of error
      });
  }, [currentUser.email]); 

  if (loading) return <p className="text-center">Loading...</p>;
  if (error) return <p className="text-center text-red-600">{error}</p>;

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
            <label className="block text-sm font-medium">First Name</label>
            <input
              type="text"
              name="firstName"
              value={userData.firstName || "N/A"}
              readOnly
              className="w-full p-2 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Last Name</label>
            <input
              type="text"
              name="lastName"
              value={userData.lastName || "N/A"}
              readOnly
              className="w-full p-2 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Email</label>
            <input
              type="email"
              name="email"
              value={userData.email || "N/A"}
              readOnly
              className="w-full p-2 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Date of Birth</label>
            <input
              type="date"
              name="dob"
              value={userData.dob || ""}
              readOnly
              className="w-full p-2 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Hallticket Number</label>
            <input
              type="text"
              name="rollNumber"
              value={userData.rollNumber || "N/A"}
              readOnly
              className="w-full p-2 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Phone</label>
            <input
              type="tel"
              name="mobile"
              value={userData.mobile || "N/A"}
              readOnly
              className="w-full p-2 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Course</label>
            <input
              type="text"
              name="course"
              value={userData.course || "N/A"}
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
