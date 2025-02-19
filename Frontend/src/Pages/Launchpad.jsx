import React, { useEffect, useState, useCallback, useRef } from "react";
import axios from "axios";
axios.defaults.withCredentials=true
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";
import { FaSearch } from "react-icons/fa";
import JobCard from "../Component/Jobcard";
import images from "../utils/importImages";
import { SearchNormal,Filter } from "iconsax-react"

const Launchpad = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [viewingJobId, setViewingJobId] = useState(null);
  const { BASE_URL } = useAuth();
  const navigate = useNavigate();
  const hasFetchedData = useRef(false);

  const openTab = (tab) => {
    if (activeTab !== tab) {
      setActiveTab(tab);
      setLoading(true)
      setCurrentPage(1);

    }
  };



  // Fetch data from the API
  const fetchAPI = useCallback(
    async (page = 1) => {
      setLoading(true);
      try {

        const response = await fetch(
          `${BASE_URL}jobs`
        );
        const json = await response.json();
        console.log(json.data)
        if (json.success && Array.isArray(json.data)) {

          setOpportunities(json.data);
<<<<<<< HEAD

=======
          console.log(json.data)
>>>>>>> e4af34d5ab2e88ee9b0618b21df704ae5dc2b0b9
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
    [activeTab]
  );
  // console.log(activeTab,filters)



  // Debounced fetching logic
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchAPI(currentPage); // Fetch API after debounce delay
    }, 500); // Adjust debounce delay (500ms is a common value)

    // Cleanup function to cancel the previous timeout if the user types again
    return () => clearTimeout(delayDebounce);
  }, [currentPage, activeTab]); // Debounce only on search query and currentPage



  return (
<<<<<<< HEAD
    <main className="w-auto flex flex-col items-center px-4 py-8">
      <section className="w-full flex-1 p-10 max-w-6xl">
        <div className="flex justify-between items-center border-b pb-4">
          <h1 className="font-quickstand text-h6 text-[#0A3D91] font-bold leading-[72px] flex items-center">
            Launchpad
            <span>
              <img src={images["svgg.png"]} alt="Launchpad Icon" className="w-10 h-10 ml-2" />
            </span>
          </h1>
=======
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
>>>>>>> e4af34d5ab2e88ee9b0618b21df704ae5dc2b0b9




          <div className="relative flex items-center space-x-2">
            <input
              type="text"
              placeholder="Search for jobs"
              className="px-4 py-2 pl-10  rounded-md shadow-md"
            />
            <SearchNormal
              size={25}
              color="#0A3D91"
              className="absolute left-1 top-1/2 transform -translate-y-1/2"
            />
            <div
    onClick={() => alert('Filter & Sort clicked')}
    className="font-Lato text-[#1B85FF] relative  h2 font-bold text- h4 flex items-center space-x-2 hover:text-blue-700 cursor-pointer transition duration-200"
>
<Filter size={20} color="#0A3D91" className="mr-2" />
    Filter & Sort
  </div>
          </div>
        </div>

<<<<<<< HEAD
        <div className="mt-2 flex flex-col gap-y-4  w-full">
          {loading ? (
            <p className="text-gray-500 md:flex-row  text-center">Loading...</p>
          ) : (
            opportunities.map((job) => <JobCard key={job.id} job={job} />)
=======


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
>>>>>>> e4af34d5ab2e88ee9b0618b21df704ae5dc2b0b9
          )}
        </div>

      </section>

    </main>

  );
};

export default Launchpad;