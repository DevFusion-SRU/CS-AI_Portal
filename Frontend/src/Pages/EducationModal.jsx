import React, { useState, useEffect } from "react";
import { CloseCircle } from "iconsax-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const EducationModal = ({ isOpen, onClose, onSave, initialData = {} }) => {
  const [formData, setFormData] = useState({
    institute: "",
    degree: "",
    specialization: "",
    startYear: null,
    endYear: null,
    isCurrent: false,
    grade: "",
  });

  const degreeOptions = ["School", "Diploma", "B.Tech", "M.Tech", "B.Sc"];

  useEffect(() => {
    if (isOpen) {
      setFormData({
        institute: initialData.institution || "",
        degree: initialData.degree || "",
        specialization: initialData.specialization || "",
        startYear: initialData.duration?.startDate ? new Date(initialData.duration.startDate) : null,
        endYear: initialData.duration?.endDate ? new Date(initialData.duration.endDate) : null,
        isCurrent: initialData.duration?.endDate === null || false,
        grade: initialData.cgpa || "",
      });
    }
  }, [isOpen, initialData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleDateChange = (date, name) => {
    setFormData((prev) => ({ ...prev, [name]: date }));
  };

  const handleSave = () => {
    if (!formData.institute) {
      alert("Please enter an institution name.");
      return;
    }
    if (!formData.degree) {
      alert("Please select a degree.");
      return;
    }
    if (!formData.startYear) {
      alert("Please select a start date.");
      return;
    }
    if (!formData.isCurrent && !formData.endYear) {
      alert("Please select an end date or mark as currently pursuing.");
      return;
    }
    if (!formData.grade) {
      alert("Please enter a grade or CGPA.");
      return;
    }

    const formattedData = {
      institute: formData.institute,
      degree: formData.degree,
      specialization: formData.specialization,
      startYear: formData.startYear ? formData.startYear.toISOString().split("T")[0] : "",
      endYear: formData.isCurrent ? null : (formData.endYear ? formData.endYear.toISOString().split("T")[0] : ""),
      isCurrent: formData.isCurrent,
      grade: formData.grade,
    };

    console.log("Saving Education:", formattedData);
    onSave(formattedData);
    setFormData({
      institute: "",
      degree: "",
      specialization: "",
      startYear: null,
      endYear: null,
      isCurrent: false,
      grade: "",
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50 px-2 sm:px-0">
      <div className="bg-white p-4 sm:p-5 rounded-lg w-full max-w-[600px] sm:max-w-[400px] max-h-[85vh] overflow-y-auto shadow-lg relative">
        <div className="flex justify-between items-center mb-3 sm:mb-4">
          <h2 className="text-base sm:text-sm font-medium font-['Quicksand-Medium'] text-gray-900">
            {initialData.institution ? "Edit Education" : "Add Your Education"}
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
            <label className="text-gray-900">Institution Name*</label>
            <input
              name="institute"
              value={formData.institute}
              onChange={handleChange}
              placeholder="e.g., XYZ University"
              className="w-full h-8 sm:h-9 p-2 bg-gray-100 rounded-md border border-gray-300 text-xs placeholder-gray-500"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-gray-900">Degree*</label>
            <select
              name="degree"
              value={formData.degree}
              onChange={handleChange}
              className="w-full h-8 sm:h-9 p-2 bg-gray-100 rounded-md border border-gray-300 text-xs"
            >
              <option value="">Select a degree</option>
              {degreeOptions.map((deg) => (
                <option key={deg} value={deg}>
                  {deg}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-gray-900">Specialization</label>
            <input
              name="specialization"
              value={formData.specialization}
              onChange={handleChange}
              placeholder="e.g., Computer Science"
              className="w-full h-8 sm:h-9 p-2 bg-gray-100 rounded-md border border-gray-300 text-xs placeholder-gray-500"
            />
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="flex flex-col gap-1 flex-1">
                <label className="text-gray-900">Start Date*</label>
                <DatePicker
                  selected={formData.startYear}
                  onChange={(date) => handleDateChange(date, "startYear")}
                  dateFormat="yyyy-MM-dd"
                  className="w-full h-8 sm:h-9 p-2 bg-gray-100 rounded-md border border-gray-300 text-xs"
                  placeholderText="e.g., 2020-08-01"
                  showYearDropdown
                  scrollableYearDropdown
                  yearDropdownItemNumber={50} // Show 50 years in dropdown
                  minDate={new Date(new Date().getFullYear() - 50, 0, 1)} // Past 50 years
                  maxDate={new Date()} // Up to current date
                  popperClassName="text-xs w-56 sm:w-64 max-h-64" // Fixed size
                  popperPlacement="bottom-start"
                />
              </div>
              {!formData.isCurrent && (
                <div className="flex flex-col gap-1 flex-1">
                  <label className="text-gray-900">End Date*</label>
                  <DatePicker
                    selected={formData.endYear}
                    onChange={(date) => handleDateChange(date, "endYear")}
                    dateFormat="yyyy-MM-dd"
                    className="w-full h-8 sm:h-9 p-2 bg-gray-100 rounded-md border border-gray-300 text-xs"
                    placeholderText="e.g., 2024-05-31"
                    showYearDropdown
                    scrollableYearDropdown
                    yearDropdownItemNumber={50} // Show 50 years in dropdown
                    minDate={formData.startYear || new Date(new Date().getFullYear() - 50, 0, 1)} // From startYear or past 50 years
                    // No maxDate to allow unlimited future years
                    popperClassName="text-xs w-56 sm:w-64 max-h-64" // Fixed size
                    popperPlacement="bottom-start"
                  />
                </div>
              )}
            </div>
            <div className="flex items-center gap-1">
              <input
                type="checkbox"
                name="isCurrent"
                checked={formData.isCurrent}
                onChange={handleChange}
                className="w-3 h-3"
              />
              <label className="text-gray-900 text-xs">Currently pursuing</label>
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-gray-900">Grade/CGPA*</label>
            <input
              name="grade"
              value={formData.grade}
              onChange={handleChange}
              placeholder="e.g., 8.5 or A+"
              className="w-full h-8 sm:h-9 p-2 bg-gray-100 rounded-md border border-gray-300 text-xs placeholder-gray-500"
            />
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
              {initialData.institution ? "Save" : "Add"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EducationModal;