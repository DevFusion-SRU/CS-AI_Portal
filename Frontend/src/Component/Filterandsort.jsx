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
    compensation: []
  });

  // Filter options
  const filterCategories = {
    jobType: ["Full-time", "Internship", "Hackathon"],
    industry: ["Software", "Design"],
    modeOfWork: ["In Office", "Hybrid"],
    skills: ["Python", "C", "C++"],
    compensation: ["Paid", "Unpaid"],
  };

  // Toggle checkbox selection
  const handleCheckboxChange = (category, value) => {
    setFilters(prev => ({
      ...prev,
      [category]: prev[category].includes(value)
        ? prev[category].filter(item => item !== value)
        : [...prev[category], value]
    }));
    
  };

  // Expand or collapse category
  const toggleExpand = (category) => {
    setExpanded(prev => ({ ...prev, [category]: !prev[category] }));
  };

  // Reset filters
  const resetFilters = () => {
    setFilters({
      jobType: [],
      industry: [],
      modeOfWork: [],
      skills: [],
      compensation: []
    });
  };

  // Apply filters
  const handleConfirm = () => {
    console.log(filters)
    onApplyFilters(filters);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      {/* Open Filter Button */}
      <button onClick={() => setIsOpen(!isOpen)} className="bg-blue-500 text-white px-4 py-2 rounded-md">
        Filter & Sort
      </button>

      {/* Filter Menu Dropdown */}
      {isOpen && (
        <div className="absolute right-0 top-12 w-80 bg-white border rounded-xl shadow-lg p-4 z-50">
          {/* Header */}
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Sort</h3>
            <button onClick={() => setIsOpen(false)}>
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Sorting Dropdown */}
          <select className="w-full mt-2 border p-2 rounded">
            <option>Newest</option>
            <option>Oldest</option>
          </select>

          {/* Filters Section */}
          <h3 className="mt-4 text-lg font-semibold">Filters</h3>
          {Object.entries(filterCategories).map(([key, options]) => (
            <div key={key} className="mt-2">
              <h4 
                className="text-sm font-medium flex items-center cursor-pointer p-2 bg-gray-100 rounded-lg"
                onClick={() => toggleExpand(key)}
              >
                {key.charAt(0).toUpperCase() + key.slice(1)}
                <ChevronDown className={`w-4 h-4 ml-auto transform transition-transform ${expanded[key] ? "rotate-180" : ""}`} />
              </h4>

              {expanded[key] && (
                <div className="mt-1 flex flex-col space-y-1 p-2 bg-gray-50 rounded-lg">
                  {options.map(option => (
                    <label key={option} className="flex items-center space-x-2">
                      <input 
                        type="checkbox"
                        checked={filters[key].includes(option)}
                        onChange={() => handleCheckboxChange(key, option)}
                        className="w-4 h-4"
                      />
                      <span>{option}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>
          ))}

          {/* Confirm & Reset Buttons */}
          <div className="mt-4 flex gap-2">
            <button className="flex-1 bg-gray-400 text-white px-4 py-2 rounded-md" onClick={resetFilters}>
              Reset
            </button>
            <button className="flex-1 bg-blue-500 text-white px-4 py-2 rounded-md" onClick={handleConfirm}>
              Confirm
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
