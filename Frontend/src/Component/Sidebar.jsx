import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";
import { Home2, TrendUp, Personalcard, Profile, Logout, ArrowSquareLeft, HambergerMenu } from "iconsax-react";

const Sidebar = ({ setUserData, setIsSidebarOpen }) => {
  const [isOpen, setIsOpen] = useState(true);
  const { signout, currentUserRole } = useAuth();

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
    setIsSidebarOpen(!isOpen); // Update navbar padding dynamically
  };

  const menuItems = [
    { name: currentUserRole === "student" ? "My Reports" : "Dashboard", icon: <Home2 size="24" variant="Linear" />, path: currentUserRole === "student" ? "/myreports" : "/dashboard" },
    { name: "Launchpad", icon: <TrendUp size="24" variant="Linear" />, path: "/" },
    { name: "My Applications", icon: <Personalcard size="24" variant="Linear" />, path: "/usermanagement" },
    { name: "My Account", icon: <Profile size="24" variant="Linear" />, path: "/myaccount" },
  ];

  return (
    <div className={`fixed top-0 left-0 z-50 h-screen p-4 bg-gray-800 text-white flex flex-col transition-all duration-500 ease-in-out ${isOpen ? "w-64" : "w-20"}`}>
      <div className="flex items-center justify-between mb-6">
        {isOpen && (
          <div className="flex items-center justify-center cursor-pointer text-blue-400">
            <span className="text-3xl font-bold font-Inter">SRU</span>
            <span className="mt-2.5 ml-1 text-sm font-Inter font-normal">CS-AI</span>
          </div>
        )}
        <div className="flex items-center p-3 rounded-lg cursor-pointer" onClick={toggleSidebar}>
          {isOpen ? <ArrowSquareLeft size="24" variant="Linear" /> : <HambergerMenu size="24" variant="Linear" />}
        </div>
      </div>

      <nav className="flex-1">
        {menuItems.map((item, index) => (
          <NavLink
            key={index}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center p-3 my-2 rounded-lg hover:bg-blue-400 cursor-pointer ${isOpen ? "justify-start" : "justify-center"} ${isActive ? "bg-blue-700" : ""}`
            }
          >
            {item.icon}
            {isOpen && <span className="ml-4 text-lg">{item.name}</span>}
          </NavLink>
        ))}
      </nav>

      <div
        className="flex items-center p-3 mt-auto rounded-lg hover:bg-red-500 cursor-pointer"
        onClick={() => {
          setUserData({ firstName: "", lastName: "", email: "", dob: "", rollNumber: "", mobile: "", course: "", photo: "" });
          signout();
        }}
      >
        <Logout size="24" variant="Linear" />
        {isOpen && <span className="ml-4 text-lg">Logout</span>}
      </div>
    </div>
  );
};

export default Sidebar;
