import React, { useState } from "react";
import Navbar from "../component/Navbar"; // Import your Navbar component
import "./profile.css"; // Create a separate CSS file for MyAccount styles

const MyAccount = () => {
  const [activeTab, setActiveTab] = useState("editProfile");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // State for sidebar

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div>
      <Navbar /> {/* Navbar is fixed at the top */}
      <div className="container">
        {/* Toggle button for sidebar (visible on small screens) */}
        <button className="menu-btn" onClick={toggleSidebar}>
          ☰ Menu
        </button>

        {/* Sidebar */}
        <aside className={`sidebar ${isSidebarOpen ? "open" : ""}`}>
          <nav>
            <ul>
              <li>
                <a href="#">Dashboard</a>
              </li>
              <li>
                <a href="#">Launchpad</a>
              </li>
              <li>
                <a href="#">My Reports</a>
              </li>
              <li>
                <a href="#" className="active">
                  My Account
                </a>
              </li>
              <li>
                <a href="#">Settings</a>
              </li>
            </ul>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="account-content">
          <div className="account-header">
            <h1>Settings</h1>
            <div className="tabs">
              <button
                className={activeTab === "editProfile" ? "active" : ""}
                onClick={() => setActiveTab("editProfile")}
              >
                Edit Profile
              </button>
              <button
                className={activeTab === "security" ? "active" : ""}
                onClick={() => setActiveTab("security")}
              >
                Security
              </button>
            </div>
          </div>

          {activeTab === "editProfile" && (
            <section className="profile-section">
              <div className="profile-picture">
                <img
                  src="user-avatar.png"
                  alt="Profile"
                  className="profile-img"
                />
                <button className="edit-button">✎</button>
              </div>
              <div className="profile-form">
                <form>
                  <div className="form-group">
                    <label>Your Name</label>
                    <input type="text" value="Charlene Reed" />
                  </div>
                  <div className="form-group">
                    <label>User Name</label>
                    <input type="text" value="Charlene Reed" />
                  </div>
                  <div className="form-group">
                    <label>Email</label>
                    <input type="email" value="charlenereed@gmail.com" />
                  </div>
                  <div className="form-group">
                    <label>Password</label>
                    <input type="password" value="**********" />
                  </div>
                  <div className="form-group">
                    <label>Date of Birth</label>
                    <input type="text" value="25 January 1990" />
                  </div>
                  <div className="form-group">
                    <label>Hallticket Number</label>
                    <input type="text" value="2103A50000" />
                  </div>
                  <div className="form-group">
                    <label>PAN</label>
                    <input type="text" value="ABCD9876EF" />
                  </div>
                  <div className="form-group">
                    <label>Aadhar</label>
                    <input type="text" value="1111-0000-2222" />
                  </div>
                  <div className="form-group">
                    <label>Mentor</label>
                    <input type="text" value="Prof. John Smith" />
                  </div>
                  <div className="form-group">
                    <label>Phone</label>
                    <input type="text" value="+91-XXXXX-XXXXX" />
                  </div>
                  <button type="submit" className="save-btn">
                    Save
                  </button>
                </form>
              </div>
            </section>
          )}

          {activeTab === "security" && (
            <section className="security-section">
              <h2>Security Settings</h2>
              {/* Add your security content here */}
            </section>
          )}
        </main>
      </div>
    </div>
  );
};

export default MyAccount;