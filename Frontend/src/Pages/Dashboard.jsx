import React, { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContect";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { currentUserRole } = useAuth(); // Tracks the current user role
  const navigate = useNavigate();
  const hasFetchedData = useRef(false);

  const handleAddClick = () => {
    navigate("Addjobs"); // Redirect to AddJobs page
  };

  const openTab = (tab) => {
    if (activeTab !== tab) {
      setActiveTab(tab);
      setCurrentPage(1);
    }
  };

  const fetchAPI = useCallback(async (page = 1) => {
    setLoading(true); // Start loading state
    try {
      const response = await fetch(
        `http://localhost:5000/api/appliedJobs/allDetails`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const json = await response.json();
      console.log("Data received from API:", json.data);

      if (json.success && Array.isArray(json.data)) {
        setOpportunities(json.data);
        setTotalPages(json.totalPages || 1);
        setCurrentPage(json.currentPage || 1);
      } else {
        console.error("Unexpected data format:", json);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false); // End loading state
    }
  }, []);

  useEffect(() => {
    if (hasFetchedData.current) {
      fetchAPI(currentPage);
    } else {
      hasFetchedData.current = true;
    }
  }, [fetchAPI, currentPage]);

  const filteredOpportunities = opportunities.filter((opportunity) =>
    activeTab === "all" || opportunity.jobDetails.type === activeTab
  );

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
        {currentUserRole === "admin" && (
          <div className="flex justify-end space-x-4 mb-5">
            <button
              onClick={handleAddClick}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-md shadow hover:bg-blue-600"
            >
              Add
            </button>
          </div>
        )}

        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="overflow-x-auto bg-gradient-to-r from-blue-50 to-purple-50 shadow-lg rounded-lg p-6 border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Company
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Job ID
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                    Visits
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                    Applications
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredOpportunities.map((opportunity) => (
                  <tr
                    key={opportunity.jobDetails._id}
                    className="hover:bg-gray-100 transition-all"
                  >
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {opportunity.jobDetails.company}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {opportunity.jobDetails.name}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {opportunity.jobDetails.id}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button className="w-24 py-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-sm font-medium rounded-lg shadow-md">
                        Visits: {opportunity.viewedStudentsCount}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button className="w-24 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-sm font-medium rounded-lg shadow-md">
                        Applied: {opportunity.appliedStudentsCount}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        
      </section>
    </main>
  );
};

export default Dashboard;