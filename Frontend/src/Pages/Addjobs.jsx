import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Addjobs = () => {
  const navigate = useNavigate();
  const [jobData, setJobData] = useState({
    id: "",
    name: "",
    company: "",
    type: "Internship",
    description: "",
    applyLink: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setJobData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleAddClick = () => {
    navigate('/');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(jobData) // Prevent page refresh on form submission
    try {
      const response = await fetch("http://localhost:5000/api/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`
         },
        body: JSON.stringify(jobData),
      });
      if (response.ok) {
        alert("Job successfully added!");
        setJobData({
          id: "",
          name: "",
          company: "",
          type: "Internship",
          description: "",
          applyLink: "",
        });
      } else {
        alert("Failed to add job application.");
      }
    } catch (error) {
      console.error("Error submitting job application:", error);
    }
  };

  return (
    <div className="w-full flex flex-col items-center px-10 py-20 border rounded-md shadow-sm">
      <div className="w-full flex flex-col items-center bg-gray-100 px-8 py-20 border border-gray-300 rounded-md shadow-sm">
        <form className="w-full max-w-6xl" onSubmit={handleSubmit}>
          {/* Title and Job ID */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Title
              </label>
              <input
                type="text"
                name="name"
                value={jobData.name}
                onChange={handleChange}
                placeholder="Enter job title"
                required
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label htmlFor="id" className="block text-sm font-medium text-gray-700">
                Job ID
              </label>
              <input
                type="text"
                name="id"
                value={jobData.id}
                onChange={handleChange}
                placeholder="Enter job ID"
                required
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Company Name and Type */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="company" className="block text-sm font-medium text-gray-700">
                Company Name
              </label>
              <input
                type="text"
                name="company"
                value={jobData.company}
                onChange={handleChange}
                placeholder="Enter company name"
                required
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label htmlFor="type" className="block text-sm font-medium text-gray-700">
                Type
              </label>
              <select
                id="type"
                name="type"
                value={jobData.type}
                onChange={handleChange}
                required
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="Internship">Internship</option>
                <option value="Fulltime">Fulltime</option>
                <option value="Parttime">Hackathon</option>
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={jobData.description}
              onChange={handleChange}
              rows="4"
              placeholder="Enter job description"
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            ></textarea>
          </div>

          {/* Apply URL */}
          <div>
            <label htmlFor="applyLink" className="block text-sm font-medium text-gray-700">
              URL
            </label>
            <input
              type="url"
              name="applyLink"
              value={jobData.applyLink}
              onChange={handleChange}
              placeholder="Enter URL"
              required
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-4">
            <button
              onClick={handleAddClick}
              type="button"
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md shadow hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              Close
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-md shadow hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Add
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Addjobs;
