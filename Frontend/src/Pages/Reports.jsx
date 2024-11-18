import React, { useEffect, useState, useCallback, useRef } from "react";
import { useAuth } from "../Context/AuthContect";

const Reports = () => {
  const [activeTab, setActiveTab] = useState("applied");
  const [searchQuery, setSearchQuery] = useState("");
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [viewingJobId, setViewingJobId] = useState(null);
  const { currentUser } = useAuth();
  const hasFetchedData = useRef(false);

  const openTab = (tab) => {
    if (activeTab !== tab) {
      setActiveTab(tab);
      setCurrentPage(1);
    }
  };

  const fetchAPI = useCallback(
    async (page = 1) => {
      setLoading(true);
      try {
        const response = await fetch(
          `http://localhost:5000/api/appliedJobs/${currentUser.email.split('@')[0].toUpperCase()}`
        );
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
    },
    [activeTab, currentUser]
  );

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
    .filter((opportunity) =>
      activeTab === "applied" || opportunity.status === activeTab
    )
    .filter((opportunity) => {
      const description = opportunity.description
        ? opportunity.description.toLowerCase()
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
                  <React.Fragment key={opportunity.id}>
                    <tr className="hover:bg-gray-50 transition-all">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        {opportunity.company}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {opportunity.id}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {opportunity.status}
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
  );
};

export default Reports;
