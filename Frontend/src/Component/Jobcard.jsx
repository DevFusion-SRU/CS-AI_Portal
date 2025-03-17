import React from "react";
import { useNavigate } from "react-router-dom";
import { Heart, Location, Element2, Clock, User, Timer, Wallet } from "iconsax-react";

const JobCard = ({ job }) => {
  const navigate = useNavigate();

  const handleViewClick = () => {
    navigate(`/jobs/${job.jobId}`);
  };

  return (
    <div className="w-full bg-white rounded-lg shadow-md p-4 border border-gray-200 transition-all hover:shadow-lg">
      {/* Header - Company Name */}
      <div className="flex justify-between items-center mb-2">
        <h2 className="font-ptsans text-base leading-tight text-[#222222]">{job.company}</h2>
        <button className="text-gray-400 hover:text-red-500">
          <Heart size={18} color="#0A3D91" />
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
            <User size={16} color="#0A3D91" className="mr-1" />
            116 Applied
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
            UI/UX Designer
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
    </div>
  );
};

export default JobCard;