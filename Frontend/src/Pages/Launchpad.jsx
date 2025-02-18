import React, { useEffect, useState, useCallback, useRef } from "react";
import axios from "axios";
axios.defaults.withCredentials=true
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";
import { FaSearch } from "react-icons/fa";

const Launchpad = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [viewingJobId, setViewingJobId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const { currentUser, currentUserRole, BASE_URL } = useAuth();
  const [filters, setFilters] = useState({ company: "", role: "", jobId: "" });
  const navigate = useNavigate();
  const [modalMessage, setModalMessage] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState("");

  const openTab = (tab) => {
    if (activeTab !== tab) {
      setActiveTab(tab);
      setLoading(true)
      setCurrentPage(1);

    }
  };

  // Navigate to AddJobs page
  const handleAddClick = () => {
    navigate("addjobs");
  };

  // Fetch data from the API
  const fetchAPI = useCallback(
    async (page = 1) => {
      setLoading(true);
      try {
        const data = {
          company: filters.company.trim().toLowerCase(),
          name: filters.role.trim().toLowerCase(),
          id: filters.jobId.trim(),
        };

        const queryParams = new URLSearchParams(
          Object.fromEntries(Object.entries(data).filter(([_, v]) => v)) // Remove empty values
        ).toString();

        const response = await fetch(
          `${BASE_URL}jobs?page=${page}&limit=10&type=${activeTab}&${queryParams}`
        );
        const json = await response.json();
        if (json.success && Array.isArray(json.data)) {
          
          setOpportunities(json.data);
          console.log(json.data)
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


  // Handle search query change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setFilters({ company: '', role: '', jobId: '' });
    setCurrentPage(1); // Reset to page 1 on search change
  };


  // Debounced fetching logic
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchAPI(currentPage); // Fetch API after debounce delay
    }, 500); // Adjust debounce delay (500ms is a common value)

    // Cleanup function to cancel the previous timeout if the user types again
    return () => clearTimeout(delayDebounce);
  }, [searchQuery, currentPage,activeTab]); // Debounce only on search query and currentPage



  // Filtered opportunities based on search query and active tab
  const filteredOpportunities = (opportunities || []).filter((opportunity) => {
    const lowerSearchQuery = searchQuery.trim().toLowerCase(); // Trim whitespace and lowercase
    const companyName = opportunity.company ? opportunity.company.toLowerCase() : ""; // Ensure case-insensitive match

    // Filter based on active tab and search query
    return (
      (activeTab === "all" || opportunity.type === activeTab) &&
      companyName.includes(lowerSearchQuery)
    );
  });


  // Handle filter change
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Apply filters to the backend


  // Handle applying filters
  const handleApplyFilters = async () => {
    toggleFilterMenu();
    await fetchAPI()// Send the filters to the backend when the user applies them
    // Close the filter menu after applying filters
  };

  // Toggle the visibility of the filter menu
  const toggleFilterMenu = () => {
    setIsFilterOpen((prevState) => !prevState);
  };



  // Log when a job is viewed
  const handleViewClick = async (id) => {
    setViewingJobId(viewingJobId === id ? null : id);
    if (currentUser ) {
      const payload = {
        'rollNumber': currentUser.username,
        'jobId': id,
      };
      try {
        const response = await axios.post(`${BASE_URL}appliedJobs/view`, payload, {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true, // For including cookies
        });
        console.log(response)
        
        if (response.status===201) {
          console.log("Success.");
        }
      } catch (error) {
        console.error("Error logging view:", error);
      }
    }
  };

  // Handle job application submission
  const handleConfirm = async (job) => {
    try {
      const response = await axios.post(`${BASE_URL}appliedJobs`,job, {
        headers: {
          "Content-Type": "application/json",  
        },
        withCredentials:true,
      });
      if (response.status===201) {
        setModalMessage("Job application submitted successfully!");
        setModalType("success")
      } else {
        setModalMessage("You already applied for the job.");
        setModalType("error")
      }
    } catch (error) {
      console.error("Error submitting job application:", error);
      setModalMessage("An error occurred while applying job.");
      setModalType("error")
    }
    finally {
      setIsModalOpen(true);
    }
  };
  const closeModal = () => {
    setIsModalOpen(false);
  };


  return (
    <main className="w-full flex flex-col items-center px-4 py-8">
      <section className="w-full max-w-6xl">
        <div className="flex justify-start space-x-8 mb-4 border-b border-gray-200">
          {[
            { id: "all", label: "All Opportunities" },
            { id: "Full-time", label: "Jobs" },
            { id: "Internship", label: "Internships" },
            { id: "Hackathon", label: "Hackathons" },
          ].map((tab) => (
            <button
              key={tab.id}
              className={`pb-2 text-sm font-medium transition-colors duration-200 ${activeTab === tab.id
                  ? "text-blue-600 border-b-2 border-blue-600 font-semibold"
                  : "text-gray-500 hover:text-blue-600"
                }`}
              onClick={() => openTab(tab.id)}
            >
              {tab.label}
            </button>

          ))}
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


          <button
            onClick={handleApplyFilters}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-md shadow hover:bg-blue-600"
          >
            Filter
          </button>

          {isFilterOpen && (
            <div className="absolute top-16 right-0 w-48 bg-white shadow-lg p-4 rounded-lg">
              <div className="flex flex-col space-y-2">
                <div>
                  <label htmlFor="company" className="block text-sm font-medium text-gray-700">Company</label>
                  <input
                    type="text"
                    id="company"
                    name="company"
                    value={filters.company}
                    onChange={handleFilterChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label htmlFor="role" className="block text-sm font-medium text-gray-700">Role</label>
                  <input
                    type="text"
                    id="role"
                    name="role"
                    value={filters.role}
                    onChange={handleFilterChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label htmlFor="jobId" className="block text-sm font-medium text-gray-700">Job ID</label>
                  <input
                    type="text"
                    id="jobId"
                    name="jobId"
                    value={filters.jobId}
                    onChange={handleFilterChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div className="flex justify-end mt-4">
                  <button
                    onClick={async () => {
                       // Wait for the API to finish
                      toggleFilterMenu();
                      await fetchAPI(); // Toggle the filter menu
                      // Send the filter data to the backend
                    }}
                    className="bg-blue-500 text-white py-2 px-4 rounded-md"
                  >
                    Apply Filters
                  </button>
                </div>
              </div>
            </div>
          )}


        </div>



        {currentUserRole === "admin" && (
          <div className="flex justify-end space-x-4 mb-5">
            <div className="flex space-x-4">



            </div>
            <button
              onClick={handleAddClick}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-md shadow hover:bg-blue-600"
            >
              Add
            </button>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center">
            <p className="text-gray-500">Loading...</p>
          </div>
        ) : (
          <div>
            {filteredOpportunities.length === 0 ? (
              <p className="text-gray-500 text-center py-4">
                No opportunities found. Try a different search.
              </p>
            ) : (
              <div className="overflow-x-auto bg-white shadow-md rounded-2xl">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Company</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Job ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">View</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredOpportunities.map((opportunity) => (
                      <React.Fragment key={opportunity.jobId}>
                        <tr className="hover:bg-gray-50 transition-all">
                          <td className="px-6 py-4 text-sm font-medium text-gray-900">{opportunity.company}</td>
                          <td className="px-6 py-4 text-sm font-medium text-gray-900">{opportunity.title}</td>
                          <td className="px-6 py-4 text-sm text-gray-500">{opportunity.jobId}</td>
                          <td className="px-6 py-4 text-sm text-gray-500">{opportunity.type}</td>
                          <td className="px-6 py-4">
                            <a
                              href={opportunity.applyLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-4 py-2 text-blue-600 border border-blue-600 rounded-full hover:bg-blue-100"
                              onClick={() => handleViewClick(opportunity.jobId)}
                            >
                              View
                            </a>
                          </td>
                        </tr>
                        {viewingJobId === opportunity.jobId && currentUserRole === "student" && (
                          <tr>
                            <td colSpan={5} className="px-6 py-4 bg-gray-50">
                              <div className="flex items-center justify-between">
                                <p>Did you apply for this job?</p>
                                <div>
                                  <button
                                    className="bg-green-500 text-white py-1 px-4 rounded-lg mr-4 hover:bg-green-600"
                                    onClick={() => {
                                      handleConfirm({
                                        rollNumber: currentUser.username,
                                        jobId: opportunity.jobId,
                                      });
                                      setViewingJobId(null);
                                    }}
                                  >
                                    Yes
                                  </button>
                                  <button
                                    className="bg-red-500 text-white py-1 px-4 rounded-lg hover:bg-red-600"
                                    onClick={() => setViewingJobId(null)}
                                  >
                                    No
                                  </button>
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
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
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 md:w-1/3">
          <div className="flex flex-col items-center text-center">
            {modalType === "success" ? (
              <div className="text-green-500 text-6xl mb-4">✔️</div>
            ) : (
              <div className="text-red-500 text-6xl mb-4">✖️</div>
            )}
            <h2
              className={`text-lg font-semibold ${
                modalType === "success" ? "text-green-500" : "text-red-500"
              }`}
            >
              {modalMessage}
            </h2>
            <button
              onClick={closeModal}
              className="mt-6 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    )}
    </main>

  );
};

export default Launchpad;