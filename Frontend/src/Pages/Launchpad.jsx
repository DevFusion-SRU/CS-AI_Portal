import React, { useEffect, useState, useCallback, useRef } from "react";

const Launchpad = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Ref to track if the data has been fetched
  const hasFetchedData = useRef(false);

  // Switch tab and reset the page number to 1
  const openTab = (tab) => {
    if (activeTab !== tab) {
      setActiveTab(tab);
      setCurrentPage(1);  // Reset page when changing tab
    }
  };

  // Fetch data only when activeTab or currentPage changes
  const fetchAPI = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:5000/api/jobs?page=${page}&limit=10&type=${activeTab}`);
      const json = await response.json();
      if (json.success && Array.isArray(json.data)) {
        setOpportunities(json.data); // Set the jobs for the current tab (e.g., Fulltime, Hackathons, etc.)
        setTotalPages(json.totalPages); // Update the total pages based on the filtered jobs
        setCurrentPage(json.currentPage); // Update the current page
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
    setLoading(false);
  }, [activeTab]); // Re-run fetchAPI only when activeTab changes

  useEffect(() => {
    if (hasFetchedData.current) {
      fetchAPI(currentPage);
    } else {
      hasFetchedData.current = true;  // Flag to make sure it fetches once initially
    }
  }, [fetchAPI, currentPage]); // Dependency on fetchAPI and currentPage to avoid unnecessary rerenders

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);  // Reset page when search query changes
  };

  const filteredOpportunities = opportunities
    .filter((opportunity) =>
      activeTab === "all" || opportunity.type === activeTab
    )
    .filter((opportunity) => {
      const description = opportunity.description ? opportunity.description.toLowerCase() : "";
      return description.includes(searchQuery.toLowerCase());
    });

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      {/* Main Content */}
      <main className="w-full flex flex-col items-center px-4 py-8">
        <header className="w-full flex justify-between items-center py-4 bg-white shadow-md px-6 mb-6">
          <input
            type="text"
            placeholder="Search for something"
            value={searchQuery}
            onChange={handleSearchChange}
            className="border border-gray-300 rounded-lg p-2 w-full max-w-sm focus:ring-2 focus:ring-blue-500"
          />
        </header>

        <section className="w-full max-w-6xl">
          <div className="flex justify-center space-x-4 mb-6">
            {["all", "Fulltime", "Internship", "Hackathon"].map((tab) => (
              <button
                key={tab}
                className={`py-2 px-6 rounded-full text-sm font-medium ${
                  activeTab === tab
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-600 hover:bg-blue-100"
                }`}
                onClick={() => openTab(tab)}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          {loading ? (
            <p>Loading...</p>
          ) : (
            <div className="overflow-x-auto bg-white shadow-md rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Job ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">View</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredOpportunities.map((opportunity, index) => (
                    <tr key={index} className="hover:bg-gray-50 transition-all">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">{opportunity.description}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">{opportunity.jobId}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">{opportunity.type}</td>
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
          )}

          <div className="flex justify-between mt-4">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-gray-300 rounded-lg disabled:opacity-50"
            >
              Previous
            </button>
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-gray-300 rounded-lg disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Launchpad;
