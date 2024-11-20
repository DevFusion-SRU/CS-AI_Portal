import React, { useEffect, useState, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContect"; 

const Launchpad = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [viewingJobId, setViewingJobId] = useState(null);
  const { currentUser, currentUserRole} = useAuth();  // Tracks which job's confirmation is shown
  const navigate = useNavigate();
  const handleAddClick = () => {
    navigate('/Addjobs'); // Redirect to AddJobs page
  };

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

    const handleViewClick = async (id) => {
      setViewingJobId(viewingJobId === id ? null : id);
    
      if (currentUser && currentUser.email) {
        const payload = {
          "rollNumber": currentUser.email.split("@")[0].toUpperCase(),
          "jobId":id,
        };
    
        try {
          const response = await fetch("http://localhost:5000/api/appliedJobs/view", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
          });
    
          if (response.ok) {
            console.log("View logged successfully.");
          } else {
            console.error("Failed to log view.");
          }
        } catch (error) {
          console.error("Error logging view:", error);
        }
      }
    };
    

  const handleConfirm = async (job) => {
    try {
      console.log(job)
      const response = await fetch("http://localhost:5000/api/appliedJobs", {
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
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="w-full p-2 border border-gray-300 rounded-lg"
          />
        </div>
        {currentUserRole === 'admin' && (<div className="flex justify-end space-x-4 mb-5">
          <button 
            onClick={handleAddClick} 
            className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-md shadow hover:bg-blue-600">
            Add
          </button>
            <button
              className="px-4 py-2 text-blue-600 border border-blue-600 rounded-full hover:bg-blue-100"
            >
              Edit
            </button>
          </div>
        )}

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
                    Role
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
                        {opportunity.company}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        {opportunity.name}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {opportunity.id}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {opportunity.type}
                      </td>
                      <td className="px-6 py-4">
                        <a
                          href={opportunity.applyLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-4 py-2 text-blue-600 border border-blue-600 rounded-full hover:bg-blue-100"
                          onClick={() => handleViewClick(opportunity.id)}
                        >
                          View
                        </a>
                      </td>
                    </tr>
                    {viewingJobId === opportunity.id && currentUserRole === 'student' && (
                      <tr className=" flex justify-end">
                        <td colSpan={4} className="px-6 py-4 bg-gray-50">
                          <p>Did you apply for this job?</p>
                          <button
                            className="bg-green-500 text-white py-1 px-4 rounded-lg mr-4 hover:bg-green-600"
                            onClick={() => {
                              handleConfirm({"rollNumber":currentUser.email.split('@')[0].toUpperCase(), "jobId":opportunity.id})
                              setViewingJobId(null)
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
