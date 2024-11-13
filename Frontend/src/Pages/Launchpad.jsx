import React, { useEffect, useState, useCallback, useRef } from "react";

const Launchpad = () => {
  const tabs = ["all", "Jobs", "Internship", "Hackathons"];
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const hasFetchedData = useRef(false);

  const openTab = (tab) => {
    if (activeTab !== tab) {
      setActiveTab(tab);
      setCurrentPage(1);
    }
  };

  const fetchAPI = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:5000/api/jobs?page=${page}&limit=10&type=${activeTab}`);
      const json = await response.json();
      if (json.success && Array.isArray(json.data)) {
        setOpportunities(json.data);
        setTotalPages(json.totalPages);
        setCurrentPage(json.currentPage);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
    setLoading(false);
  }, [activeTab]);

  useEffect(() => {
    if (hasFetchedData.current) {
      fetchAPI(currentPage);
    } else {
      hasFetchedData.current = true;
    }
  }, [fetchAPI, currentPage]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const filteredOpportunities = opportunities
    .filter((opportunity) => activeTab === "all" || opportunity.type === activeTab)
    .filter((opportunity) => {
      const description = opportunity.description ? opportunity.description.toLowerCase() : "";
      return description.includes(searchQuery.toLowerCase());
    });

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      
      <main className="w-full flex flex-col items-start px-8 py-8">
        <section className="w-full max-w-7xl">
          <div className="flex justify-start mb-6 relative overflow-x-auto">
            <ul className="list-none flex space-x-4 p-0 border-b border-gray-200 relative">
              {tabs.map((tab) => (
                <li
                  key={tab}
                  onClick={() => openTab(tab)}
                  className="cursor-pointer relative transition-all duration-300"
                >
                  <span
                    className={`py-2 px-4 sm:px-6 text-sm sm:text-base md:text-lg font-medium ${
                      activeTab === tab ? "text-blue-600" : "text-gray-600"
                    } hover:text-blue-600`}
                    style={{ transition: "all 0.3s ease" }}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </span>
                  {activeTab === tab && (
                    <span
                      className="absolute left-0 bottom-0 h-0.5 w-full bg-blue-600 transition-all duration-500"
                      style={{
                        transform: "scaleX(1)",
                        height:"5px",
                        borderTopLeftRadius: "8px",
                        borderTopRightRadius:"8px",
                        transition: "transform 0.5s ease",
                      }}
                    ></span>
                  )}
                </li>
              ))}
            </ul>
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
                      <td className="px-6 py-4 text-sm text-gray-500">{opportunity.id}</td>
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
