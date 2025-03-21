import { useState } from "react";
import { ChevronDown, X } from "lucide-react";

export default function FilterMenu({ onApplyFilters }) {
  const [isOpen, setIsOpen] = useState(false);
  const [expanded, setExpanded] = useState({});
  const [filters, setFilters] = useState({
    jobType: [],
    industry: [],
    modeOfWork: [],
    skills: [],
    compensation: [],
  });
  const [sortOption, setSortOption] = useState("Newest"); // Added sort state

  // Filter options aligned with backend
  const filterCategories = {
    jobType: ["Full-time", "Internship", "Hackathon"],
    industry: ["Software", "Design"], // Matches 'category' in backend
    modeOfWork: ["In Office", "Hybrid"],
    skills: ["Python", "C", "C++"],
    compensation: ["Paid", "Unpaid"], // Matches 'compensationType' in backend
  };

  const sortOptions = ["Newest", "Oldest"];

  // Toggle checkbox selection
  const handleCheckboxChange = (category, value) => {
    setFilters((prev) => ({
      ...prev,
      [category]: prev[category].includes(value)
        ? prev[category].filter((item) => item !== value)
        : [...prev[category], value],
    }));
  };

  // Expand or collapse category
  const toggleExpand = (category) => {
    setExpanded((prev) => ({ ...prev, [category]: !prev[category] }));
  };

  // Reset filters
  const resetFilters = () => {
    setFilters({
      jobType: [],
      industry: [],
      modeOfWork: [],
      skills: [],
      compensation: [],
    });
    setSortOption("Newest");
  };

  // Apply filters and sort
  const handleConfirm = () => {
    const filterData = { ...filters, sort: sortOption }; // Include sort option
    onApplyFilters(filterData);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      {/* Open Filter Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-blue-500 text-white px-3 py-1.5 rounded-md text-sm hover:bg-blue-600"
      >
        Filter & Sort
      </button>

      {/* Filter Menu Dropdown */}
      {isOpen && (
        <div className="absolute right-0 top-10 w-72 max-h-[70vh] bg-white border rounded-xl shadow-lg p-3 z-50 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100">
          {/* Header */}
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-base font-semibold">Filter & Sort</h3>
            <button onClick={() => setIsOpen(false)}>
              <X className="w-4 h-4 text-gray-600" />
            </button>
          </div>

          {/* Sorting Dropdown */}
          <div className="mb-3">
            <label className="text-sm font-medium">Sort By</label>
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="w-full mt-1 border p-1.5 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
            >
              {sortOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          {/* Filters Section */}
          <h4 className="text-sm font-medium mb-2">Filters</h4>
          {Object.entries(filterCategories).map(([key, options]) => (
            <div key={key} className="mb-2">
              <h5
                className="text-xs font-medium flex items-center cursor-pointer p-1 bg-gray-100 rounded-md"
                onClick={() => toggleExpand(key)}
              >
                {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, " $1").trim()}
                <ChevronDown
                  className={`w-3 h-3 ml-auto transform transition-transform ${
                    expanded[key] ? "rotate-180" : ""
                  }`}
                />
              </h5>

              {expanded[key] && (
                <div className="mt-1 flex flex-col space-y-1 p-1 bg-gray-50 rounded-md max-h-32 overflow-y-auto scrollbar-thin">
                  {options.map((option) => (
                    <label key={option} className="flex items-center space-x-1 text-xs">
                      <input
                        type="checkbox"
                        checked={filters[key].includes(option)}
                        onChange={() => handleCheckboxChange(key, option)}
                        className="w-3 h-3"
                      />
                      <span>{option}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>
          ))}

          {/* Confirm & Reset Buttons */}
          <div className="mt-3 flex gap-2">
            <button
              className="flex-1 bg-gray-400 text-white px-3 py-1 rounded-md text-sm hover:bg-gray-500"
              onClick={resetFilters}
            >
              Reset
            </button>
            <button
              className="flex-1 bg-blue-500 text-white px-3 py-1 rounded-md text-sm hover:bg-blue-600"
              onClick={handleConfirm}
            >
              Apply
            </button>
          </div>
        </div>
      )}
    </div>
  );
}