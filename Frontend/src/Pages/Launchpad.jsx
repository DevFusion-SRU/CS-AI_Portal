import React, { useEffect, useState, useCallback, useRef } from "react";

const Launchpad = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [viewingJobId, setViewingJobId] = useState(null); // Tracks which job's confirmation is shown

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
      const response = await fetch(
        `http://localhost:5000/api/jobs?page=${page}&limit=10&type=${activeTab}`
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
    .filter((opportunity) =>
      activeTab === "all" || opportunity.type === activeTab
    )
    .filter((opportunity) => {
      const description = opportunity.description
        ? opportunity.description.toLowerCase()
        : "";
      return description.includes(searchQuery.toLowerCase());
    });

  const handleViewClick = (jobId) => {
    setViewingJobId(viewingJobId === jobId ? null : jobId);
  };

  const handleConfirm = async (job) => {
    try {
      const response = await fetch("http://localhost:5000/api/students", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(job),
      });
      if (response.ok) {
        alert("Job application submitted successfully!");
      } else {
        alert("Failed to submit job application.");
      }
    } catch (error) {
      console.error("Error submitting job application:", error);
    }
  };

  return (
    <main className="w-full flex flex-col items-center px-4 py-8">
      <section className="w-full max-w-6xl">
        <div className="flex justify-start space-x-8 mb-4 border-b border-gray-200">
          {[
            { id: "all", label: "All Opportunities" },
            { id: "Fulltime", label: "Jobs" },
            { id: "Internship", label: "Internships" },
            { id: "Hackathon", label: "Hackathons" },
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

        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="overflow-x-auto bg-white shadow-md rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Description
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Job ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Type
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
                        {opportunity.description}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {opportunity.id}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {opportunity.type}
                      </td>
                      <td className="px-6 py-4">
                        <a
                          href="https://github.com/sairamarapu"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-blue-500 text-white py-2 px-4 rounded-lg text-sm hover:bg-blue-600 transition-all"
                          onClick={() => handleViewClick(opportunity.id)}
                        >
                          View
                        </a>
                      </td>
                    </tr>
                    {viewingJobId === opportunity.id && (
                      <tr className="w-full flex justify-center">
                        <td colSpan={4} className="px-6 py-4 bg-gray-50">
                          <p>Did you apply for this job?</p>
                          <button
                            className="bg-green-500 text-white py-1 px-4 rounded-lg mr-4 hover:bg-green-600"
                            onClick={() => handleConfirm(opportunity)}
                          >
                            Yes
                          </button>
                          <button
                            className="bg-red-500 text-white py-1 px-4 rounded-lg hover:bg-red-600"
                            onClick={() => setViewingJobId(null)}
                          >
                            No
                          </button>
                        </td>
                      </tr>
                    )}
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

export default Launchpad;
