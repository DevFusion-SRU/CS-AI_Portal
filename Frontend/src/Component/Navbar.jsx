import React, { useEffect } from "react";



const Navbar = ({ userData }) => {
  useEffect(()=>{

  },[userData.photo])
  return (
    <div className="flex justify-between items-center w-full h-20 bg-white shadow-md border-b-2 border-gray-200 px-4">
      <div className="text-lg font-semibold">One stop for All Searching</div>

      {/* Right Side of Navbar (User Photo & Update Button) */}
      <div className="flex items-center space-x-4">
        {/* Profile Image Section */}
        <div className="relative">
          {userData?.photo ? ( // Fix: Correct syntax for conditional rendering
            <img
              src={userData.photo}
              alt="Profile"
              className="w-10 h-10 rounded-full object-cover border-2 border-gray-300"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center border-2 border-gray-300">
              <span className="text-white">?</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
