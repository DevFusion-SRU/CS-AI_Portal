import React, { useState, useEffect } from "react";
import { useAuth } from "../Context/AuthContext";
import axios from "axios";
import JobCard from "../Component/Jobcard";
import FilterMenu from "../Component/Filterandsort";

const SkeletonJobCard = () => (
  <div className="w-full bg-gray-200 rounded-lg shadow-md p-4 border border-gray-200 animate-pulse">
    <div className="flex justify-between items-center mb-2">
      <div className="h-4 bg-gray-300 rounded w-1/2"></div>
      <div className="h-4 w-4 bg-gray-300 rounded-full"></div>
    </div>
    <div className="flex flex-col md:flex-row justify-between md:items-center">
      <div>
        <div className="h-5 bg-gray-300 rounded w-3/4 mb-2"></div>
        <div className="h-3 bg-gray-400 rounded w-1/3"></div>
      </div>
      <div className="ml-auto mt-2 md:mt-0">
        <div className="h-3 bg-gray-400 rounded w-20 mb-1"></div>
        <div className="h-3 bg-gray-400 rounded w-16"></div>
      </div>
    </div>
    <hr className="my-2 border-t border-gray-300" />
    <div className="flex flex-col md:flex-row justify-between md:items-center">
      <div className="flex flex-wrap gap-3">
        <div className="h-3 bg-gray-400 rounded w-20"></div>
        <div className="h-3 bg-gray-400 rounded w-16"></div>
        <div className="h-3 bg-gray-400 rounded w-24"></div>
      </div>
      <div className="mt-3 md:mt-0">
        <div className="h-8 bg-gray-300 rounded w-24"></div>
      </div>
    </div>
  </div>
);

const SavedJobs = () => {
  const { BASE_URL, currentUser } = useAuth();
  const [savedJobs, setSavedJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState({
    jobType: [],
    industry: [],
    modeOfWork: [],
    skills: [],
    compensation: [],
    sort: "Newest",
  });

  // Fetch saved jobs from the backend
  useEffect(() => {
    const fetchSavedJobs = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const response = await axios.get(`${BASE_URL}appliedJobs/saved/${currentUser.username}`, {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        });
        if (response.data.success) {
          setSavedJobs(response.data.data);
          setFilteredJobs(response.data.data); // Initially set filtered jobs to all saved jobs
        } else {
          setError("No saved jobs found.");
        }
      } catch (err) {
        setError("Error fetching saved jobs: " + (err.response?.data?.message || "Unknown error"));
      } finally {
        setLoading(false);
      }
    };
    fetchSavedJobs();
  }, [BASE_URL, currentUser]);

  // Apply filters and sorting whenever filters change
  useEffect(() => {
    let updatedJobs = [...savedJobs];

    // Apply filters
    if (filters.jobType.length > 0) {
      updatedJobs = updatedJobs.filter((job) => filters.jobType.includes(job.type));
    }
    if (filters.compensation.length > 0) {
      updatedJobs = updatedJobs.filter((job) =>
        filters.compensation.includes(job.stipend ? "Paid" : "Unpaid")
      );
    }

    // Apply sorting
    if (filters.sort === "Newest") {
      updatedJobs.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (filters.sort === "Oldest") {
      updatedJobs.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    }

    setFilteredJobs(updatedJobs);
  }, [savedJobs, filters]);

  // Handle filter and sort application from FilterMenu
  const handleFilterApply = (selectedFilters) => {
    setFilters(selectedFilters);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 sm:p-6 md:p-8">
        <div className="max-w-[1600px] mx-auto">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-[#0A3D91] font-quickstand mb-4 sm:mb-0">
              Saved Jobs
            </h1>
            <FilterMenu onApplyFilters={handleFilterApply} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array(6)
              .fill()
              .map((_, index) => (
                <SkeletonJobCard key={index} />
              ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-red-600 text-lg font-medium">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 md:p-8">
      <div className="max-w-[1600px] mx-auto">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-[#0A3D91] font-quickstand mb-4 sm:mb-0">
            Saved Jobs
          </h1>
          <FilterMenu onApplyFilters={handleFilterApply} />
        </div>

        {filteredJobs.length === 0 ? (
          <p className="text-center text-gray-600 text-lg font-medium py-10">
            You haven’t saved any jobs yet or no jobs match your filters.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredJobs.map((job) => (
              <JobCard key={job.jobId} job={job} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SavedJobs;