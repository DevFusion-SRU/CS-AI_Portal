import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";

const Addjobs = () => {
  const navigate = useNavigate();
  const { BASE_URL } = useAuth();

  const [state, setState] = useState({
    errors: {},
    isSubmitting: false,
    modalMessage: "",
    modalType: "",
    isModalOpen: false,
    jobData: {
      id: "",
      name: "",
      company: "",
      type: "Internship",
      description: "",
      applyLink: "",
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setState((prev) => ({
      ...prev,
      jobData: {
        ...prev.jobData,
        [name]: value,
      },
    }));
  };

  const handleAddClick = () => navigate("/");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setState((prev) => ({ ...prev, isSubmitting: true }));
    try {
      const response = await fetch(`${BASE_URL}jobs`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
        body: JSON.stringify(state.jobData),
      });

      if (response.ok) {
        setState((prev) => ({
          ...prev,
          modalMessage: "Job successfully added!",
          modalType: "success",
          jobData: {
            id: "",
            name: "",
            company: "",
            type: "Internship",
            description: "",
            applyLink: "",
          },
        }));
      } else {
        setState((prev) => ({
          ...prev,
          modalMessage: "Failed to add job application.",
          modalType: "error",
        }));
      }
    } catch (error) {
      setState((prev) => ({
        ...prev,
        modalMessage: `Error submitting job application: ${error.message}`,
        modalType: "error",
      }));
    } finally {
      setState((prev) => ({ ...prev, isSubmitting: false, isModalOpen: true }));
    }
  };

  const closeModal = () =>
    setState((prev) => ({
      ...prev,
      isModalOpen: false,
    }));

  const { jobData, modalMessage, modalType, isModalOpen } = state;

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

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 md:w-1/3">
            <div className="flex flex-col items-center text-center">
              {modalType === "success" ? (
                <div className="text-green-500 text-6xl mb-4">✔️</div>
              ) : (
                <div className="text-red-500 text-6xl mb-4">✖️</div>
              )}
              <h2
                className={`text-lg font-semibold ${
                  modalType === "success" ? "text-green-500" : "text-red-500"
                }`}
              >
                {modalMessage}
              </h2>
              <button
                onClick={closeModal}
                className="mt-6 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Addjobs;
