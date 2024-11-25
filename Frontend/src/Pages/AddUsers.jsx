import React, { useEffect, useState } from "react";
import { useAuth } from "../Context/AuthContext";
import axios from "axios";
const AddUsers = () => {
    
  
  
    return (
      <div className="flex flex-col items-center min-h-screen p-4 bg-gray-50">
        <div className="w-full max-w-4xl p-6 bg-white shadow-md rounded-lg">
          {/* Profile Image Section */}
          <div className="flex flex-col items-center mb-6">
            {userData.photo ? (
              <img
                src={userData.photo}
                alt="Profile"
                className="w-24 h-24 rounded-full object-cover border-2 border-gray-300"
              />
            ) : (
              <div className="relative w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center border-2 border-gray-300">
                <img
                  src="https://via.placeholder.com/150"
                  alt="Default Profile"
                  className="absolute inset-0 w-full h-full object-cover rounded-full"
                />
                <div
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
                </div>
              </div>
            )}
            <p className="mt-2 text-sm text-gray-500">
              {userData.photo ? "Profile Picture" : "Add Profile Picture"}
            </p>
  
            {/* Hidden file input */}
            <input
              type="file"
              id="photoUpload"
              accept="image/*"
              className="hidden"
            />
          </div>
  
          {/* User Details Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium">First Name</label>
              <input
                type="text"
                name="firstName"
                
            
                className="w-full p-2 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Last Name</label>
              <input
                type="text"
                name="lastName"
        
                className="w-full p-2 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Email</label>
              <input
                type="email"
                name="email"
                className="w-full p-2 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Date of Birth</label>
              <input
                type="date"
                name="dob"
                className="w-full p-2 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Roll Number</label>
              <input
                type="text"
                name="rollNumber"
                className="w-full p-2 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Phone</label>
              <input
                type="tel"
                name="mobile"
                className="w-full p-2 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Course</label>
              <input
                type="text"
                name="course"
                className="w-full p-2 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed"
              />
            </div>
          </div>
        </div>
      </div>
    );
  };

export default AddUsers