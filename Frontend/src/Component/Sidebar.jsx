import React, { useState } from 'react';
import Dashboard from '../assets/Dashboard.png';
import launchpad from '../assets/launchpad.png';
import MyAccount from '../assets/MyAccount.png';
import MyReports from '../assets/MyReports.png';
import Settings from '../assets/Settings.png';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../Context/AuthContect';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const {signout}=useAuth()

  const handleMenuClick = (index) => {
    setActiveIndex(index); 
  };

  return (
    <>
      <div className="md:hidden flex items-center justify-between p-4 bg-white fixed top-0 left-0 w-full z-50 shadow-md space-x-4">
        {/* Sidebar Menu Button */}
        <button
          className="p-4 bg-blue-600 text-white"
          onClick={() => setIsOpen((isOpen) => !isOpen)}
        >
          {/* Hamburger icon */}
          <div className="space-y-1">
            <span className="block w-6 h-0.5 bg-white"></span>
            <span className="block w-6 h-0.5 bg-white"></span>
            <span className="block w-6 h-0.5 bg-white"></span>
          </div>
        </button>

        {/* Title next to the menu button on small screens */}
        <div className="text-2xl font-bold text-blue-600">
          SRU <span className="text-xs">CS-AI</span>
        </div>
        <div> navbar</div>
      </div>

      {/* Sidebar */}
      <aside
        className={`w-48 h-screen bg-white shadow-md p-6 fixed z-40 border-r-2 border-gray-200 transition-transform transform ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="text-2xl font-bold text-blue-600 mb-9">
          SRU <span className="text-xs md:inline hidden">CS-AI</span>
        </div>

        {/* Sliding Pointer */}
        <div
          className="absolute left-0 w-1 mt-16 rounded-md bg-blue-600 transition-all duration-300"
          style={{ top: `${activeIndex * 43 + 25}px`, height: '35px' }} 
        ></div>

        <nav className="space-y-5">
          <ul className="items-start space-y-6 font-medium">
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                `flex items-center space-x-3 ${isActive ? 'text-blue-600' : 'text-gray-600'}` 
              }
              onClick={() => handleMenuClick(0)}
            >
              <img src={Dashboard} alt="Dashboard" />
              <li className="text-sm">Dashboard</li>
            </NavLink>

            <NavLink
              to="/launchpad"
              className={({ isActive }) =>
                `flex items-center space-x-3 ${isActive ? 'text-blue-600' : 'text-gray-600'}` 
              }
              onClick={() => handleMenuClick(1)}
            >
              <img src={launchpad} alt="Launchpad" />
              <li className="text-sm">Launchpad</li>
            </NavLink>

            <NavLink
              to="/myreports"
              className={({ isActive }) =>
                `flex items-center space-x-3 ${isActive ? 'text-blue-600' : 'text-gray-600'}` 
              }
              onClick={() => handleMenuClick(2)}
            >
              <img src={MyReports} alt="My Reports" />
              <li className="text-sm">My reports</li>
            </NavLink>

            <NavLink
              to="/myaccount"
              className={({ isActive }) =>
                `flex items-center space-x-3 ${isActive ? 'text-blue-600' : 'text-gray-600'}` 
              }
              onClick={() => handleMenuClick(3)}
            >
              <img className="w-100 h-min" src={MyAccount} alt="My Account" />
              <li className="text-sm">My account</li>
            </NavLink>

            <NavLink
              to="/settings"
              className={({ isActive }) =>
                `flex items-center space-x-3 ${isActive ? 'text-blue-600' : 'text-gray-600'}` 
              }
              onClick={() => handleMenuClick(4)}
            >
              <img src={Settings} alt="Settings" />
              <li className="text-sm">Settings</li>
            </NavLink>
          </ul>
        </nav>
        <button
            onClick={() => signout()} // Replace with your actual logout function
            className="flex items-center space-x-3 mt-56 text-gray-500 hover:text-red-600"
          >
            <div>🔴</div>
            <span className="text-sm">Logout</span>
          </button>
      </aside>

      {/* Overlay to close the sidebar on smaller screens */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-30"
          onClick={() => setIsOpen(false)}
        ></div>
      )}
    </>
  );
};

export default Sidebar;
