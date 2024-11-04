import React, { useState } from "react";
import Navbar from "../component/Navbar"; // Import Navbar component
import "./Launchpad.css";
const Launchpad = () => {
  // Tabs state
  const [activeTab, setActiveTab] = useState("all");

  // Function to handle tab switching
  const openTab = (tab) => {
    setActiveTab(tab);
  };

  // Sample data for the opportunities
  const opportunities = [
    {
      description: "Smart India Hackathon",
      jobId: "#12548796",
      type: "Hackathon",
      status: "Applied",
      date: "28 Jan, 12:30 AM",
    },
    {
      description: "Software Engineer",
      jobId: "#12548796",
      type: "Internship",
      status: "Not applied",
      date: "25 Jan, 10:40 PM",
    },
    {
      description: "Web Developer",
      jobId: "#12548796",
      type: "Job",
      status: "Applied",
      date: "20 Jan, 10:40 PM",
    },
    {
      description: "Software Developer",
      jobId: "#12548796",
      type: "Internship",
      status: "Not applied",
      date: "15 Jan, 3:29 PM",
    },
    {
      description: "Code Gladiators",
      jobId: "#12548796",
      type: "Hackathon",
      status: "Applied",
      date: "14 Jan, 10:40 PM",
    },
  ];

  return (
    <div className="container">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="logo">
          <h2>
            SRU <span>CS-AI</span>
          </h2>
        </div>
        <nav>
          <ul>
            <li>
              <a href="#">Dashboard</a>
            </li>
            <li>
              <a href="#" className="active">
                Launchpad
              </a>
            </li>
            <li>
              <a href="#">My Reports</a>
            </li>
            <li>
              <a href="#">My Account</a>
            </li>
            <li>
              <a href="#">Settings</a>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main>
        {/* Header */}
        <header>
          <input type="text" placeholder="Search for something" />
          <div className="user-info">
            <span className="notification-icon">🔔</span>
            <img src="user-avatar.png" alt="User Avatar" className="user-avatar" />
          </div>
        </header>

        {/* Content */}
        <section className="launchpad-content">
          <h1>Launchpad</h1>

          {/* Tabs */}
          <div className="tabs">
            <button
              className={`tab-link ${activeTab === "all" ? "active" : ""}`}
              onClick={() => openTab("all")}
            >
              All Opportunities
            </button>
            <button
              className={`tab-link ${activeTab === "jobs" ? "active" : ""}`}
              onClick={() => openTab("jobs")}
            >
              Jobs
            </button>
            <button
              className={`tab-link ${activeTab === "internships" ? "active" : ""}`}
              onClick={() => openTab("internships")}
            >
              Internships
            </button>
            <button
              className={`tab-link ${activeTab === "hackathons" ? "active" : ""}`}
              onClick={() => openTab("hackathons")}
            >
              Hackathons
            </button>
          </div>

          {/* Table */}
          <div className="opportunity-table">
            <table>
              <thead>
                <tr>
                  <th>Description</th>
                  <th>Job ID</th>
                  <th>Type</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Detailed Info</th>
                </tr>
              </thead>
              <tbody>
                {opportunities.map((opportunity, index) => (
                  <tr key={index}>
                    <td>{opportunity.description}</td>
                    <td>{opportunity.jobId}</td>
                    <td>{opportunity.type}</td>
                    <td>{opportunity.status}</td>
                    <td>{opportunity.date}</td>
                    <td>
                      <button className="view-btn">View</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Launchpad;
