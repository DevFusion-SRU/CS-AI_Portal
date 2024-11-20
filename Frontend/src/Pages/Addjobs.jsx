import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Addjobs = () => {
  const navigate = useNavigate();
  const [jobData, setJobData] = useState({
    id: "",
    name: "",
    company: "",
    type: "",
    description: "",
    applylink: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setJobData((prevData) => ({
      ...prevData,
      [name]: value // Dynamically set the key based on the name attribute
    }));
  };

  // State for file upload
  const [fileName, setFileName] = useState('');

  const handleAddClick = () => {
    navigate('/');
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileName(file.name);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically send jobData to a backend API
    // Example for form submission with file upload (using FormData):
    // const formData = new FormData();
    // formData.append("jobData", JSON.stringify(jobData));
    // formData.append("file", file);

    // Example submission logic
    alert("Job added successfully!");
    navigate('/');
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
                name="name" // Changed to match state
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
                name="id" // Changed to match state
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
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
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

          {/* Upload Icon */}
          <div>
            <label htmlFor="upload" className="block text-sm font-medium text-gray-700">
              Upload File
            </label>
            <div className="mt-1 flex items-center space-x-4">
              <input
                type="file"
                id="upload"
                className="hidden"
                onChange={handleFileChange}
              />
              <label
                htmlFor="upload"
                className="px-4 py-2 bg-gray-200 text-sm font-medium text-gray-700 rounded-md shadow cursor-pointer hover:bg-gray-300"
              >
                Choose File
              </label>
              <span className="text-gray-500 text-sm">{fileName || 'No file chosen'}</span>
            </div>
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
