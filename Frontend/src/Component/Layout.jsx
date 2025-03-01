import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

const Layout = ({ userData, setUserData }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Closed by default on mobile

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <Sidebar
        userData={userData}
        setUserData={setUserData}
        setIsSidebarOpen={setIsSidebarOpen}
        isSidebarOpen={isSidebarOpen}
      />

      {/* Content Area */}
      <div
        className={`flex-1 flex flex-col transition-all duration-300 ${
          isSidebarOpen ? 'ml-0 sm:ml-64 lg:ml-64' : 'ml-0 sm:ml-20 lg:ml-20'
        }`}
      >
        <Navbar
          userData={userData}
          setUserData={setUserData}
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 mt-16 overflow-y-auto">
          <Outlet />
        </main>
      </div>

      {/* Backdrop for mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 sm:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default Layout;