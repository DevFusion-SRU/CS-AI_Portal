import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

const Layout = ({ userData, setUserData }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex ">
      <Sidebar userData={userData} setUserData={setUserData} setIsSidebarOpen={setIsSidebarOpen} />
      <div className={`flex-1 flex flex-col transition-all duration-300 ${isSidebarOpen ? 'pl-12 lg:pl-56' : 'pl-12'}`}>
        <Navbar userData={userData} setUserData={setUserData} isSidebarOpen={isSidebarOpen} />

        <main className="p-4 sm:p-6 lg:p-8 mt-16 bg-[#F7F8FA] lg:mt-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;