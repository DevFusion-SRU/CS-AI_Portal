import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";
import { FaSearch, FaTimes } from "react-icons/fa";
import { Chart as ChartJS, BarElement, LinearScale, CategoryScale, Tooltip, DoughnutController, ArcElement } from "chart.js";
import { Bar, Doughnut } from "react-chartjs-2";
import axios from "axios";

ChartJS.register(BarElement, LinearScale, CategoryScale, Tooltip, DoughnutController, ArcElement);

const StudentDashboard = () => {
  const [activeSection, setActiveSection] = useState("applications");
  const [subTab, setSubTab] = useState("applied");
  const [popularSubTab, setPopularSubTab] = useState("topskills");
  const [searchQuery, setSearchQuery] = useState("");
  const [opportunities, setOpportunities] = useState([]);
  const [savedJobs, setSavedJobs] = useState([]);
  const [inDemandSkills, setInDemandSkills] = useState([]);
  const [mostAppliedJobs, setMostAppliedJobs] = useState([]);
  const [mostAppliedCompanies, setMostAppliedCompanies] = useState([]);
  const [recentJobs, setRecentJobs] = useState([]);
  const [jobsPosted, setJobsPosted] = useState(0);
  const [notice, setNotice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const { currentUser, BASE_URL } = useAuth();
  const navigate = useNavigate();

  const fetchDashboardData = useCallback(async () => {
    if (!currentUser || !currentUser.username) {
      console.error("No currentUser or username found:", currentUser);
      setLoading(false);
      return;
    }
    const rollNumber = currentUser.username;
    console.log("Fetching data for rollNumber:", rollNumber);
    console.log("BASE_URL:", BASE_URL);
    setLoading(true);

    const axiosConfig = {
      headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
      withCredentials: true,
    };

    try {
      try {
        const appliedResponse = await axios.get(`${BASE_URL}jobs/applications/${rollNumber}`, axiosConfig);
        setOpportunities(appliedResponse.data.success && Array.isArray(appliedResponse.data.data)
          ? appliedResponse.data.data.map(opp => ({
              jobId: opp.jobId || "unknown",
              company: opp.company || "Unknown",
              title: opp.title || "Untitled",
              status: opp.status || "applied",
            }))
          : []);
      } catch (err) {
        console.warn("Applied jobs fetch failed:", err.response?.data || err.message);
        setOpportunities([]);
      }

      try {
        const savedResponse = await axios.get(`${BASE_URL}jobs/saved/${rollNumber}`, axiosConfig);
        setSavedJobs(savedResponse.data.success && Array.isArray(savedResponse.data.data)
          ? savedResponse.data.data.map(job => ({
              jobId: job.jobId || "unknown",
              company: job.company || "Unknown",
              title: job.title || "Untitled",
            }))
          : []);
      } catch (err) {
        console.warn("Saved jobs fetch failed:", err.response?.data || err.message);
        setSavedJobs([]);
      }

      try {
        const jobsResponse = await axios.get(`${BASE_URL}jobs/`, axiosConfig);
        setJobsPosted(jobsResponse.data.success && Array.isArray(jobsResponse.data.data)
          ? (jobsResponse.data.totalJobs || jobsResponse.data.data.length)
          : 50);
      } catch (err) {
        console.warn("Total jobs fetch failed:", err.response?.data || err.message);
        setJobsPosted(50);
      }

      try {
        const recentJobsResponse = await axios.get(`${BASE_URL}jobs/recent`, axiosConfig);
        setRecentJobs(recentJobsResponse.data.success && Array.isArray(recentJobsResponse.data.data)
          ? recentJobsResponse.data.data.map(job => ({
              jobId: job.jobId || "unknown",
              company: job.company || "Unknown",
              title: job.title || "Untitled",
              postedDate: job.createdAt || "Unknown Date",
            }))
          : []);
      } catch (err) {
        console.warn("Recent jobs fetch failed:", err.response?.data || err.message);
        setRecentJobs([]);
      }

      try {
        const noticeResponse = await axios.get(`${BASE_URL}notices/latest`, axiosConfig);
        setNotice(noticeResponse.data.success
          ? noticeResponse.data.data
            ? { message: noticeResponse.data.data.message || "No message", date: noticeResponse.data.data.date || "Unknown Date" }
            : { message: "Reminder: Apply for internships by March 20!", date: "20 March 2025" }
          : { message: "Reminder: Apply for internships by March 20!", date: "20 March 2025" });
      } catch (err) {
        console.warn("Notices fetch failed:", err.response?.data || err.message);
        setNotice({ message: "Reminder: Apply for internships by March 20!", date: "20 March 2025" });
      }

      try {
        const skillsResponse = await axios.get(`${BASE_URL}jobs/analytics/topskills`, axiosConfig);
        setInDemandSkills(skillsResponse.data.success && Array.isArray(skillsResponse.data.inDemandSkills)
          ? skillsResponse.data.inDemandSkills.map(skill => ({
              _id: skill._id || "Python",
              count: skill.count || 0,
            }))
          : []);
      } catch (err) {
        console.warn("Skills fetch failed:", err.response?.data || err.message);
        setInDemandSkills([]);
      }

      try {
        const mostAppliedResponse = await axios.get(`${BASE_URL}jobs/analytics/topjobs`, axiosConfig);
        setMostAppliedJobs(mostAppliedResponse.data.success && Array.isArray(mostAppliedResponse.data.topJobs)
          ? mostAppliedResponse.data.topJobs.map(job => ({
              _id: job._id,
              title: job.title || `Job ${job._id}`,
              totalApplications: job.totalApplications,
            }))
          : []);
      } catch (err) {
        console.warn("Most applied jobs fetch failed:", err.response?.data || err.message);
        setMostAppliedJobs([]);
      }

      try {
        const companiesResponse = await axios.get(`${BASE_URL}jobs/analytics/topcompanies`, axiosConfig);
        setMostAppliedCompanies(companiesResponse.data.success && Array.isArray(companiesResponse.data.topCompanies)
          ? companiesResponse.data.topCompanies
          : []);
      } catch (err) {
        console.warn("Companies fetch failed:", err.response?.data || err.message);
        setMostAppliedCompanies([]);
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error.response?.data || error.message);
      setOpportunities([]);
      setSavedJobs([]);
      setInDemandSkills([]);
      setMostAppliedJobs([]);
      setMostAppliedCompanies([]);
      setRecentJobs([]);
      setJobsPosted(50);
      setNotice({ message: "System maintenance scheduled for March 15.", date: "2025-03-14" });
    } finally {
      setLoading(false);
    }
  }, [currentUser, BASE_URL]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const statusCounts = opportunities.reduce((acc, opp) => {
    acc[opp.status] = (acc[opp.status] || 0) + 1;
    return acc;
  }, { applied: 0, shortlisted: 0, rejected: 0, "on-hold": 0 });

  const totalApplications = Object.values(statusCounts).reduce((sum, count) => sum + count, 0);
  const percentages = {
    applied: totalApplications ? (statusCounts.applied / totalApplications) * 100 : 0,
    shortlisted: totalApplications ? (statusCounts.shortlisted / totalApplications) * 100 : 0,
    rejected: totalApplications ? (statusCounts.rejected / totalApplications) * 100 : 0,
    "on-hold": totalApplications ? (statusCounts["on-hold"] / totalApplications) * 100 : 0,
  };

  // Top Skills Bar Chart (Vertical)
  const skillsChartData = {
    labels: inDemandSkills.map(skill => skill._id),
    datasets: [{
      label: "Job Count",
      data: inDemandSkills.map(skill => skill.count),
      backgroundColor: "rgba(96, 165, 250, 0.6)",
      borderColor: "#60a5fa",
      borderWidth: 1,
    }],
  };

  const skillsChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: { beginAtZero: true, title: { display: true, text: "Jobs", color: "#ffffff", font: { size: 12 } }, ticks: { color: "#d1d5db", stepSize: 10 } },
      x: { ticks: { color: "#d1d5db", maxRotation: 45, minRotation: 45 } },
    },
    plugins: { legend: { display: false }, tooltip: { backgroundColor: "rgba(0,0,0,0.8)", titleColor: "white" } },
  };

  // Top Jobs Bar Chart (Horizontal)
  const jobsChartData = {
    labels: mostAppliedJobs.map(job => job.title),
    datasets: [{
      label: "Applications",
      data: mostAppliedJobs.map(job => job.totalApplications),
      backgroundColor: "rgba(249, 115, 22, 0.6)", // Orange-600
      borderColor: "#f97316",
      borderWidth: 1,
    }],
  };

  const jobsChartOptions = {
    indexAxis: "y",
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: { beginAtZero: true, title: { display: true, text: "Applications", color: "#ffffff", font: { size: 12 } }, ticks: { color: "#d1d5db" } },
      y: { ticks: { color: "#d1d5db" } },
    },
    plugins: { legend: { display: false }, tooltip: { backgroundColor: "rgba(0,0,0,0.8)", titleColor: "white" } },
  };

  // Top Companies Doughnut Chart
  const companiesChartData = {
    labels: mostAppliedCompanies.map(company => company._id),
    datasets: [{
      label: "Applications",
      data: mostAppliedCompanies.map(company => company.totalApplications),
      backgroundColor: ["rgba(34, 197, 94, 0.6)", "rgba(139, 92, 246, 0.6)", "rgba(239, 68, 68, 0.6)", "rgba(234, 179, 8, 0.6)", "rgba(59, 130, 246, 0.6)"], // Green-500, Purple-500, Red-500, Yellow-500, Blue-500
      borderColor: ["#22c55e", "#8b5cf6", "#ef4444", "#eab308", "#3b82f6"],
      borderWidth: 1,
    }],
  };

  const companiesChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          color: "#ffffff",
          font: { size: 12 },
          boxWidth: 12, // Smaller color box for better fit
          padding: 10, // Spacing between legend items
          usePointStyle: true, // Use circular points instead of rectangles
        },
      },
      tooltip: { backgroundColor: "rgba(0,0,0,0.8)", titleColor: "white" },
    },
  };

  const filteredOpportunities = opportunities
    .filter((opp) => opp.status === subTab)
    .filter((opp) => opp.company?.toLowerCase().includes(searchQuery.toLowerCase()) || opp.jobId?.toLowerCase().includes(searchQuery.toLowerCase()));

  const filteredSavedJobs = savedJobs.filter((job) =>
    job.company?.toLowerCase().includes(searchQuery.toLowerCase()) || job.jobId?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredRecentJobs = recentJobs.filter((job) =>
    job.company?.toLowerCase().includes(searchQuery.toLowerCase()) || job.jobId?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const itemsPerPage = 5;
  const paginatedOpportunities = filteredOpportunities.slice(page * itemsPerPage, (page + 1) * itemsPerPage);
  const paginatedSavedJobs = filteredSavedJobs.slice(page * itemsPerPage, (page + 1) * itemsPerPage);
  const paginatedSkills = inDemandSkills.slice(page * itemsPerPage, (page + 1) * itemsPerPage);
  const paginatedJobs = mostAppliedJobs.slice(page * itemsPerPage, (page + 1) * itemsPerPage);
  const paginatedCompanies = mostAppliedCompanies.slice(page * itemsPerPage, (page + 1) * itemsPerPage);
  const paginatedRecentJobs = filteredRecentJobs.slice(page * itemsPerPage, (page + 1) * itemsPerPage);

  const totalPages = Math.ceil(
    activeSection === "applications" ? filteredOpportunities.length :
    activeSection === "popular" ? (
      popularSubTab === "topskills" ? inDemandSkills.length :
      popularSubTab === "topjobs" ? mostAppliedJobs.length :
      mostAppliedCompanies.length
    ) :
    activeSection === "saved" ? filteredSavedJobs.length :
    activeSection === "recent" ? filteredRecentJobs.length : 1
  / itemsPerPage);

  const handleJobClick = (jobId) => navigate(`/jobs/${jobId}`);
  const dismissNotice = () => setNotice(null);

  return (
    <div className="h-screen flex flex-col bg-white text-gray-800 font-sans overflow-hidden">
      <div className="flex-1 p-4 pt-2 flex flex-col">
        {/* Heading */}
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-blue-400">Student Dashboard</h1>
          <button className="md:hidden bg-gray-800 text-white p-2 rounded" onClick={() => document.querySelector(".sidebar")?.classList.toggle("hidden")}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
        </div>

        {/* Notice */}
        {notice && (
          <div className="bg-blue-400 text-white p-3 rounded mb-4 flex justify-between items-center">
            <p className="text-sm"><strong>Notice:</strong> {notice.message} <em>({notice.date})</em></p>
            <button onClick={dismissNotice} className="text-white"><FaTimes /></button>
          </div>
        )}

        <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4 overflow-hidden">
          {/* Left Section (Stats and Charts) */}
          <div className="md:col-span-2 flex flex-col">
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              {["applied", "shortlisted", "on-hold"].map((status, idx) => (
                <div key={status} className="bg-gray-800 text-white p-3 rounded-lg shadow">
                  <h2 className="text-xs uppercase text-gray-400 font-medium">{status}</h2>
                  <p className="text-lg font-semibold">{statusCounts[status]}</p>
                  <svg viewBox="0 0 36 36" className="w-14 h-14 mx-auto mt-2">
                    <path className="fill-none stroke-gray-300 stroke-1" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"/>
                    <path className={`fill-none stroke-2 ${idx === 0 ? "stroke-pink-400" : idx === 1 ? "stroke-blue-400" : "stroke-orange-400"}`} strokeDasharray={`${percentages[status]}, 100`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"/>
                    <text x="18" y="20.35" className="text-xs text-center fill-white" textAnchor="middle">{Math.round(percentages[status])}%</text>
                  </svg>
                </div>
              ))}
              <div className="bg-gray-800 text-white p-3 rounded-lg shadow">
                <h2 className="text-xs uppercase text-gray-400 font-medium">Jobs Posted</h2>
                <p className="text-lg font-semibold">{jobsPosted}</p>
              </div>
            </div>

            {/* Charts (Side-by-Side) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Top Skills */}
              <div className="bg-gray-800 p-3 rounded-lg shadow">
                <h2 className="text-lg text-white font-semibold mb-2">Top Skills</h2>
                <div className="h-48">
                  <Bar data={skillsChartData} options={skillsChartOptions} />
                </div>
              </div>

              {/* Top Jobs */}
              <div className="bg-gray-800 p-3 rounded-lg shadow">
                <h2 className="text-lg text-white font-semibold mb-2">Top Jobs</h2>
                <div className="h-48">
                  <Bar data={jobsChartData} options={jobsChartOptions} />
                </div>
              </div>

              {/* Top Companies */}
              <div className="bg-gray-800 p-3 rounded-lg shadow">
                <h2 className="text-lg text-white font-semibold mb-2">Top Companies</h2>
                <div className="h-48">
                  <Doughnut data={companiesChartData} options={companiesChartOptions} />
                </div>
              </div>
            </div>
          </div>

          {/* Right Section (Scrollable Tabs) */}
          <div className="bg-gray-800 p-3 rounded-lg shadow flex flex-col h-full max-h-[calc(100vh-6rem)]">
            <div className="flex flex-wrap gap-2 mb-3 border-b border-gray-700 pb-2">
              {["applications", "popular", "saved", "recent"].map((section) => (
                <button
                  key={section}
                  className={`text-sm px-3 py-1 ${activeSection === section ? "text-blue-400 border-b-2 border-blue-400" : "text-gray-400 hover:text-gray-200"}`}
                  onClick={() => { setActiveSection(section); setPage(0); }}
                >
                  {section === "applications" ? "Applications" :
                   section === "popular" ? "Popular" :
                   section === "saved" ? "Saved" : "Recent Jobs"}
                </button>
              ))}
            </div>

            <div className="relative mb-3">
              <FaSearch className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search..."
                className="w-full pl-8 p-2 bg-gray-700 text-white text-sm rounded focus:outline-none focus:bg-gray-600"
              />
            </div>

            <div className="flex-1 overflow-y-auto">
              {activeSection === "applications" && (
                <>
                  <select
                    value={subTab}
                    onChange={(e) => { setSubTab(e.target.value); setPage(0); }}
                    className="w-full p-2 mb-3 bg-gray-700 text-white text-sm rounded"
                  >
                    {["applied", "shortlisted", "on-hold", "rejected"].map((tab) => (
                      <option key={tab} value={tab}>{tab.charAt(0).toUpperCase() + tab.slice(1)}</option>
                    ))}
                  </select>
                  <div>
                    {loading ? (
                      <p className="text-sm text-gray-400 text-center">Loading...</p>
                    ) : paginatedOpportunities.length > 0 ? (
                      paginatedOpportunities.map((opp) => (
                        <div key={opp.jobId} className="flex items-center p-2 bg-gray-700 rounded mb-2 cursor-pointer hover:bg-gray-600">
                          <img src="https://via.placeholder.com/24" alt="job" className="w-6 h-6 rounded-full mr-2" />
                          <div>
                            <p className="text-sm text-white font-medium">{opp.company}</p>
                            <p className="text-xs text-gray-400">{opp.title} - <strong>{opp.status.charAt(0).toUpperCase() + opp.status.slice(1)}</strong></p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-gray-400 text-center">No {subTab} jobs found.</p>
                    )}
                  </div>
                  <div className="mt-3 border-t border-gray-700 pt-3">
                    <h3 className="text-lg text-white font-semibold mb-2">Status Breakdown</h3>
                    <div className="grid grid-cols-2 gap-2">
                      {["applied", "shortlisted", "on-hold", "rejected"].map((status) => (
                        <div key={status} className="flex items-center">
                          <span className={`w-2 h-2 rounded-full mr-2 ${status === "applied" ? "bg-pink-400" : status === "shortlisted" ? "bg-blue-400" : status === "on-hold" ? "bg-orange-400" : "bg-red-400"}`}></span>
                          <span className="text-xs text-gray-400">{status.charAt(0).toUpperCase() + status.slice(1)}</span>
                          <span className="text-xs text-white ml-auto">{isNaN(percentages[status]) ? "0%" : `${Math.round(percentages[status])}%`}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {activeSection === "popular" && (
                <>
                  <select
                    value={popularSubTab}
                    onChange={(e) => { setPopularSubTab(e.target.value); setPage(0); }}
                    className="w-full p-2 mb-3 bg-gray-700 text-white text-sm rounded"
                  >
                    <option value="topskills">Top Skills</option>
                    <option value="topjobs">Top Jobs</option>
                    <option value="topcompanies">Top Companies</option>
                  </select>
                  <div>
                    {popularSubTab === "topskills" && (
                      paginatedSkills.length > 0 ? paginatedSkills.map((skill) => (
                        <div key={skill._id} className="p-2 bg-gray-700 rounded mb-2">
                          <p className="text-sm text-white font-medium">{skill._id}</p>
                          <p className="text-xs text-gray-400">{skill.count} jobs</p>
                        </div>
                      )) : <p className="text-sm text-gray-400 text-center">No skills data available.</p>
                    )}
                    {popularSubTab === "topjobs" && (
                      paginatedJobs.length > 0 ? paginatedJobs.map((job) => (
                        <div key={job._id} className="flex items-center p-2 bg-gray-700 rounded mb-2 cursor-pointer hover:bg-gray-600" onClick={() => handleJobClick(job._id)}>
                          <img src="https://via.placeholder.com/24" alt="job" className="w-6 h-6 rounded-full mr-2" />
                          <div>
                            <p className="text-sm text-white font-medium">{job.title}</p>
                            <p className="text-xs text-gray-400">{job.totalApplications} applications</p>
                          </div>
                        </div>
                      )) : <p className="text-sm text-gray-400 text-center">No top applied jobs found.</p>
                    )}
                    {popularSubTab === "topcompanies" && (
                      paginatedCompanies.length > 0 ? paginatedCompanies.map((company) => (
                        <div key={company._id} className="flex items-center p-2 bg-gray-700 rounded mb-2">
                          <img src="https://via.placeholder.com/24" alt="company" className="w-6 h-6 rounded-full mr-2" />
                          <div>
                            <p className="text-sm text-white font-medium">{company._id}</p>
                            <p className="text-xs text-gray-400">{company.totalApplications} applications</p>
                          </div>
                        </div>
                      )) : <p className="text-sm text-gray-400 text-center">No top applied companies found.</p>
                    )}
                  </div>
                </>
              )}

              {activeSection === "saved" && (
                <div>
                  {paginatedSavedJobs.length > 0 ? paginatedSavedJobs.map((job) => (
                    <div key={job.jobId} className="flex items-center p-2 bg-gray-700 rounded mb-2 cursor-pointer hover:bg-gray-600" onClick={() => handleJobClick(job.jobId)}>
                      <img src="https://via.placeholder.com/24" alt="job" className="w-6 h-6 rounded-full mr-2" />
                      <div>
                        <p className="text-sm text-white font-medium">{job.company}</p>
                        <p className="text-xs text-gray-400">{job.title}</p>
                      </div>
                    </div>
                  )) : <p className="text-sm text-gray-400 text-center">No saved jobs found.</p>}
                </div>
              )}

              {activeSection === "recent" && (
                <div>
                  {paginatedRecentJobs.length > 0 ? paginatedRecentJobs.map((job) => (
                    <div key={job.jobId} className="flex items-center p-2 bg-gray-700 rounded mb-2 cursor-pointer hover:bg-gray-600" onClick={() => handleJobClick(job.jobId)}>
                      <img src="https://via.placeholder.com/24" alt="job" className="w-6 h-6 rounded-full mr-2" />
                      <div>
                        <p className="text-sm text-white font-medium">{job.company}</p>
                        <p className="text-xs text-gray-400">{job.title} - <em>Posted: {new Date(job.postedDate).toLocaleDateString()}</em></p>
                      </div>
                    </div>
                  )) : <p className="text-sm text-gray-400 text-center">No recent jobs found.</p>}
                </div>
              )}
            </div>

            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-3">
                <button
                  className={`bg-blue-400 text-white px-3 py-1 rounded text-sm ${page === 0 ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-500"}`}
                  onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
                  disabled={page === 0}
                >
                  Prev
                </button>
                <span className="text-sm text-white">{page + 1} / {totalPages}</span>
                <button
                  className={`bg-blue-400 text-white px-3 py-1 rounded text-sm ${page + 1 >= totalPages ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-500"}`}
                  onClick={() => setPage((prev) => Math.min(prev + 1, totalPages - 1))}
                  disabled={page + 1 >= totalPages}
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;