import React, { useState, useEffect, useCallback, useRef } from "react";
import axios from "axios";
axios.defaults.withCredentials=true
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";
import { FaSearch } from "react-icons/fa";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState({ company: "", role: "", jobId: "" });
  const [allDetails,setallDetails]=useState({appliedStudentsCount:"",viewedStudentsCount:""});
  const [totalPages, setTotalPages] = useState(1);
  const { BASE_URL } = useAuth();
  const navigate = useNavigate();
  const hasFetchedData = useRef(false);

  const handleAddClick = () => {
    navigate("/addjobs"); // Redirect to AddJobs page
  };
 
  const openTab = (tab) => {
    if (activeTab !== tab) {
      setActiveTab(tab);
      setLoading(true)
      setCurrentPage(1);

    }
    
  };

  const fetchAPI = useCallback(
      async (page = 1) => {
        try {
          const data = {
            company: filters.company.trim().toLowerCase(),
            name: filters.role.trim().toLowerCase(),
            id: filters.jobId.trim(),
          };
  
          const queryParams = new URLSearchParams(
            Object.fromEntries(Object.entries(data).filter(([_, v]) => v)) // Remove empty values
          ).toString();
          console.log(`${BASE_URL}appliedJobs/allDetails?page=${page}&limit=10&type=${activeTab}&${queryParams}`)
          const response = await axios.get(
            `${BASE_URL}appliedJobs/allDetails?page=${page}&limit=10&type=${activeTab}&${queryParams}`,{
              withCredentials:true
            }
          );
         
          const json = await response.data;
          if (json.success && Array.isArray(json.data)) {
            
            setOpportunities(json.data);
            
            setTotalPages(json.totalPages);
            setCurrentPage(json.currentPage);
            setLoading(false)
          } else {
            setOpportunities([]);
          }
        } catch (error) {
          console.error("Error fetching data:", error);
        }
        setLoading(false);
      },
      [activeTab, filters]
    );

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setFilters({ company: e.target.value, role: '', jobId: '' });
    setCurrentPage(1); // Reset to page 1 on search change
  };

  // Debounced fetching logic
    useEffect(() => {
      const delayDebounce = setTimeout(() => {
        fetchAPI(currentPage); // Fetch API after debounce delay
      }, 500); // Adjust debounce delay (500ms is a common value)
  
      // Cleanup function to cancel the previous timeout if the user types again
      return () => clearTimeout(delayDebounce);
    }, [searchQuery, currentPage, activeTab]); // Debounce only on search query and currentPage


  
    // Filtered opportunities based on search query and active tab
  


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
                placeholder="Search by Company"
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
                {opportunities.map((opportunity, index) => (
                  <tr key={opportunity.id || index } className="hover:bg-gray-100 transition-all">
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {opportunity.jobDetails?.company}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {opportunity.jobDetails?.name}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {opportunity.jobDetails?.id}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {opportunity.jobDetails?.type}
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

        {/* from here pagination*/}
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
          {currentPage -1 > 1 && (
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

        {/* Current Page Info */}
        <p className="mt-4 text-sm text-gray-500 text-center">
          Page {currentPage} of {totalPages}
        </p>



      </section>
      
    </main>
  );
};

export default Dashboard;