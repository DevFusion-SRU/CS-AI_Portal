import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

const Layout = ({ userData, setUserData }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen w-full overflow-x-hidden">
      {/* Sidebar */}
      <div className={`${isSidebarOpen ? 'w-64' : 'w-0 sm:w-20'} fixed h-full transition-all duration-300 z-50`}>
        <Sidebar
          userData={userData}
          setUserData={setUserData}
          setIsSidebarOpen={setIsSidebarOpen}
          isSidebarOpen={isSidebarOpen}
        />
      </div>

      {/* Content Area */}
      <div className="flex-1 flex flex-col w-full">
        <Navbar
          userData={userData}
          setUserData={setUserData}
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
        />

        <main className={`flex-1 p-4 sm:p-6 lg:p-8 mt-16 overflow-y-auto transition-all duration-300 ${
          isSidebarOpen ? 'sm:ml-64 lg:ml-64' : 'sm:ml-20 lg:ml-20'
        }`}>
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