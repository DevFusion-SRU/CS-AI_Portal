import React, { useState, useEffect } from "react";
import { CloseCircle, DocumentUpload, Link } from "iconsax-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const CertificationModal = ({ isOpen, onClose, onSave, initialData = {} }) => {
  const [formData, setFormData] = useState({
    provider: "",
    issuer: "",
    title: "",
    startDate: null,
    endDate: null,
    certificateOption: "upload",
    certificateUrl: "",
    file: null,
  });

  useEffect(() => {
    if (isOpen) {
      setFormData({
        provider: initialData.title || "",
        issuer: initialData.issuer || "",
        title: initialData.courseName || "",
        startDate: initialData.validTime?.startDate ? new Date(initialData.validTime.startDate) : null,
        endDate: initialData.validTime?.endDate ? new Date(initialData.validTime.endDate) : null,
        certificateOption: initialData.certificateId ? "url" : "upload",
        certificateUrl: initialData.certificateId || "",
        file: null,
      });
    }
  }, [isOpen, initialData]);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "file" ? files[0] : value,
    }));
  };

  const handleDateChange = (date, name) => {
    setFormData((prev) => ({ ...prev, [name]: date }));
  };

  const handleSave = () => {
    if (!formData.provider) {
      alert("Please enter a provider.");
      return;
    }
    if (!formData.issuer) {
      alert("Please enter an issuing organization.");
      return;
    }
    if (!formData.title) {
      alert("Please enter a course name.");
      return;
    }
    if (!formData.startDate) {
      alert("Please select an issue date.");
      return;
    }
    if (formData.certificateOption === "upload" && !formData.file) {
      alert("Please upload a certificate file.");
      return;
    }
    if (formData.certificateOption === "url" && !formData.certificateUrl) {
      alert("Please enter a certificate URL.");
      return;
    }

    const formattedData = {
      provider: formData.provider,
      issuer: formData.issuer,
      title: formData.title,
      startDate: formData.startDate ? formData.startDate.toISOString().split("T")[0] : null,
      endDate: formData.endDate ? formData.endDate.toISOString().split("T")[0] : null,
      certificateUrl: formData.certificateUrl,
      file: formData.file,
    };

    console.log("Saving Certification:", formattedData);
    onSave(formattedData);
    setFormData({
      provider: "",
      issuer: "",
      title: "",
      startDate: null,
      endDate: null,
      certificateOption: "upload",
      certificateUrl: "",
      file: null,
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50 px-2 sm:px-0">
      <div className="bg-white p-4 sm:p-5 rounded-lg w-full max-w-[600px] sm:max-w-[400px] max-h-[85vh] overflow-y-auto relative">
        <div className="flex justify-between items-center mb-3 sm:mb-4">
          <h2 className="text-base sm:text-sm font-medium font-['Quicksand-Medium'] text-gray-900">
            {initialData.title ? "Edit Certification" : "Add Certificate"}
          </h2>
          <CloseCircle
            className="cursor-pointer"
            size={20}
            color="#000000"
            onClick={onClose}
          />
        </div>
        <div className="flex flex-col gap-2 text-xs">
          <div className="flex flex-col gap-1">
            <label className="text-gray-900">Provider*</label>
            <input
              name="provider"
              value={formData.provider}
              onChange={handleChange}
              placeholder="e.g., Microsoft"
              className="w-full h-8 sm:h-9 p-2 bg-gray-100 rounded-md border border-gray-300 text-xs placeholder-gray-500"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-gray-900">Issuing Organization*</label>
            <input
              name="issuer"
              value={formData.issuer}
              onChange={handleChange}
              placeholder="e.g., Microsoft Corp"
              className="w-full h-8 sm:h-9 p-2 bg-gray-100 rounded-md border border-gray-300 text-xs placeholder-gray-500"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-gray-900">Course Name*</label>
            <input
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g., Azure Fundamentals"
              className="w-full h-8 sm:h-9 p-2 bg-gray-100 rounded-md border border-gray-300 text-xs placeholder-gray-500"
            />
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="flex flex-col gap-1 flex-1">
                <label className="text-gray-900">Issue Date*</label>
                <DatePicker
                  selected={formData.startDate}
                  onChange={(date) => handleDateChange(date, "startDate")}
                  dateFormat="yyyy-MM-dd"
                  className="w-full h-8 sm:h-9 p-2 bg-gray-100 rounded-md border border-gray-300 text-xs"
                  placeholderText="e.g., 2023-01-01"
                  showYearDropdown
                  scrollableYearDropdown
                  yearDropdownItemNumber={50} // Show 50 years in dropdown
                  minDate={new Date(new Date().getFullYear() - 50, 0, 1)} // Past 50 years
                  maxDate={new Date()} // Up to current date
                  popperClassName="text-xs w-56 sm:w-64 max-h-64" // Fixed size
                  popperPlacement="bottom-start"
                />
              </div>
              <div className="flex flex-col gap-1 flex-1">
                <label className="text-gray-900">Expire Date</label>
                <DatePicker
                  selected={formData.endDate}
                  onChange={(date) => handleDateChange(date, "endDate")}
                  dateFormat="yyyy-MM-dd"
                  className="w-full h-8 sm:h-9 p-2 bg-gray-100 rounded-md border border-gray-300 text-xs"
                  placeholderText="e.g., 2024-01-01"
                  showYearDropdown
                  scrollableYearDropdown
                  yearDropdownItemNumber={50} // Show 50 years in dropdown
                  minDate={formData.startDate || new Date(new Date().getFullYear() - 50, 0, 1)} // From startDate or past 50 years
                  // No maxDate to allow unlimited future years
                  popperClassName="text-xs w-56 sm:w-64 max-h-64" // Fixed size
                  popperPlacement="bottom-start"
                />
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-gray-900">Certificate*</label>
            <div className="flex gap-3 mb-2">
              <button
                onClick={() => setFormData((prev) => ({ ...prev, certificateOption: "upload", certificateUrl: "" }))}
                className={`flex items-center gap-1 px-2 sm:px-3 py-1 rounded-md text-xs ${
                  formData.certificateOption === "upload" ? "bg-blue-100 text-blue-600" : "bg-gray-100 text-gray-600"
                }`}
              >
                <DocumentUpload size={16} /> Upload
              </button>
              <button
                onClick={() => setFormData((prev) => ({ ...prev, certificateOption: "url", file: null }))}
                className={`flex items-center gap-1 px-2 sm:px-3 py-1 rounded-md text-xs ${
                  formData.certificateOption === "url" ? "bg-blue-100 text-blue-600" : "bg-gray-100 text-gray-600"
                }`}
              >
                <Link size={16} /> URL
              </button>
            </div>
            {formData.certificateOption === "upload" ? (
              <div className="flex flex-col gap-1">
                <input
                  type="file"
                  name="file"
                  onChange={handleChange}
                  accept="application/pdf,image/*"
                  className="w-full p-1 bg-gray-50 rounded-md border-2 border-dashed border-gray-300 text-xs"
                />
                <p className="text-[10px] text-gray-600 text-center">PDF or Image. Max 5 MB.</p>
              </div>
            ) : (
              <input
                name="certificateUrl"
                value={formData.certificateUrl}
                onChange={handleChange}
                placeholder="e.g., https://example.com/certificate.pdf"
                className="w-full h-8 sm:h-9 p-2 bg-gray-100 rounded-md border border-gray-300 text-xs placeholder-gray-500"
              />
            )}
          </div>
          <div className="flex justify-end gap-2 mt-2">
            <button
              onClick={onClose}
              className="bg-gray-100 text-gray-700 font-semibold px-2 sm:px-3 py-1 sm:py-1.5 rounded-md hover:bg-gray-200 text-xs"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="bg-blue-600 text-white font-semibold px-2 sm:px-3 py-1 sm:py-1.5 rounded-md hover:bg-blue-700 text-xs"
            >
              {initialData.title ? "Save" : "Add"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CertificationModal;