import React, { useState } from "react";
import { Message, Logout } from "iconsax-react";

const Navbar = ({ userData, setUserData, signout, isSidebarOpen }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleLogout = () => {
    setDropdownOpen(false);
    setUserData({ firstName: "", lastName: "", email: "", dob: "", rollNumber: "", mobile: "", course: "", photo: "" });
    signout();
  };

  return (
    <div className={`fixed top-0 right-0 left-0 z-40 flex justify-between items-center h-16 bg-white shadow-md border-b-2 border-gray-200 px-4 transition-all duration-300 ${isSidebarOpen ? 'pl-16 lg:pl-64' : 'pl-16'}`}>
      <div className="flex-grow"></div>

      <div className="flex items-center space-x-4 relative">
        <button className="relative p-2">
          <Message size="24" variant="Bold" className="text-blue-600" />
          <span className="absolute top-0.5 right-0.5 w-2 h-2 bg-red-600 rounded-full"></span>
        </button>

        <div className="flex items-center space-x-3 cursor-pointer" onClick={toggleDropdown}>
          <div className="text-right hidden sm:block">
            <div className="font-medium text-gray-800 text-base">{userData?.firstName} {userData?.lastName}</div>
            <div className="text-sm text-gray-500">{userData?.email}</div>
          </div>

          <div className="relative">
            {userData?.photo ? (
              <img src={userData.photo} alt="Profile" className="w-10 h-10 rounded-full object-cover border-2 border-gray-300" />
            ) : (
              <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center border-2 border-gray-300">
                <span className="text-gray-500 text-base">?</span>
              </div>
            )}

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
