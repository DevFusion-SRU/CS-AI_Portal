import React, { useEffect, useState, useCallback, useRef } from "react";
import { useAuth } from "../Context/AuthContext";

const Reports = () => {
  const [activeTab, setActiveTab] = useState("applied");
  const [searchQuery, setSearchQuery] = useState("");
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { currentUser, BASE_URL } = useAuth();

  const openTab = (tab) => {
    if (activeTab !== tab) {
      setActiveTab(tab);
      setCurrentPage(1);
    }
  };

  const fetchAPI = useCallback(
    async (page = 1) => {
      setLoading(true);
      console.log(`${BASE_URL}appliedJobs/student/${currentUser.username}?page=${page}&limit=10`)
      try {
        const response = await fetch(
          `${BASE_URL}appliedJobs/student/${currentUser.username}?page=${page}&limit=10`,
          {
            method: "GET",
            headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
            credentials: "include",
          })
        const json = await response.json();
        if (json.success && Array.isArray(json.data)) {
          setOpportunities(json.data);
          console.log(json.data)
          setTotalPages(json.totalPages);
          setCurrentPage(json.currentPage);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
      setLoading(false);
    },
    [activeTab, currentUser, currentPage]
  );

  useEffect(() => {
    
      fetchAPI(currentPage);
    
  }, [fetchAPI, currentPage]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const filteredOpportunities = opportunities
    .filter((opportunity) =>
      activeTab === "applied" || opportunity.status === activeTab
    )
    .filter((opportunity) => {
      const description = opportunity.description
        ? opportunity.description.text.toLowerCase()
        : "";
      return description.includes(searchQuery.toLowerCase());
    });

  return (
    <main className="w-full flex flex-col items-center px-4 py-8">
      <section className="w-full max-w-6xl">
        <div className="flex justify-start space-x-8 mb-4 border-b border-gray-200">
          {[
            { id: "applied", label: "Applied Jobs" },
            { id: "selected", label: "Selected" },
            { id: "shortlisted", label: "Shortlisted" },
            { id: "rejected", label: "Rejected" },
          ].map((tab) => (
            <button
              key={tab.id}
              className={`pb-2 text-sm font-medium transition-colors duration-200 ${
                activeTab === tab.id
                  ? "text-blue-600 border-b-2 border-blue-600 font-semibold"
                  : "text-gray-500 hover:text-blue-600"
              }`}
              onClick={() => openTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="mb-4">
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="w-full p-2 border border-gray-300 rounded-lg"
          />
        </div>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="overflow-x-auto bg-white shadow-md rounded-2xl">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Company
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Job ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    View
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredOpportunities.map((opportunity) => (
                  <React.Fragment key={opportunity.jobId}>
                    <tr className="hover:bg-gray-50 transition-all">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        {opportunity.company}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {opportunity.jobId}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {opportunity.title}
                      </td>
                      <td className="px-6 py-4">
                        <button
                          className="bg-blue-500 text-white py-2 px-4 rounded-lg text-sm hover:bg-blue-600 transition-all"
                        >
                          Applied
                        </button>
                      </td>
                    </tr>
                    
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        )}

<div className="flex justify-center items-center space-x-2 mt-6">
          {/* First Page Button */}
          <button
            onClick={() => setCurrentPage(1)}
            disabled={currentPage === 1}
            className={`px-4 py-2 rounded-md shadow text-sm font-medium transition-colors ${currentPage === 1
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800"
              }`}
          >
            First
          </button>

          {/* Previous Page Button */}
          {currentPage-1 > 1 && (
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 2, 1))}
              className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-md shadow text-sm font-medium hover:from-blue-600 hover:to-blue-700 transition-colors"
            >
              {currentPage - 2}
            </button>
          )}

          {currentPage > 1 && (
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              className={`px-4 py-2 rounded-md shadow text-sm font-medium transition-colors ${currentPage === 1
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800"
                }`}>
              {currentPage - 1}
            </button>
          )}

          {/* Current Page Input */}
          <button
            className="w-16 text-center py-2 border border-gray-300 rounded-md shadow focus:ring-blue-500 focus:border-blue-500 text-sm"
          >
            
            {currentPage}
           
            
            
          </button>

          {/* Next Page Button */}
          {currentPage < totalPages && (
            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-md shadow text-sm font-medium hover:from-blue-600 hover:to-blue-700 transition-colors"
            >
              {currentPage + 1}
            </button>
          )}


          {currentPage < totalPages-1 && (
            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 2, totalPages))}
              className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-md shadow text-sm font-medium hover:from-blue-600 hover:to-blue-700 transition-colors"
            >
              {currentPage + 2}
            </button>
          )}

          {/* Last Page Button */}
          <button
            onClick={() => setCurrentPage(totalPages)}
            disabled={currentPage === totalPages}
            className={`px-4 py-2 rounded-md shadow text-sm font-medium transition-colors ${currentPage === totalPages
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800"
              }`}
          >
            Last
          </button>
        </div>
      </section>
    </main>
  );
};

export default Reports;
