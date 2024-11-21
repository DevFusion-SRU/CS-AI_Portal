import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

const Layout = ({ userPhoto }) => {
  return (
    <div className="flex flex- md:flex-row">
    {/* Sidebar */}
    <Sidebar userPhoto={userPhoto} />
    
    {/* Content Area */}
    <div className="flex-1 md:ml-48 mt-20 md:mt-0">{/* Add margin on large screens */}
      <div className='hidden md:block'>
        <Navbar userPhoto={userPhoto}  />
      </div>
      <Outlet/>
    </div>
  </div> 
  );
};

export default Layout;
