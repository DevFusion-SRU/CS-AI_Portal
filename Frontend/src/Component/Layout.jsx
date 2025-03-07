import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

const Layout = ({ userData, setUserData }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <Sidebar userData={userData} setUserData={setUserData} setIsSidebarOpen={setIsSidebarOpen} />

      {/* Content Area */}
      <div className={`flex-1 flex flex-col transition-all duration-300 ${isSidebarOpen ? 'ml-16 lg:ml-64' : 'ml-20'}`}>
        <Navbar userData={userData} setUserData={setUserData} isSidebarOpen={isSidebarOpen} />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 mt-16 lg:mt-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;