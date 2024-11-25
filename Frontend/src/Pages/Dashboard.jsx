import React, { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";
import { FaSearch } from "react-icons/fa";


const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { BASE_URL } = useAuth(); // Tracks the current user role
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
        `${BASE_URL}appliedJobs/allDetails`,{
          method:'GET',
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          }
        }

      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const json = await response.json();
      

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


  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };
  
  const filteredOpportunities = opportunities
    .filter(
      (opportunity) => activeTab === "all" || opportunity.type === activeTab
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
          
            <div className="flex justify-end space-x-4 mb-5">
              <div className="flex space-x-4">
                <div className="relative w-full max-w-xs">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={handleSearchChange}
                    placeholder="Search"
                    className="px-4 py-2 w-full border border-gray-300 rounded-md shadow-md focus:ring-2 focus:ring-blue-500 pl-10"
                  />
                  <FaSearch className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-400" />
                </div>
              </div>
    
              <button
                onClick={handleAddClick}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-md shadow hover:bg-blue-600"
              >
                Add
              </button>
            </div>
          
    
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
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Type
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
                      key={opportunity.id}
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
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {opportunity.jobDetails.type}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button className="w-24 py-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-sm font-medium rounded-lg shadow-md transition-transform transform hover:scale-105 hover:shadow-lg">
                          Visits: {opportunity.viewedStudentsCount}
                        </button>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button className="w-24 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-sm font-medium rounded-lg shadow-md transition-transform transform hover:scale-105 hover:shadow-lg">
                          Applied: {opportunity.appliedStudentsCount}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
    
          <div className="flex flex-col sm:flex-row justify-center items-center mt-4 space-y-4 sm:space-y-0 sm:space-x-4">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-5 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-sm font-medium rounded-lg shadow-md transition-transform transform hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
    
            <div className="flex items-center space-x-2">
              <span className="text-gray-700 text-sm">Page</span>
              <input
                type="number"
                value={currentPage}
                min="1"
                max={totalPages}
                onChange={(e) => setCurrentPage(Number(e.target.value))}
                onBlur={(e) => {
                  const value = Math.min(
                    Math.max(Number(e.target.value), 1),
                    totalPages
                  );
                  setCurrentPage(value);
                  fetchAPI(value);
                }}
                className="w-20 px-3 py-2 border border-gray-300 rounded-md text-center text-sm shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <span className="text-gray-700 text-sm">of {totalPages}</span>
            </div>
    
            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-5 py-2 bg-gradient-to-r from-green-500 to-teal-500 text-white text-sm font-medium rounded-lg shadow-md transition-transform transform hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
          
        </section>
      </main>
    );
  };
export default Dashboard;