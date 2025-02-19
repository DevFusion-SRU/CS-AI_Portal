import React from 'react';
import { Location, Briefcase, Wallet1, People, Star, Book, MedalStar, Timer, Element2, Messages3, Hashtag, ClipboardTick, ProfileTick, Calendar, Book1 } from 'iconsax-react';
import images from "../utils/importImages";
import { useNavigate } from "react-router-dom";

const JobDetails = ({}) => {
  const navigate = useNavigate();

  const handleAddClick = () => {
    navigate("/Launchpad"); // Adjust path as needed
  };

  return (
    <div className="flex flex-col mt-10 space-x-10 min-h-screen">
      <h1 className="font-quickstand text-h6 text-[#0A3D91] font-bold leading-[72px] flex items-center">
        Launchpad
        <span>
          <img src={images["svgg.png"]} alt="Launchpad Icon" className="w-10 h-10 ml-2" />
        </span>
      </h1>
      <div className="mt-4 md:mt-0">
        <div
          onClick={handleAddClick} // Trigger navigation on click
          className="font-Lato text-[#1B85FF] relative h2 font-bold text-h4 flex items-center space-x-2 hover:text-blue-700 cursor-pointer transition duration-200"
        >
          
          Launchpad
        </div>
      </div>

      <div className="flex flex-col lg:flex-row lg:p-6 bg-white rounded-lg shadow-md">
        {/* Left Section */}
        <div className="flex-1 lg:mr-72">
          <div className="bg-gray-50 p-6">
            <div className="flex items-center justify-center mb-6">
              <div className="text-center">
                <img
                  src="https://via.placeholder.com/50"
                  alt="Company Logo"
                  className="w-12 h-12 rounded-full mx-auto mb-2"
                />
                <h4 className="text-sm font-medium">Facebook</h4>
                <h1 className="text-2xl font-bold">Senior UX Designer</h1>
              </div>
            </div>
            <p className="text-gray-700 text-center">
              Facebook is seeking a Senior UX Designer to create seamless, engaging, and accessible user experiences.
            </p>
            <div className="flex text-gray-600 items-center justify-center mb-6">
              <Calendar className="mr-2 text-blue-700" />
              <span className='mr-4'>Posted: 11th November 2024</span>
              <People className='mr-2 text-blue-700'/>
              <span className="font-semibold">116 Applied</span>
            </div>
            <div className='flex items-center justify-center'>
              <div
                onClick={() => alert("Apply now clicked")} // Replace with actual navigation if needed
                className="bg-blue-500 text-white px-4 p-2 rounded-md cursor-pointer"
              >
                Apply now
              </div>
            </div>
          </div>
          <div className="h-0.5 bg-gradient-to-r from-blue-500 to-black"></div>

          {/* About the Opportunity */}
          <div className='bg-gray-50 p-6 rounded-lg shadow-md mt-6'>
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2">About the Opportunity</h2>
              <h3 className="text-l font-semibold mb-2">Job Description</h3>
              <p className="text-gray-700 mb-6">
                As a Senior UX Designer at Facebook, you will be responsible for conducting user research, usability testing, and data analysis to improve design decisions. You will create wireframes, prototypes, and high-fidelity UI designs to enhance user flows. Collaborating with product managers, engineers, and content strategists, you will define UX strategies. You will also maintain consistency with Facebook’s design system while ensuring accessibility and inclusivity. Additionally, you will use A/B testing, analytics, and feedback loops to iterate and refine designs.
              </p>
            </div>

            {/* Key Responsibilities */}
            <div className="mb-6">
              <h3 className="text-l font-semibold mb-2">Key Responsibilities</h3>
              <ul className="list-disc list-inside text-gray-700 text-sm">
                <li>Conduct user research, usability testing, and data analysis to improve design decisions</li>
                <li>Create wireframes, prototypes, and high-fidelity UI designs to enhance user flows</li>
                <li>Collaborate with product managers, engineers, and content strategists to define UX strategies</li>
                <li>Maintain consistency with Facebook’s design system while ensuring accessibility and inclusivity</li>
                <li>Use A/B testing, analytics, and feedback loops to iterate and refine designs</li>
              </ul>
            </div>

            {/* Qualifications & Requirements */}
            <div className="mb-6">
              <h3 className="text-l font-semibold mb-2">Qualifications & Requirements</h3>
              <ul className="list-disc list-inside text-gray-700 text-sm">
                <li>5+ years of experience in UX/UI design in a product-driven environment</li>
                <li>Proficiency in Figma, Sketch, Adobe XD, and prototyping tools</li>
                <li>Strong understanding of user research, usability principles, and interaction design</li>
                <li>Experience designing for mobile, web, and multi-platform products</li>
                <li>Ability to work within agile product development teams</li>
                <li>Familiarity with HTML, CSS, and front-end frameworks is a plus</li>
              </ul>
            </div>

            {/* Benefits & Perks */}
            <div className="mb-6">
              <h3 className="text-l font-semibold mb-2">Benefits & Perks</h3>
              <ul className="list-disc list-inside text-gray-700 text-sm">
                <li>Competitive salary and stock options</li>
                <li>Health and wellness programs</li>
                <li>Learning and development budget</li>
                <li>Remote or hybrid work options based on location</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Right Section */}
        <div className="lg:w-auto fixed right-6 top-15 p-8 rounded-lg shadow-md">
          <div className="">
            <h2 className="text-lg font-semibold mb-4">At a glance</h2>
            <div className="space-y-2 text-sm">
              <div className="flex items-center">
                <Element2 className="mr-2 text-blue-700" />
                <span>Design & UX</span>
              </div>
              <div className="flex items-center">
                <Location className="mr-2 text-blue-700" />
                <span>Florida, USA</span>
              </div>
              <div className="flex items-center">
                <Timer className="mr-2 text-blue-700" />
                <span>Full time</span>
              </div>
              <div className="flex items-center">
                <Briefcase className="mr-2 text-blue-700" />
                <span>Fresher</span>
              </div>
              <div className="flex items-center">
                <Wallet1 className="mr-2 text-blue-700" />
                <span>$100,000 - $120,000</span>
              </div>
              <div className="flex items-center">
                <Hashtag className="mr-2 text-blue-700" />
                <span>FB01022025UX</span>
              </div>
              <div className="mt-4 flex space-x-8">
                <div
                  onClick={() => alert("Save clicked")}
                  className="border-2 border-blue-500 text-blue-800 px-4 py-1 rounded-md cursor-pointer"
                >
                  Save
                </div>
                <div
                  onClick={() => alert("Apply now clicked")}
                  className="bg-blue-500 text-white px-4 py-1 rounded-md cursor-pointer"
                >
                  Apply now
                </div>
              </div>
            </div>
          </div>

          <div className="">
            <h2 className="text-lg font-semibold mb-4 mt-6">Student perks</h2>
            <div className="space-y-2 text-sm">
              <div className="flex items-center">
                <Book1 className="mr-2 text-blue-700" />
                <span>Mentorship available</span>
              </div>
              <div className="flex items-center">
                <Messages3 className="mr-2 text-blue-700" />
                <span>Access to Pods</span>
              </div>
              <div className="flex items-center">
                <MedalStar className="mr-2 text-blue-700" />
                <span>Certification provided</span>
              </div>
              <div className="flex items-center">
                <ClipboardTick className="mr-2 text-blue-700" />
                <span>Resumes and interview assistance</span>
              </div>
              <div className="flex items-center">
                <ProfileTick className="mr-2 text-blue-700" />
                <span>Exclusive Networking</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetails;
