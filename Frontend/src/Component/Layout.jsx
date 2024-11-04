import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

const Layout = () => {
  return (
    <div className="flex flex- md:flex-row">
    {/* Sidebar */}
    <Sidebar />
    
    {/* Content Area */}
    <div className="flex-1 md:ml-48 mt-20 md:mt-0">{/* Add margin on large screens */}
      <div className='hidden md:block'>
        <Navbar />
      </div>
      <Outlet/>
    </div>
  </div> 
  );
};

export default Layout;
