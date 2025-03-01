import React, { useState } from "react";
import { CloseCircle, DocumentUpload, Link } from "iconsax-react";
import axios from "axios";

const AttachmentModal = ({ isOpen, onClose, onSave, initialData = {} }) => {
  const [formData, setFormData] = useState({
    title: initialData.name || "",
    attachmentOption: initialData.url ? "url" : "upload", // Default based on existing data
    file: initialData.file || null,
    url: initialData.url || "",
  });

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "file" ? files[0] : value,
    }));
  };

  const handleSave = async () => {
    if (formData.attachmentOption === "upload" && !formData.file) {
      alert("Please select a file to upload.");
      return;
    }
  
    if (formData.attachmentOption === "url" && !formData.url) {
      alert("Please enter a valid URL.");
      return;
    }
  
    try {
      const data = new FormData();
      if (formData.file) {
        data.append("file", formData.file); // Ensure the key is "file"
      }
      if (formData.url) {
        data.append("url", formData.url); // Append URL if provided
      }
      data.append("title", formData.title); // Append title
  
      const response = await axios.post(
        "http://localhost:5000/api/students/2203A51L92/resume",
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );
  
      onSave(response.data);
      onClose();
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("Failed to upload file. Please try again.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-5 rounded-lg w-[722px] max-h-[75vh] overflow-y-auto relative">
        <CloseCircle
          className="absolute top-2 right-2 cursor-pointer"
          size={32}
          color="#000000"
          onClick={onClose}
        />
        <h2 className="text-base font-medium mb-3 font-['Quicksand-Medium'] text-gray-900">
          {initialData.name ? "Edit Attachment" : "Add Attachment"}
        </h2>
        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-1">
            <label className="text-xs text-gray-900">Title</label>
            <input
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Attachment Title"
              className="w-full h-9 p-2 text-sm bg-gray-100 rounded-md border border-gray-300"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-xs text-gray-900">Attachment</label>
            <div className="flex gap-4 mb-2">
              <button
                onClick={() => setFormData((prev) => ({ ...prev, attachmentOption: "upload" }))}
                className={`flex items-center gap-1 px-3 py-1 text-sm rounded-md ${
                  formData.attachmentOption === "upload"
                    ? "bg-blue-100 text-blue-600"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                <DocumentUpload size={16} /> Upload
              </button>
              <button
                onClick={() => setFormData((prev) => ({ ...prev, attachmentOption: "url" }))}
                className={`flex items-center gap-1 px-3 py-1 text-sm rounded-md ${
                  formData.attachmentOption === "url"
                    ? "bg-blue-100 text-blue-600"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                <Link size={16} /> URL
              </button>
            </div>
            {formData.attachmentOption === "upload" ? (
              <div className="flex flex-col gap-1">
                <input
                  type="file"
                  name="file"
                  onChange={handleChange}
                  accept="image/*, application/pdf, .doc, .docx"
                  className="w-full p-1.5 text-sm bg-gray-50 rounded-md border-2 border-dashed border-gray-300"
                />
                <p className="text-[10px] text-gray-600 text-center">
                  Allowed formats: Images (JPG, PNG, WebP), PDF, DOC, DOCX. Max file size 5 MB.
                </p>
              </div>
            ) : (
              <input
                name="url"
                value={formData.url}
                onChange={handleChange}
                placeholder="Enter attachment URL"
                className="w-full h-9 p-2 text-sm bg-gray-100 rounded-md border border-gray-300"
              />
            )}
          </div>
          <div className="flex justify-end gap-3 mt-3">
            <button
              onClick={onClose}
              className="bg-blue-50 text-blue-600 font-semibold px-3 py-1.5 text-sm rounded-md hover:bg-blue-100"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="bg-blue-600 text-white font-semibold px-3 py-1.5 text-sm rounded-md hover:bg-blue-700"
            >
              {initialData.name ? "Save" : "Add"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttachmentModal;