import React ,{useState,useEffect}from "react";
import {
  Location, Briefcase, Wallet1, People, Star, Book, MedalStar, Timer, Element2,
  Messages3, Hashtag, ClipboardTick, ProfileTick, Calendar, Book1 ,ArrowRight2
} from "iconsax-react";
import images from "../utils/importImages";
import { useLocation,NavLink, useParams,useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../Context/AuthContext";

const JobDetails = () => {
  
  const { jobId } = useParams();
  const navigate = useNavigate();
  const { BASE_URL } = useAuth();
  const [job, setJob] = useState(null);

 

  const call = async (jobId)=> {
    try{
    const response = await axios.get(`${BASE_URL}jobs/${jobId}`, {
      withCredentials: true, // Ensure cookies are sent with the request
    });

    setJob(response.data.data); // Update the state with fetched job data
  }
  catch (error) {
    console.error(
      "Error fetching data:",
      error.response?.data || error.message
    );

    

  }}


  useEffect(()=>{
    call(jobId);
  },[])
  
  if (!job) {
    return <p className="text-center text-gray-500">Loading job details...</p>;
  }

  return (
    <div className="flex flex-col mt-10 px-4 lg:px-20 min-h-screen">
      {/* Header */}
      <h1 className="font-quickstand text-h6 text-[#0A3D91] font-bold leading-[72px] flex items-center">
        Launchpad
        <span>
          <img src="/images/svgg.png" alt="Launchpad Icon" className="w-10 h-10 ml-2" />
        </span>
      </h1>
      
      {/* Breadcrumbs */}
      <ul className="flex items-center ml-8 space-x-4 text-blue-600 font-semibold">
      <button onClick={() => navigate("/")} className="hover:underline flex items-center text-blue-700">
  ← Back to Launchpad
</button>
        <li className="flex items-center text-blue-700">
          <ArrowRight2 className="mr-2" />
          {job.title}, {job.company}
        </li>
      </ul>
      
      {/* Main Section */}
      <div className="flex flex-col lg:flex-row mt-6">
        {/* Left Section */}
        <div className="flex-1 lg:mr-10 p-6 flex flex-col">
          <div className="flex flex-col items-center mb-6">
            <img src="https://via.placeholder.com/50" alt="Company Logo" className="w-12 h-12 rounded-full mb-2" />
            <h4 className="text-sm font-medium">{job.company || "Company Name"}</h4>
            <h1 className="text-2xl font-bold">{job.title || "Job Title"}</h1>
          </div>

          {/* Job Meta Info */}
          <div className="flex text-gray-600 items-center justify-center mb-6">
            <Calendar className="mr-2 text-blue-700" />
            <span className="mr-4">Posted: {job.createdAt ? new Date(job.createdAt).toLocaleDateString() : "N/A"}</span>
            <People className="mr-2 text-blue-700" />
            <span className="font-semibold">116 Applied</span>
          </div>

          {/* Apply Now Button */}
          <div className="flex items-center justify-center mb-6">
            <a href={job.applyLink || "#"} target="_blank" rel="noopener noreferrer" className="bg-blue-500 text-white px-4 p-2 rounded-md cursor-pointer hover:bg-blue-700">Apply now</a>
          </div>

          {/* Job Description */}
          <div className="bg-gray-50 p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-2">About the Opportunity</h2>
            <p className="text-gray-700 mb-6">{job.description?.text || "No additional job description available."}</p>

            {/* Responsibilities */}
            {job.description?.requirements?.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">Key Responsibilities</h3>
                <ul className="list-disc list-inside text-gray-700 text-sm">
                  {job.description.requirements.map((req, index) => (
                    <li key={index}>{req}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Right Section - At a Glance */}
        <div className="w-full lg:w-[30%] p-6 bg-white rounded-lg shadow-md flex flex-col sticky top-20 max-h-[80vh] overflow-y-auto">
          <h2 className="text-lg font-semibold mb-4">At a Glance</h2>
          <div className="space-y-4 text-sm">
            <div className="flex items-center"><Element2 className="mr-2 text-blue-700" /><span>{job.type || "Job Type"}</span></div>
            <div className="flex items-center"><Location className="mr-2 text-blue-700" /><span>{job.location || "Location not available"}</span></div>
            <div className="flex items-center"><Briefcase className="mr-2 text-blue-700" /><span>Fresher</span></div>
            <div className="flex items-center"><Wallet1 className="mr-2 text-blue-700" /><span>{job.stipend ? `$${job.stipend}` : "Not disclosed"}</span></div>
            <div className="flex items-center"><Hashtag className="mr-2 text-blue-700" /><span>{job.jobId || "N/A"}</span></div>
          </div>

          {/* Apply & Save Buttons */}
          <div className="flex justify-between mt-4">
            <a href="#" className="border border-blue-700 text-blue-700 px-4 p-2 rounded-md cursor-pointer hover:bg-blue-300">Save</a>
            <a href={job.applyLink || "#"} target="_blank" rel="noopener noreferrer" className="bg-blue-500 text-white px-4 p-2 rounded-md cursor-pointer hover:bg-blue-700">Apply now</a>
          </div>

          {/* Student Perks */}
          <div className="mt-6">
            <h2 className="text-lg font-semibold mb-4">Student Perks</h2>
            <div className="space-y-4 text-sm">
              <div className="flex items-center"><Book1 className="mr-2 text-blue-700" /><span>Mentorship available</span></div>
              <div className="flex items-center"><Messages3 className="mr-2 text-blue-700" /><span>Access to Pods</span></div>
              <div className="flex items-center"><MedalStar className="mr-2 text-blue-700" /><span>Certification provided</span></div>
              <div className="flex items-center"><ClipboardTick className="mr-2 text-blue-700" /><span>Resumes and interview assistance</span></div>
              <div className="flex items-center"><ProfileTick className="mr-2 text-blue-700" /><span>Exclusive Networking</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  


};

export default JobDetails;
