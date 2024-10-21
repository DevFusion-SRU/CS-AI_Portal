import React from "react";
import "./Navbar.css"; // Create a separate CSS file for navbar styles

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-left">
        <div className="navbar-logo">
          <h2>
            SRU <span>CS-AI</span>
          </h2>
        </div>
      </div>

      <div className="navbar-center">
        <input
          type="text"
          className="navbar-search"
          placeholder="Search for something"
        />
      </div>

      <div className="navbar-right">
        <span className="notification-icon">🔔</span>
        <img
          src="user-avatar.png"
          alt="User Avatar"
          className="navbar-avatar"
        />
      </div>
    </nav>
  );
};

export default Navbar;
