import React, { useState } from "react";
import { useAuth } from "../Context/AuthContext";
import axios from "axios";

const Profile = ({ userData, setUserData }) => {
  const [error, setError] = useState("");
  const { currentUser, currentUserRole, BASE_URL } = useAuth();

  const handleImageChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Temporary live preview
    const reader = new FileReader();
    reader.onload = () => {
      setUserData((prevState) => ({
        ...prevState,
        photo: reader.result,
      }));
    };
    reader.readAsDataURL(file);

    // Upload image
    const formData = new FormData();
    formData.append("photo", file);

    try {
      const response = await axios.patch(
        `${BASE_URL}${currentUserRole === "student" ? "students" : "admins"}/${currentUser.username}/photo`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );
      setUserData((prevState) => ({
        ...prevState,
        photo: response.data.photo,
      }));
    } catch (error) {
      console.error("Error uploading image:", error.response?.data || error.message);
      setError("Failed to upload profile image");
    }
  };

  if (!userData) return <p className="text-center">Loading...</p>;

  // Define fields dynamically based on role
  const userFields =
    currentUserRole === "student"
      ? [
          { label: "First Name", value: userData.firstName },
          { label: "Last Name", value: userData.lastName },
          { label: "Email", value: userData.email },
          { label: "Date of Birth", value: userData.dob },
          { label: "Roll Number", value: userData.rollNumber },
          { label: "Phone", value: userData.mobile },
          { label: "Course", value: userData.course },
        ]
      : [
          { label: "First Name", value: userData.firstName },
          { label: "Last Name", value: userData.lastName },
          { label: "Email", value: userData.email },
          { label: "Phone", value: userData.mobile },
          { label: "Employee ID", value: userData.employeeId },
          { label: "Department", value: userData.department },
        ];

  return (
    <div className="flex flex-col items-center min-h-screen p-4 bg-gray-50">
      <div className="w-full max-w-4xl p-6 bg-white shadow-md rounded-lg">
        {/* Profile Image Section */}
        <div className="flex flex-col items-center mb-6">
          <div className="relative w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center border-2 border-gray-300">
            <img
              src={userData.photo || "https://via.placeholder.com/150"}
              alt="Profile"
              className="w-24 h-24 rounded-full object-cover border-2 border-gray-300"
            />
            <button
              type="button"
              className="absolute bottom-0 right-0 bg-blue-500 text-white rounded-full p-1 cursor-pointer"
              onClick={() => document.getElementById("photoUpload").click()}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
            </button>
          </div>
          <p className="mt-2 text-sm text-gray-500">
            {userData.photo ? "Profile Picture" : "Add Profile Picture"}
          </p>

          {/* Hidden file input */}
          <input
            type="file"
            id="photoUpload"
            accept="image/*"
            className="hidden"
            onChange={handleImageChange}
          />
        </div>

        {/* User Details Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {userFields.map(({ label, value }, index) => (
            <div key={index}>
              <label className="block text-sm font-medium">{label}</label>
              <input
                type="text"
                value={value || "N/A"}
                readOnly
                className="w-full p-2 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed"
              />
            </div>
          ))}
        </div>

        {error && <p className="text-red-500 mt-4">{error}</p>}
      </div>
    </div>
  );
};

export default Profile;
