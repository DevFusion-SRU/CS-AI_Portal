import React, { useState } from "react";
import axios from "axios";
axios.defaults.withCredentials = true;
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
      jobId: "",
      title: "",
      company: "",
      type: "",
      modeOfWork: "",
      location: "",
      deadline: "",
      stipend: "",
      category: "",
      compensationType: "",
      descriptionText: "",
      requirementsExperience: "",
      requirementsTools: "",
      requirementsSkills: "",
      requirementsPlatforms: "",
      requirementsTeam: "",
      requirementsBonus: "",
      includeBenefitsSalary: false,
      includeBenefitsHealth: false,
      includeBenefitsLearning: false,
      includeBenefitsWorkOptions: false,
      applyLink: "",
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setState((prev) => ({
      ...prev,
      jobData: { ...prev.jobData, [name]: value },
      errors: { ...prev.errors, [name]: "" },
    }));
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setState((prev) => ({
      ...prev,
      jobData: { ...prev.jobData, [name]: checked },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { jobData } = state;
    const newErrors = {};

    const requiredFields = ["jobId", "title", "type", "company", "modeOfWork", "applyLink"];
    requiredFields.forEach((key) => {
      if (!jobData[key] || jobData[key].trim() === "") {
        newErrors[key] = `${key.replace(/([A-Z])/g, " $1").trim()} is required.`;
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setState((prev) => ({ ...prev, errors: newErrors }));
      return;
    }

    const payload = {
      jobId: jobData.jobId,
      title: jobData.title,
      company: jobData.company,
      type: jobData.type,
      modeOfWork: jobData.modeOfWork,
      applyLink: jobData.applyLink,
      ...(jobData.location && { location: jobData.location }),
      ...(jobData.deadline && { deadline: jobData.deadline }),
      ...(jobData.stipend && { stipend: parseFloat(jobData.stipend) || 0 }),
      ...(jobData.category && { category: jobData.category }),
      ...(jobData.compensationType && { compensationType: jobData.compensationType }),
      description: jobData.descriptionText
        ? {
            text: jobData.descriptionText,
            requirements: {
              ...(jobData.requirementsExperience && { experience: jobData.requirementsExperience }),
              ...(jobData.requirementsTools && { tools: jobData.requirementsTools.split(",").map((t) => t.trim()) }),
              ...(jobData.requirementsSkills && { skills: jobData.requirementsSkills.split(",").map((s) => s.trim()) }),
              ...(jobData.requirementsPlatforms && { platforms: jobData.requirementsPlatforms.split(",").map((p) => p.trim()) }),
              ...(jobData.requirementsTeam && { team: jobData.requirementsTeam }),
              ...(jobData.requirementsBonus && { bonus: jobData.requirementsBonus.split(",").map((b) => b.trim()) }),
            },
            benefits: {
              ...(jobData.includeBenefitsSalary && { salary: true }),
              ...(jobData.includeBenefitsHealth && { health: true }),
              ...(jobData.includeBenefitsLearning && { learning: true }),
              ...(jobData.includeBenefitsWorkOptions && { workOptions: true }),
            },
          }
        : undefined,
    };

    setState((prev) => ({ ...prev, isSubmitting: true }));
    try {
      console.log("Submitting job data:", payload);
      const response = await axios.post(`${BASE_URL}jobs`, payload, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });
      console.log("API Response:", response.data);

      if (response.status === 201) {
        setState((prev) => ({
          ...prev,
          modalMessage: "Job successfully added!",
          modalType: "success",
          jobData: {
            jobId: "",
            title: "",
            company: "",
            type: "",
            modeOfWork: "",
            location: "",
            deadline: "",
            stipend: "",
            category: "",
            compensationType: "",
            descriptionText: "",
            requirementsExperience: "5+ years of experience in UX/UI design in a product-driven environment",
            requirementsTools: "Figma, Sketch, Adobe XD, and prototyping tools",
            requirementsSkills: "user research, usability principles, interaction design",
            requirementsPlatforms: "mobile, web, multi-platform products",
            requirementsTeam: "agile product development teams",
            requirementsBonus: "HTML, CSS, front-end frameworks",
            includeBenefitsSalary: false,
            includeBenefitsHealth: false,
            includeBenefitsLearning: false,
            includeBenefitsWorkOptions: false,
            applyLink: "",
          },
        }));
      }
    } catch (error) {
      console.error("Error submitting job:", error.response?.data || error.message);
      setState((prev) => ({
        ...prev,
        modalMessage: error.response?.data?.message || "An error occurred while adding the job.",
        modalType: "error",
      }));
    } finally {
      setState((prev) => ({ ...prev, isSubmitting: false, isModalOpen: true }));
    }
  };

  const closeModal = () => {
    setState((prev) => ({ ...prev, isModalOpen: false }));
    if (state.modalType === "success") navigate("/usermanagement");
  };

  const handleCancel = () => {
    navigate("/usermanagement");
  };

  const { jobData, errors, modalMessage, modalType, isModalOpen, isSubmitting } = state;

  return (
    <div className="min-h-screen bg-gray-100 p-6 flex justify-center">
      <div className="w-full max-w-4xl bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Add New Job</h1>
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Details */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <h2 className="text-xl font-semibold text-gray-800 col-span-full">Basic Details</h2>
            <div>
              <label htmlFor="jobId" className="block text-sm font-medium text-gray-700 mb-1">
                Job ID <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="jobId"
                value={jobData.jobId}
                onChange={handleChange}
                placeholder="e.g., J001"
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                  errors.jobId ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.jobId && <p className="text-red-500 text-xs mt-1">{errors.jobId}</p>}
            </div>
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={jobData.title}
                onChange={handleChange}
                placeholder="e.g., UX Designer"
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                  errors.title ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
            </div>
            <div>
              <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-1">
                Company <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="company"
                value={jobData.company}
                onChange={handleChange}
                placeholder="e.g., TechCo"
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                  errors.company ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.company && <p className="text-red-500 text-xs mt-1">{errors.company}</p>}
            </div>
            <div>
              <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
                Type <span className="text-red-500">*</span>
              </label>
              <select
                name="type"
                value={jobData.type}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                  errors.type ? "border-red-500" : "border-gray-300"
                }`}
              >
                <option value="">Select Type</option>
                <option value="Full-time">Full-time</option>
                <option value="Internship">Internship</option>
                <option value="Hackathon">Hackathon</option>
                <option value="Part-time">Part-time</option>
              </select>
              {errors.type && <p className="text-red-500 text-xs mt-1">{errors.type}</p>}
            </div>
            <div>
              <label htmlFor="modeOfWork" className="block text-sm font-medium text-gray-700 mb-1">
                Mode of Work <span className="text-red-500">*</span>
              </label>
              <select
                name="modeOfWork"
                value={jobData.modeOfWork}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                  errors.modeOfWork ? "border-red-500" : "border-gray-300"
                }`}
              >
                <option value="">Select Mode</option>
                <option value="In-office">In-office</option>
                <option value="Remote">Remote</option>
                <option value="Hybrid">Hybrid</option>
              </select>
              {errors.modeOfWork && <p className="text-red-500 text-xs mt-1">{errors.modeOfWork}</p>}
            </div>
            <div>
              <label htmlFor="applyLink" className="block text-sm font-medium text-gray-700 mb-1">
                Apply URL <span className="text-red-500">*</span>
              </label>
              <input
                type="url"
                name="applyLink"
                value={jobData.applyLink}
                onChange={handleChange}
                placeholder="e.g., https://example.com/apply"
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                  errors.applyLink ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.applyLink && <p className="text-red-500 text-xs mt-1">{errors.applyLink}</p>}
            </div>
          </section>

          {/* Optional Details */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <h2 className="text-xl font-semibold text-gray-800 col-span-full">Optional Details</h2>
            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                Location
              </label>
              <input
                type="text"
                name="location"
                value={jobData.location}
                onChange={handleChange}
                placeholder="e.g., San Francisco, CA"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div>
              <label htmlFor="deadline" className="block text-sm font-medium text-gray-700 mb-1">
                Deadline
              </label>
              <input
                type="date"
                name="deadline"
                value={jobData.deadline}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div>
              <label htmlFor="stipend" className="block text-sm font-medium text-gray-700 mb-1">
                Stipend
              </label>
              <input
                type="number"
                name="stipend"
                value={jobData.stipend}
                onChange={handleChange}
                placeholder="e.g., 50000"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <input
                type="text"
                name="category"
                value={jobData.category}
                onChange={handleChange}
                placeholder="e.g., Software Development"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div>
              <label htmlFor="compensationType" className="block text-sm font-medium text-gray-700 mb-1">
                Compensation Type
              </label>
              <select
                name="compensationType"
                value={jobData.compensationType}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="">Select Compensation</option>
                <option value="Paid">Paid</option>
                <option value="Unpaid">Unpaid</option>
                <option value="Stipend-based">Stipend-based</option>
              </select>
            </div>
          </section>

          {/* Description */}
          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Job Description</h2>
            <label htmlFor="descriptionText" className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              name="descriptionText"
              value={jobData.descriptionText}
              onChange={handleChange}
              rows="5"
              placeholder="Provide a detailed job description..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </section>

          {/* Requirements */}
          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Qualifications & Requirements</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="requirementsExperience" className="block text-sm font-medium text-gray-700 mb-1">
                  Experience
                </label>
                <input
                  type="text"
                  name="requirementsExperience"
                  value={jobData.requirementsExperience}
                  onChange={handleChange}
                  placeholder="e.g., 5+ years of experience"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div>
                <label htmlFor="requirementsTools" className="block text-sm font-medium text-gray-700 mb-1">
                  Tools (comma-separated)
                </label>
                <input
                  type="text"
                  name="requirementsTools"
                  value={jobData.requirementsTools}
                  onChange={handleChange}
                  placeholder="e.g., Figma, Sketch"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div>
                <label htmlFor="requirementsSkills" className="block text-sm font-medium text-gray-700 mb-1">
                  Skills (comma-separated)
                </label>
                <input
                  type="text"
                  name="requirementsSkills"
                  value={jobData.requirementsSkills}
                  onChange={handleChange}
                  placeholder="e.g., user research, usability principles"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div>
                <label htmlFor="requirementsPlatforms" className="block text-sm font-medium text-gray-700 mb-1">
                  Platforms (comma-separated)
                </label>
                <input
                  type="text"
                  name="requirementsPlatforms"
                  value={jobData.requirementsPlatforms}
                  onChange={handleChange}
                  placeholder="e.g., mobile, web"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div>
                <label htmlFor="requirementsTeam" className="block text-sm font-medium text-gray-700 mb-1">
                  Team Environment
                </label>
                <input
                  type="text"
                  name="requirementsTeam"
                  value={jobData.requirementsTeam}
                  onChange={handleChange}
                  placeholder="e.g., agile product development teams"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div>
                <label htmlFor="requirementsBonus" className="block text-sm font-medium text-gray-700 mb-1">
                  Bonus Skills (comma-separated)
                </label>
                <input
                  type="text"
                  name="requirementsBonus"
                  value={jobData.requirementsBonus}
                  onChange={handleChange}
                  placeholder="e.g., HTML, CSS"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>
          </section>

          {/* Benefits */}
          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Benefits & Perks</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="includeBenefitsSalary"
                  checked={jobData.includeBenefitsSalary}
                  onChange={handleCheckboxChange}
                  className="h-5 w-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                />
                <span className="text-sm text-gray-700">Competitive salary and stock options</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="includeBenefitsHealth"
                  checked={jobData.includeBenefitsHealth}
                  onChange={handleCheckboxChange}
                  className="h-5 w-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                />
                <span className="text-sm text-gray-700">Health and wellness programs</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="includeBenefitsLearning"
                  checked={jobData.includeBenefitsLearning}
                  onChange={handleCheckboxChange}
                  className="h-5 w-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                />
                <span className="text-sm text-gray-700">Learning and development budget</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="includeBenefitsWorkOptions"
                  checked={jobData.includeBenefitsWorkOptions}
                  onChange={handleCheckboxChange}
                  className="h-5 w-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                />
                <span className="text-sm text-gray-700">Remote or hybrid work options</span>
              </label>
            </div>
          </section>

          {/* Actions */}
          <div className="flex justify-end gap-4 mt-8">
            <button
              type="button"
              onClick={handleCancel}
              className="px-6 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`px-6 py-2 text-white rounded-lg transition-colors duration-200 ${
                isSubmitting
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-indigo-600 hover:bg-indigo-700"
              }`}
            >
              {isSubmitting ? "Submitting..." : "Add Job"}
            </button>
          </div>
        </form>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md">
            <div className="text-center">
              {modalType === "success" ? (
                <div className="text-green-500 text-5xl mb-4">✔️</div>
              ) : (
                <div className="text-red-500 text-5xl mb-4">✖️</div>
              )}
              <h2
                className={`text-lg font-semibold mb-4 ${
                  modalType === "success" ? "text-green-600" : "text-red-600"
                }`}
              >
                {modalMessage}
              </h2>
              <button
                onClick={closeModal}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200"
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