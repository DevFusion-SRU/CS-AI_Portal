import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Heart, Location, Element2, Clock, Timer, Wallet, Profile } from "iconsax-react"; // Changed User to Profile
import axios from "axios";
import { useAuth } from "../Context/AuthContext";

// Function to generate a consistent random number (1-4) based on jobId
const getConsistentRandomCount = (jobId) => {
  let hash = 0;
  for (let i = 0; i < jobId.length; i++) {
    hash = (hash << 5) - hash + jobId.charCodeAt(i);
    hash |= 0;
  }
  return 1 + (Math.abs(hash) % 4);
};

const JobCard = ({ job }) => {
  const navigate = useNavigate();
  const { BASE_URL, currentUser } = useAuth();
  const [appliedCount, setAppliedCount] = useState(null);
  const [isSaved, setIsSaved] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");

  useEffect(() => {
    const checkSavedStatus = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const response = await axios.get(
          `${BASE_URL}appliedJobs/saved/${currentUser.rollNumber}`,
          {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true,
          }
        );
        const savedJobs = response.data.data || [];
        const isJobSaved = savedJobs.some((savedJob) => savedJob.jobId === job.jobId);
        setIsSaved(isJobSaved);
      } catch (error) {
        console.error("Error checking saved status:", error);
      }
    };

    if (currentUser) {
      checkSavedStatus();
    }

    const count = getConsistentRandomCount(job.jobId);
    setAppliedCount(count);
  }, [job.jobId, currentUser, BASE_URL]);

  const handleViewClick = () => {
    navigate(`/jobs/${job.jobId}`);
  };

  const handleSaveJob = async () => {
    if (!currentUser) {
      setSaveMessage("Please log in to save jobs");
      setTimeout(() => setSaveMessage(""), 3000);
      return;
    }

    try {
      const token = localStorage.getItem("authToken");
      const response = await axios.post(
        `${BASE_URL}appliedJobs/saveJob`,
        { rollNumber: currentUser.username, jobId: job.jobId },
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );
      
      if (response.data.success) {
        setIsSaved(true);
        setSaveMessage("Job saved successfully!");
        setTimeout(() => setSaveMessage(""), 3000);
      }
    } catch (error) {
      console.error("Error saving job:", error.response?.data || error.message);
      const errorMsg = error.response?.data?.message || "Unknown error";
      if (errorMsg === "This job is already saved!") {
        setIsSaved(true);
        setSaveMessage("This job is already saved!");
      } else {
        setSaveMessage("Error saving job: " + errorMsg);
      }
      setTimeout(() => setSaveMessage(""), 3000);
    }
  };

  const getCategory = () => {
    try {
      if (job.category && typeof job.category === "string" && job.category.trim()) {
        return job.category;
      }
      return "SDE";
    } catch (error) {
      console.error("Error rendering category:", error, "Raw category:", job.category);
      return "SDE";
    }
  };

  return (
    <div className="w-full bg-white rounded-lg shadow-md p-4 border border-gray-200 transition-all hover:shadow-lg relative">
      {/* Header - Company Name */}
      <div className="flex justify-between items-center mb-2">
        <h2 className="font-ptsans text-base leading-tight text-[#222222]">{job.company}</h2>
        <button 
          onClick={handleSaveJob}
          className="text-gray-400 hover:text-red-500 transition-colors"
          title={isSaved ? "Job saved" : "Save job"}
        >
          <Heart 
            size={18} 
            color={isSaved ? "#FF0000" : "#0A3D91"} 
            variant={isSaved ? "Bold" : "Outline"}
          />
        </button>
      </div>

      {/* Job Title & Details */}
      <div className="flex flex-col md:flex-row justify-between md:items-center">
        <div>
          <h2 className="font-bold font-Quickstand text-lg leading-6 text-[#222222]">{job.title}</h2>
          {job.location && (
            <p className="font-pt text-sm text-customGray flex items-center mt-1">
              <Location size={16} color="#0A3D91" className="mr-1" />
              {job.location}
            </p>
          )}
        </div>

        {/* Right-Side Content */}
        <div className="ml-auto text-right mt-2 md:mt-0">
          <p className="font-pt text-xs text-customGray flex items-center justify-end whitespace-nowrap">
            <Clock size={16} color="#0A3D91" className="mr-1" />
            {job.deadline
              ? new Date(job.deadline).toLocaleDateString("en-US", {
                  weekday: "short",
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })
              : "No deadline"}
          </p>
          <p className="font-pt text-xs text-customGray flex items-center justify-end mt-1">
            <Profile size={16} color="#0A3D91" className="mr-1" /> {/* Changed User to Profile */}
            {appliedCount !== null ? `${appliedCount} Applied` : "Loading..."}
          </p>
        </div>
      </div>

      {/* Blue Divider */}
      <hr className="my-2 border-t border-[#0A3D91]" />

      {/* Job Details */}
      <div className="flex flex-col md:flex-row justify-between md:items-center">
        <ul className="flex flex-wrap gap-3 font-lato text-customGray text-sm">
          <li className="flex items-center">
            <Element2 size={16} color="#0A3D91" className="mr-1" />
            {getCategory()}
          </li>
          <li className="flex items-center">
            <Timer size={16} color="#0A3D91" className="mr-1" />
            {job.type}
          </li>
          {job.stipend && job.type !== "Hackathon" && (
            <li className="flex items-center">
              <Wallet size={16} color="#0A3D91" className="mr-1" />
              {job.stipend}
            </li>
          )}
        </ul>

        {/* View Details Button */}
        <div className="mt-3 md:mt-0">
          <a
            onClick={handleViewClick}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-gradient-to-r from-blue-600 to-blue-400 text-white font-lato text-xs font-medium px-5 py-1.5 rounded-lg shadow-md hover:shadow-lg transition-all whitespace-nowrap"
          >
            View Details
          </a>
        </div>
      </div>

      {/* Save Message */}
      {saveMessage && (
        <div className={`absolute bottom-2 left-2 right-2 text-center text-xs p-2 rounded ${
          saveMessage.includes("Error") ? "text-red-600 bg-red-100" : "text-green-600 bg-green-100"
        }`}>
          {saveMessage}
        </div>
      )}
    </div>
  );
};

export default JobCard;