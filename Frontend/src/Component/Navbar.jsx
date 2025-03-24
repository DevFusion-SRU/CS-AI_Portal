import React, { useState, useEffect, useRef } from "react";
import { Message, Logout, User, Heart, UserAdd, Additem } from "iconsax-react"; // Added Plus for staff options
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";
import { User2 } from "lucide-react";

const Navbar = ({ userData, setUserData, isSidebarOpen, setIsSidebarOpen }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const { signout, currentUserRole } = useAuth();
  const dropdownRef = useRef(null);
  

  // Toggle dropdown
  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    if (dropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownOpen]);

  // Navigation handlers
  const handleViewProfile = () => {
    setDropdownOpen(false);
    navigate("/myaccount");
  };

  const handleViewSavedJobs = () => {
    setDropdownOpen(false);
    navigate("/saved-jobs");
  };

  const handleAddJobs = () => {
    setDropdownOpen(false);
    navigate("/addjobs"); // Navigate to add jobs page
  };

  const handleAddStudents = () => {
    setDropdownOpen(false);
    navigate("/addusers"); // Navigate to add students page
  };

  const handleLogout = async () => {
    try {
      setDropdownOpen(false);
      setUserData({
        firstName: "",
        lastName: "",
        email: "",
        dob: "",
        rollNumber: "",
        mobile: "",
        course: "",
        photo: "",
      });
      await signout();
      navigate("/login", { replace: true });
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  console.log("Current user role:", currentUserRole);
  return (
    <div
      className={`fixed top-0 right-0 z-40 flex justify-between items-center h-16 bg-white shadow-md border-b-2 border-gray-200 px-4 transition-all duration-300 w-full ${
        isSidebarOpen ? "sm:pl-64 lg:pl-64 pl-16" : "sm:pl-20 lg:pl-20 pl-10"
      }`}
    >
      {/* Hamburger Menu for Mobile */}
      <div className="sm:hidden flex items-center">
        <button onClick={toggleSidebar} className="p-2">
          <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
          </svg>
        </button>
      </div>

      <div className="flex-grow"></div>

      <div className="flex items-center space-x-4 relative">
        <button className="relative p-2">
          <Message size="24" variant="Bold" className="text-blue-600" />
          <span className="absolute top-0.5 right-0.5 w-2 h-2 bg-red-600 rounded-full"></span>
        </button>

        <div ref={dropdownRef} className="flex items-center space-x-3 cursor-pointer">
          <div className="text-right hidden lg:block" onClick={toggleDropdown}>
            <div className="font-medium text-gray-800 text-base">
              {userData?.firstName} {userData?.lastName}
            </div>
            <div className="text-sm text-gray-500">{userData?.email}</div>
          </div>

          <div className="relative" onClick={toggleDropdown}>
            {userData?.photo ? (
              <img
                src={userData.photo}
                alt="Profile"
                className="w-10 h-10 rounded-full object-cover border-2 border-gray-300"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center border-2 border-gray-300">
                <span className="text-gray-500 text-base">?</span>
              </div>
            )}

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                {/* Common option for both roles */}
                <button
                  onClick={handleViewProfile}
                  className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 w-full text-left"
                >
                  <User size="20" className="mr-2 text-blue-500" />
                  View Profile
                </button>

                {/* Conditional options based on role */}
                {currentUserRole === "student" ? (
                  <button
                    onClick={handleViewSavedJobs}
                    className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 w-full text-left"
                  >
                    <Heart size="20" className="mr-2 text-green-500" />
                    Saved Jobs
                  </button>
                ) : currentUserRole === "staff" ? (
                  <>
                    <button
                      onClick={handleAddJobs}
                      className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 w-full text-left"
                    >
                      <Additem size="20" className="mr-2 text-green-500" />
                      Add Jobs
                    </button>
                    <button
                      onClick={handleAddStudents}
                      className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 w-full text-left"
                    >
                      <UserAdd size="20" className="mr-2 text-green-500" />
                      Add Students
                    </button>
                  </>
                ) : null}

                {/* Common option for both roles */}
                <button
                  onClick={handleLogout}
                  className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 w-full text-left"
                >
                  <Logout size="20" className="mr-2 text-red-500" />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;