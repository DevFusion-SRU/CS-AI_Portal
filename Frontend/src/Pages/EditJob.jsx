import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";

const EditJob = () => {
  const { jobId } = useParams();
  const { BASE_URL } = useAuth();
  const navigate = useNavigate();
  const [job, setJob] = useState({
    jobId: "",
    title: "",
    type: "",
    company: "",
    modeOfWork: "",
    applyLink: "",
    description: { text: "" },
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const response = await axios.get(`${BASE_URL}jobs/${jobId}`, { withCredentials: true });
        if (response.data.success) {
          setJob(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching job:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [jobId, BASE_URL]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "description.text") {
      setJob({ ...job, description: { ...job.description, text: value } });
    } else {
      setJob({ ...job, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(`${BASE_URL}jobs/${jobId}`, job, { withCredentials: true });
      if (response.data.success) {
        alert("Job updated successfully!");
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Error updating job:", error);
      alert("Failed to update job.");
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="w-full max-w-2xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Edit Job</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Job ID</label>
          <input
            type="text"
            name="jobId"
            value={job.jobId}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            disabled
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Title</label>
          <input
            type="text"
            name="title"
            value={job.title}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Type</label>
          <input
            type="text"
            name="type"
            value={job.type}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Company</label>
          <input
            type="text"
            name="company"
            value={job.company}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Mode of Work</label>
          <input
            type="text"
            name="modeOfWork"
            value={job.modeOfWork}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Apply Link</label>
          <input
            type="text"
            name="applyLink"
            value={job.applyLink}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Description</label>
          <textarea
            name="description.text"
            value={job.description.text}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            rows="4"
          />
        </div>
        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default EditJob;