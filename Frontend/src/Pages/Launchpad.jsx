import React, { useState } from "react";


const Launchpad = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState(""); // New state for search input
  const itemsPerPage = 5;

  const openTab = (tab) => {
    setActiveTab(tab);
    setCurrentPage(1); // Reset to first page when switching tabs
  };

  const opportunities = [
    // List of 30+ opportunities (example)
    // Add 30 more objects here for testing pagination.
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
    },{
      description: "Code Gladiators",
      jobId: "#12548796",
      type: "Hackathon",
      status: "Applied",
      date: "14 Jan, 10:40 PM",
    },{
      description: "Code Gladiators",
      jobId: "#12548796",
      type: "Hackathon",
      status: "Applied",
      date: "14 Jan, 10:40 PM",
    },{
      description: "Code Gladiators",
      jobId: "#12548796",
      type: "Hackathon",
      status: "Applied",
      date: "14 Jan, 10:40 PM",
    },{
      description: "Code Gladiators",
      jobId: "#12548796",
      type: "Hackathon",
      status: "Applied",
      date: "14 Jan, 10:40 PM",
    },{
      description: "Code Gladiators",
      jobId: "#12548796",
      type: "Hackathon",
      status: "Applied",
      date: "14 Jan, 10:40 PM",
    },{
      description: "Code Gladiators",
      jobId: "#12548796",
      type: "Hackathon",
      status: "Applied",
      date: "14 Jan, 10:40 PM",
    },{
      description: "Code Gladiators",
      jobId: "#12548796",
      type: "Hackathon",
      status: "Applied",
      date: "14 Jan, 10:40 PM",
    },{
      description: "Code Gladiators",
      jobId: "#12548796",
      type: "Hackathon",
      status: "Applied",
      date: "14 Jan, 10:40 PM",
    },{
      description: "Code Gladiators",
      jobId: "#12548796",
      type: "Hackathon",
      status: "Applied",
      date: "14 Jan, 10:40 PM",
    },{
      description: "Code Gladiators",
      jobId: "#12548796",
      type: "Hackathon",
      status: "Applied",
      date: "14 Jan, 10:40 PM",
    },{
      description: "Code Gladiators",
      jobId: "#12548796",
      type: "Hackathon",
      status: "Applied",
      date: "14 Jan, 10:40 PM",
    },{
      description: "Code Gladiators",
      jobId: "#12548796",
      type: "Hackathon",
      status: "Applied",
      date: "14 Jan, 10:40 PM",
    },{
      description: "Code Gladiators",
      jobId: "#12548796",
      type: "Hackathon",
      status: "Applied",
      date: "14 Jan, 10:40 PM",
    },{
      description: "Code Gladiators",
      jobId: "#12548796",
      type: "Hackathon",
      status: "Applied",
      date: "14 Jan, 10:40 PM",
    },
    // Add more opportunities here for pagination
  ];

  // Filter opportunities based on the active tab and search query
  const filteredOpportunities = opportunities.filter((opportunity) => {
    const matchesTab =
      activeTab === "all" || opportunity.type.toLowerCase() === activeTab;
    const matchesSearch = opportunity.description
      .toLowerCase()
      .includes(searchQuery.toLowerCase());

    return matchesTab && matchesSearch;
  });

  // Pagination calculation
  const totalPages = Math.ceil(filteredOpportunities.length / itemsPerPage);
  const currentOpportunities = filteredOpportunities.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      {/* Main Content */}
      <main className="w-full flex flex-col items-center px-4 py-8">
        {/* Header */}
        <header className="w-full flex justify-between items-center py-4 bg-white shadow-md px-6 mb-6">
          {/* Search input */}
          <input
            type="text"
            placeholder="Search for something"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)} // Update searchQuery state
            className="border border-gray-300 rounded-lg p-2 w-full max-w-sm focus:ring-2 focus:ring-blue-500"
          />

          <div className="flex items-center space-x-4">
            <span className="text-2xl cursor-pointer">🔔</span>
            <img
              src="user-avatar.png" // Consider using a dynamic image service or default avatar
              alt="User Avatar"
              className="w-10 h-10 rounded-full"
            />
          </div>
        </header>

        {/* Content */}
        <section className="w-full max-w-6xl">
          <h1 className="text-4xl font-bold text-gray-800 mb-6 text-center">
            Launchpad
          </h1>

          {/* Tabs */}
          <div className="flex justify-center space-x-4 mb-6">
            <button
              className={`py-2 px-6 rounded-full text-sm font-medium transition-all ${
                activeTab === "all"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-600 hover:bg-blue-100"
              }`}
              onClick={() => openTab("all")}
            >
              All Opportunities
            </button>
            <button
              className={`py-2 px-6 rounded-full text-sm font-medium transition-all ${
                activeTab === "jobs"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-600 hover:bg-blue-100"
              }`}
              onClick={() => openTab("jobs")}
            >
              Jobs
            </button>
            <button
              className={`py-2 px-6 rounded-full text-sm font-medium transition-all ${
                activeTab === "internships"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-600 hover:bg-blue-100"
              }`}
              onClick={() => openTab("internships")}
            >
              Internships
            </button>
            <button
              className={`py-2 px-6 rounded-full text-sm font-medium transition-all ${
                activeTab === "hackathons"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-600 hover:bg-blue-100"
              }`}
              onClick={() => openTab("hackathons")}
            >
              Hackathons
            </button>
          </div>

          {/* Table */}
          <div className="overflow-x-auto bg-white shadow-md rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Job ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Detailed Info
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentOpportunities.map((opportunity, index) => (
                  <tr key={index} className="hover:bg-gray-50 transition-all">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {opportunity.description}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {opportunity.jobId}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {opportunity.type}
                    </td>
                    <td
                      className={`px-6 py-4 text-sm font-semibold ${
                        opportunity.status === "Applied"
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {opportunity.status}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {opportunity.date}
                    </td>
                    <td className="px-6 py-4">
                      <button className="bg-blue-500 text-white py-2 px-4 rounded-lg text-sm hover:bg-blue-600 transition-all">
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          <div className="flex justify-center items-center space-x-2 mt-6">
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index}
                className={`py-2 px-4 rounded-lg text-sm font-medium ${
                  currentPage === index + 1
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-600 hover:bg-blue-100"
                }`}
                onClick={() => handlePageChange(index + 1)}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Launchpad;
