import React, { useState, useEffect, useCallback, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";
import { FaSearch, FaEdit, FaTrash } from "react-icons/fa";
import { Chart as ChartJS, BarElement, LinearScale, CategoryScale, Tooltip } from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(BarElement, LinearScale, CategoryScale, Tooltip);
axios.defaults.withCredentials = true;

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [initialLoading, setInitialLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({ company: "", role: "", jobId: "" });
  const [sortOption, setSortOption] = useState("name");
  const { BASE_URL } = useAuth();
  const navigate = useNavigate();
  const hasFetchedData = useRef(false);

  const fetchAPI = useCallback(
    async (page = 1) => {
      try {
        const data = {
          company: filters.company.trim().toLowerCase(),
          name: filters.role.trim().toLowerCase(),
          id: filters.jobId.trim(),
        };

        const queryParams = new URLSearchParams(
          Object.fromEntries(Object.entries(data).filter(([_, v]) => v))
        ).toString();

        const response = await axios.get(
          `${BASE_URL}appliedJobs/allDetails?page=${page}&limit=10&type=${activeTab}&${queryParams}`,
          { withCredentials: true }
        );

        const json = response.data;
        console.log("Fetched opportunities:", json.data); // Debug log
        if (json.success && Array.isArray(json.data)) {
          setOpportunities(json.data);
          setTotalPages(json.totalPages);
          setCurrentPage(json.currentPage);
        } else {
          setOpportunities([]);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setOpportunities([]);
      } finally {
        setLoading(false);
        setInitialLoading(false);
      }
    },
    [activeTab, filters, BASE_URL]
  );

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchAPI(currentPage);
    }, 500);
    return () => clearTimeout(delayDebounce);
  }, [searchQuery, currentPage, activeTab, fetchAPI]);

  const openTab = (tab) => {
    if (activeTab !== tab) {
      setActiveTab(tab);
      setLoading(true);
      setCurrentPage(1);
      setSearchQuery("");
      setFilters({ company: "", role: "", jobId: "" });
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setFilters({ company: e.target.value, role: "", jobId: "" });
    setCurrentPage(1);
  };

  const handleAddClick = (type) => {
    navigate(`/addjobs?type=${type}`);
  };

  const handleEditClick = (jobId) => {
    if (jobId) {
      navigate(`/editjob/${jobId}`);
    } else {
      console.error("Job ID is undefined");
    }
  };

  const handleDeleteClick = async (jobId) => {
    if (window.confirm("Are you sure you want to delete this job?")) {
      try {
        await axios.delete(`${BASE_URL}jobs/${jobId}`, { withCredentials: true });
        setOpportunities(opportunities.filter(opp => opp.jobDetails?.id !== jobId));
      } catch (error) {
        console.error("Error deleting job:", error);
        alert("Failed to delete job.");
      }
    }
  };

  const sortOpportunities = (opps) => {
    return [...opps].sort((a, b) => {
      switch (sortOption) {
        case "popularity":
          return (b.viewedStudentsCount || 0) - (a.viewedStudentsCount || 0);
        case "name":
          return (a.jobDetails?.name || "").localeCompare(b.jobDetails?.name || "");
        case "applied":
          return (b.appliedStudentsCount || 0) - (a.appliedStudentsCount || 0);
        case "alphabetical":
          return (a.jobDetails?.company || "").localeCompare(b.jobDetails?.company || "");
        case "recent":
          return new Date(b.jobDetails?.createdAt || 0) - new Date(a.jobDetails?.createdAt || 0);
        default:
          return 0;
      }
    });
  };

  const getMetrics = (type = activeTab) => {
    let filteredOpps;
    if (type === "all") {
      filteredOpps = opportunities;
    } else if (type === "Jobs") {
      filteredOpps = opportunities.filter(opp => 
        opp.jobDetails?.type === "Full-time" || opp.jobDetails?.type === "Part-time"
      );
    } else {
      filteredOpps = opportunities.filter(opp => opp.jobDetails?.type === type);
    }
    return {
      totalApplied: filteredOpps.reduce((sum, opp) => sum + (opp.appliedStudentsCount || 0), 0),
      totalJobs: filteredOpps.length,
      totalViewed: filteredOpps.reduce((sum, opp) => sum + (opp.viewedStudentsCount || 0), 0),
      totalShortlisted: filteredOpps.filter(opp => opp.status === "shortlisted").length,
    };
  };

  const totalAppliedData = {
    labels: ["Jobs", "Internships", "Hackathons"],
    datasets: [{
      label: "Total Applied",
      data: [
        getMetrics("Jobs").totalApplied,
        getMetrics("Internship").totalApplied,
        getMetrics("Hackathon").totalApplied,
      ],
      backgroundColor: "#3b82f6",
    }],
  };

  const totalJobsData = {
    labels: ["Jobs", "Internships", "Hackathons"],
    datasets: [{
      label: "Total Jobs Available",
      data: [
        getMetrics("Jobs").totalJobs,
        getMetrics("Internship").totalJobs,
        getMetrics("Hackathon").totalJobs,
      ],
      backgroundColor: "#10b981",
    }],
  };

  const shortlistedData = {
    labels: ["Jobs", "Internships", "Hackathons"],
    datasets: [{
      label: "Total Shortlisted",
      data: [
        getMetrics("Jobs").totalShortlisted,
        getMetrics("Internship").totalShortlisted,
        getMetrics("Hackathon").totalShortlisted,
      ],
      backgroundColor: "#f59e0b",
    }],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { position: "top", labels: { color: "#333" } } },
    scales: { y: { beginAtZero: true, ticks: { color: "#333" } }, x: { ticks: { color: "#333" } } },
  };

  const sortedOpportunities = sortOpportunities(opportunities);

  return (
    <main className="w-full flex flex-col min-h-screen bg-gray-100">
      <div className="flex flex-col w-full max-w-7xl mx-auto px-4 py-4">
        <div className="flex-shrink-0">
          <h1 className="text-xl font-semibold text-gray-800 mb-4">Admin Dashboard</h1>

          <div className="flex flex-col sm:flex-row justify-between items-center mb-6 bg-white p-4 rounded-lg shadow-md">
            <div className="flex space-x-6 border-b border-gray-200 mb-4 sm:mb-0">
              {[
                { id: "all", label: "All Opportunities" },
                { id: "Jobs", label: "Jobs" },
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
            <div className="flex space-x-4 items-center">
              <div className="relative w-full max-w-xs">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  placeholder="Search by Company"
                  className="px-4 py-2 w-full border border-gray-300 rounded-md shadow-md focus:ring-2 focus:ring-blue-500 pl-10 text-gray-900"
                />
                <FaSearch className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-400" />
              </div>
              <button
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md shadow hover:bg-blue-700 transition-colors"
                onClick={() => handleAddClick(activeTab === "all" ? "Jobs" : activeTab)}
              >
                Add Job
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-blue-100 p-4 rounded-lg shadow">
              <h3 className="text-sm text-gray-600">Total Jobs</h3>
              <p className="text-2xl font-bold text-blue-700">{activeTab === "all" ? opportunities.length : getMetrics().totalJobs}</p>
            </div>
            <div className="bg-green-100 p-4 rounded-lg shadow">
              <h3 className="text-sm text-gray-600">Total Applied</h3>
              <p className="text-2xl font-bold text-green-700">{getMetrics().totalApplied}</p>
            </div>
            <div className="bg-yellow-100 p-4 rounded-lg shadow">
              <h3 className="text-sm text-gray-600">Total Viewed</h3>
              <p className="text-2xl font-bold text-yellow-700">{getMetrics().totalViewed}</p>
            </div>
            <div className="bg-orange-100 p-4 rounded-lg shadow">
              <h3 className="text-sm text-gray-600">Total Shortlisted</h3>
              <p className="text-2xl font-bold text-orange-700">{getMetrics().totalShortlisted}</p>
            </div>
          </div>

          {activeTab === "all" && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="bg-white p-4 rounded-lg shadow">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Total Applied</h3>
                <div className="h-64">
                  <Bar data={totalAppliedData} options={chartOptions} />
                </div>
              </div>
              <div className="bg-white p-4 rounded-lg shadow">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Total Jobs Available</h3>
                <div className="h-64">
                  <Bar data={totalJobsData} options={chartOptions} />
                </div>
              </div>
              <div className="bg-white p-4 rounded-lg shadow">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Total Shortlisted</h3>
                <div className="h-64">
                  <Bar data={shortlistedData} options={chartOptions} />
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex-grow overflow-y-auto">
          <div className="mb-4">
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="w-full max-w-xs p-2 border border-gray-300 rounded-md shadow-md text-gray-900 focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value="popularity">Sort by Popularity (Views)</option>
              <option value="name">Sort by Name</option>
              <option value="applied">Sort by Applied</option>
              <option value="alphabetical">Sort by Alphabetical Order</option>
              <option value="recent">Sort by Recent Jobs Added</option>
            </select>
          </div>

          {loading && initialLoading ? (
            <div className="overflow-x-auto bg-white shadow-lg rounded-lg p-6 border border-gray-200">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Company</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Job ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Visits</th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Applied</th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {Array(5).fill().map((_, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div></td>
                      <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div></td>
                      <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse"></div></td>
                      <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse"></div></td>
                      <td className="px-6 py-4 text-center"><div className="h-4 bg-gray-200 rounded w-1/4 mx-auto animate-pulse"></div></td>
                      <td className="px-6 py-4 text-center"><div className="h-4 bg-gray-200 rounded w-1/4 mx-auto animate-pulse"></div></td>
                      <td className="px-6 py-4 text-center"><div className="h-4 bg-gray-200 rounded w-1/2 mx-auto animate-pulse"></div></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="overflow-x-auto bg-white shadow-lg rounded-lg p-6 border border-gray-200">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Company</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Job ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Visits</th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Applied</th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {sortedOpportunities.map((opportunity, index) => (
                    <tr key={opportunity.jobDetails?.id || index} className="hover:bg-gray-50 transition-all">
                      <td className="px-6 py-4 text-sm text-gray-900">{opportunity.jobDetails?.company || "N/A"}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{opportunity.jobDetails?.name || "N/A"}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">{opportunity.jobDetails?.id || "N/A"}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">{opportunity.jobDetails?.type || "N/A"}</td>
                      <td className="px-6 py-4 text-center text-sm text-gray-900">{opportunity.viewedStudentsCount || 0}</td>
                      <td className="px-6 py-4 text-center text-sm text-gray-900">{opportunity.appliedStudentsCount || 0}</td>
                      <td className="px-6 py-4 text-center text-sm">
                        <button
                          onClick={() => handleEditClick(opportunity.jobDetails?.id)}
                          className="text-blue-600 hover:text-blue-800 mr-4"
                          title="Edit"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(opportunity.jobDetails?.id)}
                          className="text-red-600 hover:text-red-800"
                          title="Delete"
                        >
                          <FaTrash />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {loading && !initialLoading && (
                <div className="flex justify-center items-center py-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                  <p className="ml-3 text-gray-600 text-sm font-medium">Loading more jobs...</p>
                </div>
              )}
            </div>
          )}

          <div className="flex justify-center items-center space-x-2 mt-6">
            <button
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1 || loading}
              className={`px-4 py-2 rounded-md shadow text-sm font-medium transition-colors ${
                currentPage === 1 || loading
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
            >
              First
            </button>
            {currentPage > 1 && (
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={loading}
                className={`px-4 py-2 rounded-md shadow text-sm font-medium transition-colors ${
                  loading ? "bg-gray-300 text-gray-500 cursor-not-allowed" : "bg-blue-500 text-white hover:bg-blue-600"
                }`}
              >
                {currentPage - 1}
              </button>
            )}
            <button className="px-4 py-2 bg-blue-600 text-white rounded-md shadow">{currentPage}</button>
            {currentPage < totalPages && (
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={loading}
                className={`px-4 py-2 rounded-md shadow text-sm font-medium transition-colors ${
                  loading ? "bg-gray-300 text-gray-500 cursor-not-allowed" : "bg-blue-500 text-white hover:bg-blue-600"
                }`}
              >
                {currentPage + 1}
              </button>
            )}
            <button
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages || loading}
              className={`px-4 py-2 rounded-md shadow text-sm font-medium transition-colors ${
                currentPage === totalPages || loading
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
            >
              Last
            </button>
          </div>
          <p className="mt-4 text-sm text-gray-500 text-center">Page {currentPage} of {totalPages}</p>
        </div>
      </div>
    </main>
  );
};

export default Dashboard;