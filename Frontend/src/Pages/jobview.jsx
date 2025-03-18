import React, { useState, useEffect } from "react";
import {
  Location, Briefcase, Wallet1, People, Star, Book, MedalStar, Timer, Element2,
  Messages3, Hashtag, ClipboardTick, ProfileTick, Calendar, Book1, ArrowRight2,
  ArrowLeft2
} from "iconsax-react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../Context/AuthContext";

const JobDetails = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const { BASE_URL, currentUser } = useAuth();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hasApplied, setHasApplied] = useState(false);
  const [showApplyConfirmPopup, setShowApplyConfirmPopup] = useState(false);
  const [applyStatusMessage, setApplyStatusMessage] = useState("");
  const [isSaved, setIsSaved] = useState(false);

  const fetchJobDetails = async (jobId) => {
    try {
      const token = localStorage.getItem("authToken");
      setLoading(true);
      
      // Fetch job details
      const jobResponse = await axios.get(`${BASE_URL}jobs/${jobId}`, { withCredentials: true });
      setJob(jobResponse.data.data);

      // Check if the user has already applied
      const appliedResponse = await axios.get(`${BASE_URL}appliedJobs/student/${currentUser.rollNumber}`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });
      const appliedJobs = appliedResponse.data.data || [];
      const isApplied = appliedJobs.some((opp) => opp.jobId === jobId);
      setHasApplied(isApplied);

      // Check if the user has already saved the job
      const savedResponse = await axios.get(`${BASE_URL}appliedJobs/saved/${currentUser.rollNumber}`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });
      const savedJobs = savedResponse.data.data || [];
      const isJobSaved = savedJobs.some((savedJob) => savedJob.jobId === jobId);
      setIsSaved(isJobSaved);

      // If apply link was visited in this session and not applied, show popup
      if (sessionStorage.getItem(`visitedApplyLink_${jobId}`) && !isApplied) {
        setShowApplyConfirmPopup(true);
      }
    } catch (error) {
      console.error("Error fetching data:", error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobDetails(jobId);

    const handleFocus = () => {
      if (sessionStorage.getItem(`visitedApplyLink_${jobId}`) && !hasApplied) {
        setShowApplyConfirmPopup(true);
      }
    };

    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, [jobId]);

  const handleApplyClick = () => {
    if (hasApplied) {
      window.open(job.applyLink, "_blank");
    } else {
      sessionStorage.setItem(`visitedApplyLink_${jobId}`, "true");
      window.open(job.applyLink, "_blank");
    }
  };

  const handleSaveJob = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await axios.post(
        `${BASE_URL}appliedJobs/saveJob`,
        { rollNumber: currentUser.username, jobId },
        { headers: { Authorization: `Bearer ${token}` }, withCredentials: true }
      );
      if (response.data.success) {
        setIsSaved(true);
        setApplyStatusMessage("Job saved successfully!");
        setTimeout(() => setApplyStatusMessage(""), 3000);
      }
    } catch (error) {
      console.error("Error saving job:", error.response?.data || error.message);
      const errorMsg = error.response?.data?.message || "Unknown error";
      if (errorMsg === "This job is already saved!") {
        setIsSaved(true);
        setApplyStatusMessage("This job is already saved!");
      } else {
        setApplyStatusMessage("Error saving job: " + errorMsg);
      }
      setTimeout(() => setApplyStatusMessage(""), 3000);
    }
  };

  const handleApplyConfirm = async (confirmed) => {
    setShowApplyConfirmPopup(false);
    if (confirmed) {
      try {
        const token = localStorage.getItem("authToken");
        const response = await axios.post(
          `${BASE_URL}appliedJobs/addApplication`,
          { rollNumber: currentUser.username, jobId },
          {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true,
          }
        );
        if (response.data.success) {
          setHasApplied(true);
          setApplyStatusMessage("Application saved successfully!");
          setTimeout(() => setApplyStatusMessage(""), 3000);
        }
      } catch (error) {
        console.error("Error saving application:", error.response?.data || error.message);
        const errorMsg = error.response?.data?.message || "Unknown error";
        if (errorMsg === "You have already applied") {
          setHasApplied(true);
          setApplyStatusMessage("You have already applied!");
        } else {
          setApplyStatusMessage("Error saving application: " + errorMsg);
        }
        setTimeout(() => setApplyStatusMessage(""), 3000);
      }
    }
    sessionStorage.removeItem(`visitedApplyLink_${jobId}`);
  };

  const handleBackClick = () => {
    navigate(-1);
  };

  const scrollToSection = (sectionId) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth" });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        <p className="ml-3 text-gray-600 text-sm font-medium">
          Loading job details...
        </p>
      </div>
    );
  }

  if (!job) {
    return <p className="text-center text-gray-500 text-sm py-4">Job not found.</p>;
  }

  return (
    <div className="relative min-h-screen">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm p-4 lg:p-6 lg:pr-72">
        <div className="flex items-center space-x-2 text-xs mb-4 whitespace-nowrap">
          <button
            onClick={handleBackClick}
            className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
          >
            <ArrowRight2 className="w-3 h-3 mr-1 rotate-180" />
            <span>Back to Launchpad</span>
          </button>
          <ArrowLeft2 className="w-3 h-3 mr-1 rotate-180" />
          <span className="text-gray-900 font-semibold truncate">
            {job.title}, {job.company}
          </span>
        </div>
        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-4 lg:p-6">
          <div className="flex items-center justify-center mb-6">
            <div className="text-center">
              <img
                src="https://via.placeholder.com/50"
                alt="Company Logo"
                className="w-12 h-12 rounded-full mx-auto mb-3"
              />
              <h4 className="text-sm font-medium text-gray-600">{job.company}</h4>
              <h1 className="text-2xl font-bold text-gray-900">{job.title}</h1>
            </div>
          </div>
          <p className="text-gray-700 text-sm text-center mb-4">
            {job.description?.text || "No additional job description available."}
          </p>
          <div className="flex text-gray-600 items-center justify-center mb-6 text-sm">
            <Calendar className="mr-2 text-blue-600 w-5 h-5" />
            <span className="mr-4">
              Posted: {job.createdAt ? new Date(job.createdAt).toLocaleDateString() : "N/A"}
            </span>
            <People className="mr-2 text-blue-600 w-5 h-5" />
            <span className="font-semibold">116 Applied</span>
          </div>
          <div className="flex items-center justify-center">
            <button
              onClick={handleApplyClick}
              className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${
                hasApplied
                  ? "bg-green-600 text-white hover:bg-green-700"
                  : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
            >
              {hasApplied ? "Applied" : "Apply Now"}
            </button>
          </div>
          {applyStatusMessage && (
            <p className={`text-center text-sm mt-2 ${applyStatusMessage.includes("Error") ? "text-red-600" : "text-green-600"}`}>
              {applyStatusMessage}
            </p>
          )}
        </div>
      </div>

      {/* Apply Confirmation Popup */}
      {showApplyConfirmPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-11/12 max-w-md shadow-xl transform transition-all scale-100">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Did You Apply?</h3>
            <p className="text-sm text-gray-600 mb-6">
              You visited the application link for <strong>{job.title}</strong>. Did you successfully apply for this job?
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => handleApplyConfirm(false)}
                className="px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-md hover:bg-gray-100 transition-colors"
              >
                No
              </button>
              <button
                onClick={() => handleApplyConfirm(true)}
                className="px-4 py-2 text-sm text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Navigation Options */}
      <div className="lg:hidden p-4 flex justify-around border-b border-gray-200 bg-white">
        <button
          onClick={() => scrollToSection("glance")}
          className="text-blue-600 font-medium text-sm hover:text-blue-800 transition-colors bg-blue-50 px-3 py-1 rounded-md"
        >
          Quick View
        </button>
        <button
          onClick={() => scrollToSection("overview")}
          className="text-blue-600 font-medium text-sm hover:text-blue-800 transition-colors bg-blue-50 px-3 py-1 rounded-md"
        >
          View Overview
        </button>
      </div>

      {/* Main Layout */}
      <div className="flex flex-col lg:flex-row lg:space-x-6 p-4 lg:p-6">
        <div
          id="glance"
          className="w-full lg:w-64 bg-white p-4 lg:p-3 rounded-lg shadow-md border border-gray-200 mb-6 lg:mb-0 lg:fixed lg:top-20 lg:right-6 lg:h-[calc(100vh-auto)] lg:overflow-y-auto order-1 lg:order-2"
        >
          <h2 className="text-base font-semibold mb-3 text-gray-800">At a Glance</h2>
          <div className="space-y-2 text-xs text-gray-700">
            <div className="flex items-center">
              <Element2 className="mr-1.5 text-blue-600 w-4 h-4" />
              <span>{job.type || "Job Type"}</span>
            </div>
            <div className="flex items-center">
              <Location className="mr-1.5 text-blue-600 w-4 h-4" />
              <span>{job.location || "Location not available"}</span>
            </div>
            <div className="flex items-center">
              <Timer className="mr-1.5 text-blue-600 w-4 h-4" />
              <span>{job.modeOfWork || "Full Time"}</span>
            </div>
            <div className="flex items-center">
              <Briefcase className="mr-1.5 text-blue-600 w-4 h-4" />
              <span>Fresher</span>
            </div>
            <div className="flex items-center">
              <Wallet1 className="mr-1.5 text-blue-600 w-4 h-4" />
              <span>{job.stipend ? `$${job.stipend}` : "Not disclosed"}</span>
            </div>
            <div className="flex items-center">
              <Hashtag className="mr-1.5 text-blue-600 w-4 h-4" />
              <span>{job.jobId}</span>
            </div>
          </div>
          <div className="mt-3 flex flex-col space-y-2 lg:flex-row lg:space-y-0 lg:space-x-2">
            <button
              onClick={handleSaveJob}
              className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                isSaved
                  ? "bg-red-600 text-white hover:bg-red-700"
                  : "bg-gray-200 text-gray-800 hover:bg-gray-300"
              }`}
            >
              {isSaved ? "Saved" : "Save Job"}
            </button>
            <button
              onClick={handleApplyClick}
              className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                hasApplied
                  ? "bg-green-600 text-white hover:bg-green-700"
                  : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
            >
              {hasApplied ? "Applied" : "Apply Now"}
            </button>
          </div>
          <h2 className="text-base font-semibold mb-3 mt-4 text-gray-800">Student Perks</h2>
          <div className="space-y-2 text-xs text-gray-700">
            <div className="flex items-center">
              <Book1 className="mr-1.5 text-blue-600 w-4 h-4" />
              <span>Mentorship available</span>
            </div>
            <div className="flex items-center">
              <Messages3 className="mr-1.5 text-blue-600 w-4 h-4" />
              <span>Access to Pods</span>
            </div>
            <div className="flex items-center">
              <MedalStar className="mr-1.5 text-blue-600 w-4 h-4" />
              <span>Certification provided</span>
            </div>
            <div className="flex items-center">
              <ClipboardTick className="mr-1.5 text-blue-600 w-4 h-4" />
              <span>Resume & Interview Help</span>
            </div>
            <div className="flex items-center">
              <ProfileTick className="mr-1.5 text-blue-600 w-4 h-4" />
              <span>Exclusive Networking</span>
            </div>
          </div>
        </div>

        <div id="overview" className="flex-1 lg:order-1 order-2 lg:pr-72">
          <div className="h-1 bg-gradient-to-r from-blue-600 to-gray-900 my-6"></div>
          <div className="bg-white p-4 lg:p-6 rounded-lg shadow-md border border-gray-200">
            <h3 className="text-lg font-semibold mb-2 text-gray-900">Job Description</h3>
            <p className="text-gray-700 text-sm mb-6 leading-relaxed">
              {job.description?.text || "No additional job description available."}
            </p>
            {job.description?.requirements && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2 text-gray-900">Qualifications & Requirements</h3>
                <ul className="list-disc list-inside text-gray-700 text-sm space-y-2">
                  {job.description.requirements.experience && (
                    <li>{job.description.requirements.experience}</li>
                  )}
                  {job.description.requirements.tools && (
                    <li>Proficiency in {job.description.requirements.tools.join(", ")}</li>
                  )}
                  {job.description.requirements.skills && (
                    <li>Strong understanding of {job.description.requirements.skills.join(", ")}</li>
                  )}
                  {job.description.requirements.platforms && (
                    <li>Experience designing for {job.description.requirements.platforms.join(", ")}</li>
                  )}
                  {job.description.requirements.team && (
                    <li>Ability to work within {job.description.requirements.team}</li>
                  )}
                  {job.description.requirements.bonus && (
                    <li>Familiarity with {job.description.requirements.bonus.join(", ")} is a plus</li>
                  )}
                </ul>
              </div>
            )}
            {job.description?.benefits && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2 text-gray-900">Benefits & Perks</h3>
                <ul className="list-disc list-inside text-gray-700 text-sm space-y-2">
                  {job.description.benefits.salary && (
                    <li>Competitive salary and stock options</li>
                  )}
                  {job.description.benefits.health && (
                    <li>Health and wellness programs</li>
                  )}
                  {job.description.benefits.learning && (
                    <li>Learning and development budget</li>
                  )}
                  {job.description.benefits.workOptions && (
                    <li>Remote or hybrid work options based on location</li>
                  )}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetails;