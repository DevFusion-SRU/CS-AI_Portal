import React from "react";
import { useNavigate } from "react-router-dom";
import { Heart, Location, Element2,Clock, User, Timer, Wallet } from "iconsax-react";





const JobCard = ({ job }) => {
  
  const navigate = useNavigate();

  const handleViewClick = () => {
  navigate(`/jobview/${job.jobId}`);
};



  



  return (
    <div className="w-full bg-white rounded-lg shadow-md p-5 px-4 py-8 border border-gray-200 transition-all hover:shadow-lg">
      {/* Header - Company Name */}
      <div className="flex justify-between items-center mb-2">
        <h2 className=" font-ptsans text-ag-body leading-auto text-[#222222]">{job.company}</h2>
        <button className="text-gray-400 hover:text-red-500">
          <Heart size={20} color="#0A3D91"/> 
        </button>
      </div>

      {/* Job Title & Details (Aligned Properly) */}
      <div className="flex flex-col md:flex-row justify-between md:items-center">
        <div>
          <h2 className="font-bold font-Quickstand text-h5 leading-[36px]text-[#222222]">{job.title}</h2>
          {job.location && (
            <p className="font-pt text-ag-body-small text-customGray flex items-center mt-1">
              <Location size={20} color="#0A3D91"className="mr-2" /> {/* Darker color */}
              {job.location}
            </p>
          )}
        </div>

        {/* Right-Side Content (Aligned Right) */}
        <div className="ml-auto text-right">
          <p className="font-pt text-ag-body-small text-customGray flex items-center justify-end">
            <Clock size={20} color="#0A3D91"className="mr-2" /> {/* Darker color */}
            {job.deadline
              ? new Date(job.deadline).toLocaleDateString("en-US", {
                  weekday: "short",
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })
              : "No deadline"}
          </p>
          <p className="font-pt text-ag-body-small text-customGray flex items-center justify-end mt-1">
            <User size={20} color="#0A3D91"className="mr-2" /> {/* Darker color */}
            116 Applied
          </p>
        </div>
      </div>

      {/* Blue Divider for Separation */}
      <hr className="my-3 border-t-2 border-[#0A3D91]" />

      {/* Job Details */}
      <div className="flex flex-col mt-4 md:flex-row justify-between md:items-center">
      <ul className="flex flex-wrap gap-4 font-lato text-customGray">
  <li className="flex items-center">
    <Element2 size={20} color="#0A3D91" className="mr-2"/>
    UI/UX Designer
  </li>
  <li className="flex items-center">
    <Timer size={20} color="#0A3D91" className="mr-2" />
    {job.type}
  </li>
  {job.stipend && job.type !== "Hackathon" && (
    <li className="flex items-center">
      <Wallet size={20} color="#0A3D91" className="mr-2" />
      {job.stipend}
    </li>
  )}
</ul>


        {/* View Details Button */}
        <div className="mt-4 md:mt-0">
          <button

          
            
            onClick={handleViewClick}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-gradient-to-r from-blue-600 to-blue-400 text-white font-lato font-medium px-5 py-2 rounded-lg shadow-md hover:shadow-lg transition-all">

            View Details
            </button>
        </div>
      </div>
    </div>
  );
};

export default JobCard;
