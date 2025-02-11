import React, { useState } from "react";
import { Message, Logout } from "iconsax-react";

const Navbar = ({ userData, setUserData, signout, isSidebarOpen }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Toggle dropdown menu
  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  // Logout function
  const handleLogout = () => {
    setDropdownOpen(false); // Close dropdown
    setUserData({ firstName: "", lastName: "", email: "", dob: "", rollNumber: "", mobile: "", course: "", photo: "" });
    signout(); // Call the signout function to log out the user
  };

  return (
    <div className={`fixed top-0 right-0 left-0 z-40 flex justify-between items-center h-20 bg-white shadow-md border-b-2 border-gray-200 px-6 transition-all duration-300 ${isSidebarOpen ? 'pl-64' : 'pl-20'}`}>
      {/* Spacer to push icons to the right */}
      <div className="flex-grow"></div>

      {/* Right Side of Navbar */}
      <div className="flex items-center space-x-4 relative">
        {/* Message Icon */}
        <button className="relative p-2">
          <Message size="24" variant="Bold" className="text-blue-600" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-600 rounded-full"></span>
        </button>

        {/* User Info & Profile Image */}
        <div className="flex items-center space-x-3 cursor-pointer" onClick={toggleDropdown}>
          <div className="text-right">
            <div className="font-medium text-gray-800">{userData?.firstName} {userData?.lastName}</div>
            <div className="text-sm text-gray-500">{userData?.email}</div>
          </div>

          {/* Profile Image */}
          <div className="relative">
            {userData?.photo ? (
              <img src={userData.photo} alt="Profile" className="w-10 h-10 rounded-full object-cover border-2 border-gray-300" />
            ) : (
              <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center border-2 border-gray-300">
                <span className="text-gray-500">?</span>
              </div>
            )}

            {/* Dropdown Menu */}
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                <button onClick={handleLogout} className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 w-full">
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
