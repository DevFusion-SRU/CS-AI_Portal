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
  const { BASE_URL } = useAuth();
  const [job, setJob] = useState(null);

  const fetchJobDetails = async (jobId) => {
    try {
      const response = await axios.get(`${BASE_URL}jobs/${jobId}`, { withCredentials: true });
      setJob(response.data.data);
    } catch (error) {
      console.error("Error fetching data:", error.response?.data || error.message);
    }
  };

  useEffect(() => {
    fetchJobDetails(jobId);
  }, [jobId]);

  if (!job) {
    return <p className="text-center text-gray-500 text-sm py-4">Loading job details...</p>;
  }

  const handleBackClick = () => {
    navigate(-1);
  };

  const scrollToSection = (sectionId) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="relative min-h-screen ">
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
          {/* <p className="text-gray-400"></p> */}
          <ArrowLeft2 className="w-3 h-3 mr-1 rotate-180" />
          <span className="text-gray-900 font-semibold truncate">
            {job.title || "Health Coach III"}, {job.company || "Realcube"}
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
              <h4 className="text-sm font-medium text-gray-600">{job.company || "Company Name"}</h4>
              <h1 className="text-2xl font-bold text-gray-900">{job.title || "Job Title"}</h1>
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
            <a
              href={job.applyLink || "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-blue-600 text-white px-6 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
            >
              Apply Now
            </a>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Options (Under Header, Not Fixed) */}
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
        {/* Mobile: Sidebar First | Large Screen: Fixed Right Section */}
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
              <span>Full Time</span>
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
              <span>{job.jobId || "N/A"}</span>
            </div>
          </div>
          <div className="mt-3 flex flex-col space-y-2 lg:flex-row lg:space-y-0 lg:space-x-2">
            <button className="border-2 border-blue-600 text-blue-600 px-3 py-1 rounded-md text-xs font-medium hover:bg-blue-50 transition-colors">
              Save Job
            </button>
            <a
              href={job.applyLink || "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-blue-600 text-white px-3 py-1 rounded-md text-xs font-medium hover:bg-blue-700 transition-colors text-center"
            >
              Apply Now
            </a>
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

        {/* Mobile: Overview Second | Large Screen: Left Section */}
        <div
          id="overview"
          className="flex-1 lg:order-1 order-2 lg:pr-72"
        >
          <div className="h-1 bg-gradient-to-r from-blue-600 to-gray-900 my-6"></div>
          <div className="bg-white p-4 lg:p-6 rounded-lg shadow-md border border-gray-200">
            <h3 className="text-lg font-semibold mb-2 text-gray-900">Job Description</h3>
            <p className="text-gray-700 text-sm mb-6 leading-relaxed">
              {job.description?.text || "No additional job description available."}
            </p>

            {job.description?.requirements?.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2 text-gray-900">Key Responsibilities</h3>
                <ul className="list-disc list-inside text-gray-700 text-sm space-y-2">
                  {job.description.requirements.map((req, index) => (
                    <li key={index}>{req}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2 text-gray-900">Qualifications & Requirements</h3>
              <ul className="list-disc list-inside text-gray-700 text-sm space-y-2">
                <li>5+ years of experience in UX/UI design in a product-driven environment</li>
                <li>Proficiency in Figma, Sketch, Adobe XD, and prototyping tools</li>
                <li>Strong understanding of user research, usability principles, and interaction design</li>
                <li>Experience designing for mobile, web, and multi-platform products</li>
                <li>Ability to work within agile product development teams</li>
                <li>Familiarity with HTML, CSS, and front-end frameworks is a plus</li>
              </ul>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2 text-gray-900">Benefits & Perks</h3>
              <ul className="list-disc list-inside text-gray-700 text-sm space-y-2">
                <li>Competitive salary and stock options</li>
                <li>Health and wellness programs</li>
                <li>Learning and development budget</li>
                <li>Remote or hybrid work options based on location</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetails;