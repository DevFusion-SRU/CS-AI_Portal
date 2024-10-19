import React, { useState } from 'react';
import Dashboard from '../assets/Dashboard.png';
import launchpad from '../assets/launchpad.png';
import MyAccount from '../assets/MyAccount.png';
import MyReports from '../assets/MyReports.png';
import Settings from '../assets/Settings.png';
import { NavLink } from 'react-router-dom';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        className="md:hidden p-4 bg-blue-600 text-white fixed top-4 left-4 z-50"
        onClick={() => setIsOpen((isOpen)=>!isOpen)}
      >
        Menu
      </button>

      {/* Sidebar */}
      <aside
        className={`w-48 h-screen bg-white shadow-md p-6 fixed z-40 transition-transform transform ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="text-2xl font-bold text-blue-600 mb-6">
        SRU <span className="text-xs md:inline hidden">CS-AI</span>
        </div>
        <nav className="space-y-4">
          <ul className="items-start space-y-4 font-medium">
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                `flex items-center space-x-2 ${isActive ? 'text-blue-600 border-l-4 border-blue-600' : 'text-gray-600'}`
              }
            >
              <img src={Dashboard} alt="Dashboard" />
              <li>Dashboard</li>
            </NavLink>

            <NavLink
              to="/launchpad"
              className={({ isActive }) =>
                `flex items-center space-x-2 ${isActive ? 'text-blue-600 border-l-4 border-blue-600' : 'text-gray-600'}`
              }
            >
              <img src={launchpad} alt="Launchpad" />
              <li>Launchpad</li>
            </NavLink>

            <NavLink
              to="/myreports"
              className={({ isActive }) =>
                `flex items-center space-x-2 ${isActive ? 'text-blue-600 border-l-4 border-blue-600' : 'text-gray-600'}`
              }
            >
              <img src={MyReports} alt="My Reports" />
              <li>My reports</li>
            </NavLink>

            <NavLink
              to="/myaccount"
              className={({ isActive }) =>
                `flex items-center space-x-2 ${isActive ? 'text-blue-600 border-l-4 border-blue-600' : 'text-gray-600'}`
              }
            >
              <img src={MyAccount} alt="My Account" />
              <li>My account</li>
            </NavLink>

            <NavLink
              to="/settings"
              className={({ isActive }) =>
                `flex items-center space-x-2 ${isActive ? 'text-blue-600 border-l-4 border-blue-600' : 'text-gray-600'}`
              }
            >
              <img src={Settings} alt="Settings" />
              <li>Settings</li>
            </NavLink>
          </ul>
        </nav>
      </aside>

      {/* Backdrop for small screens */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-30 "
          onClick={() => setIsOpen(false)}  // Clicking outside closes the sidebar
        ></div>
      )}
    </>
  );
};

export default Sidebar;
