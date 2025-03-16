import React from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";
import { Home2, TrendUp, Personalcard, Profile, Logout, ArrowSquareLeft, HambergerMenu, User, Messages3 } from "iconsax-react"; 

const Sidebar = ({ setUserData, setIsSidebarOpen, isSidebarOpen }) => {
  const { signout, currentUserRole } = useAuth();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div
      className={`fixed top-0 left-0 z-50 h-screen p-4 bg-gray-800 text-white flex flex-col transition-all duration-500 ease-in-out ${
        isSidebarOpen ? 'w-64' : 'w-20 sm:w-20 lg:w-20'
      } ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full sm:translate-x-0'}`}
    >
      <div className="flex items-center justify-between mb-6">
        {isSidebarOpen && (
          <div className="flex ml-10 items-center justify-center cursor-pointer text-blue-400">
            <span className="text-3xl font-extrabold font-Inter">SRU</span>
            <span className="mt-2.5 ml-1 text-sm font-Inter font-normal">CS-AI</span>
          </div>
        )}
        <div className="flex items-center p-3 rounded-lg cursor-pointer" onClick={toggleSidebar}>
          {isSidebarOpen ? <ArrowSquareLeft size="24" variant="Linear" /> : <HambergerMenu size="24" variant="Linear" />}
        </div>
      </div>

      <nav className="flex-1">
        <NavLink
          to={currentUserRole === "student" ? "/myreports" : "/dashboard"}
          className={({ isActive }) =>
            `flex items-center p-3 my-2 rounded-lg hover:bg-blue-400 cursor-pointer ${
              isSidebarOpen ? "justify-start" : "justify-center"
            } ${isActive ? "bg-blue-700" : ""}`
          }
        >
          <Home2 size="24" variant="Linear" />
          {isSidebarOpen && <span className="ml-4 text-lg">Dashboard</span>}
        </NavLink>

        <NavLink
          to="/"
          className={({ isActive }) =>
            `flex items-center p-3 my-2 rounded-lg hover:bg-blue-400 cursor-pointer ${
              isSidebarOpen ? "justify-start" : "justify-center"
            } ${isActive ? "bg-blue-700" : ""}`
          }
        >
          <TrendUp size="24" variant="Linear" />
          {isSidebarOpen && <span className="ml-4 text-lg">Launchpad</span>}
        </NavLink>

        <NavLink
          to="/usermanagement"
          className={({ isActive }) =>
            `flex items-center p-3 my-2 rounded-lg hover:bg-blue-400 cursor-pointer ${
              isSidebarOpen ? "justify-start" : "justify-center"
            } ${isActive ? "bg-blue-700" : ""}`
          }
        >
          {currentUserRole === "staff" ? <Personalcard size="24" variant="Linear" /> : <Personalcard size="24" variant="Linear" />}
          {isSidebarOpen && (
            <span className="ml-4 text-lg">{currentUserRole === "staff" ? "User Management" : "My Applications"}</span>
          )}
        </NavLink>

        <NavLink
          to="/myaccount"
          className={({ isActive }) =>
            `flex items-center p-3 my-2 rounded-lg hover:bg-blue-400 cursor-pointer ${
              isSidebarOpen ? "justify-start" : "justify-center"
            } ${isActive ? "bg-blue-700" : ""}`
          }
        >
          <Profile size="24" variant="Linear" />
          {isSidebarOpen && <span className="ml-4 text-lg">My Account</span>}
        </NavLink>
        <NavLink
          to="/discussions"
          className={({ isActive }) =>
            `flex items-center p-3 my-2 rounded-lg hover:bg-blue-400 cursor-pointer ${isSidebarOpen ? "justify-start" : "justify-center"} ${isActive ? "bg-blue-700" : ""}`
          }
        >
          <Profile size="24" variant="Linear" />
          {isSidebarOpen && <span className="ml-4 text-lg">My Account</span>}
        </NavLink>
        <NavLink
          to="/discussions"
          className={({ isActive }) =>
            `flex items-center p-3 my-2 rounded-lg hover:bg-blue-400 cursor-pointer ${isSidebarOpen ? "justify-start" : "justify-center"} ${isActive ? "bg-blue-700" : ""}`
          }
        >
          <Messages3 size="24" variant="Linear" />
          {isSidebarOpen && <span className="ml-4 text-lg">Discussions</span>}
        </NavLink>
      </nav>

      {/* Logout Button */}
      <div
        className="flex items-center p-3 mt-auto rounded-lg hover:bg-red-500 cursor-pointer"
        onClick={() => {
          setUserData({ firstName: "", lastName: "", email: "", dob: "", rollNumber: "", mobile: "", course: "", photo: "" });
          signout();
        }}
      >
        <Logout size="24" variant="Linear" />
        {isSidebarOpen && <span className="ml-4 text-lg">Logout</span>}
      </div>
    </div>
  );
};

export default Sidebar;