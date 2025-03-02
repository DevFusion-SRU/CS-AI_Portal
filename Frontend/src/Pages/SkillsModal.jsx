import React, { useState, useEffect } from "react";
import { CloseCircle } from "iconsax-react";

const SkillsModal = ({ isOpen, onClose, onSave, initialData = {} }) => {
  const [formData, setFormData] = useState({
    skill: "",
    level: "Beginner",
  });
  const [isCustomSkill, setIsCustomSkill] = useState(false);

  const skillsList = ["Python", "Java", "Node.js", "DSA", "React", "SQL", "JavaScript", "C++", "Other"];
  const levels = ["Beginner", "Intermediate", "Expert"];

  useEffect(() => {
    if (isOpen) {
      const isCustom = initialData.skill && !skillsList.slice(0, -1).includes(initialData.skill); // Exclude "Other" from check
      setFormData({
        skill: initialData.skill || "",
        level: initialData.level || "Beginner",
      });
      setIsCustomSkill(isCustom);
      console.log("Editing - initialData:", initialData, "isCustomSkill:", isCustom); // Debug
    }
  }, [isOpen, initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "skill") {
      if (value === "Other") {
        setIsCustomSkill(true);
        setFormData((prev) => ({ ...prev, skill: "" })); // Clear for custom input
      } else {
        setIsCustomSkill(false);
        setFormData((prev) => ({ ...prev, skill: value }));
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleCustomSkillChange = (e) => {
    setFormData((prev) => ({ ...prev, skill: e.target.value }));
  };

  const handleSave = () => {
    if (!formData.skill) {
      alert("Please enter or select a skill.");
      return;
    }
    onSave(formData);
    setFormData({ skill: "", level: "Beginner" });
    setIsCustomSkill(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50 px-2 sm:px-0">
      <div className="bg-white p-4 sm:p-5 rounded-lg w-full max-w-[450px] sm:max-w-[350px] max-h-[85vh] overflow-y-auto relative">
        <div className="flex justify-between items-center mb-3 sm:mb-4">
          <h2 className="text-base sm:text-sm font-medium font-['Quicksand-Medium'] text-gray-900">
            {initialData.skill ? "Edit Skill" : "Add Skill"}
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
            <label className="text-gray-900">Skill*</label>
            <select
              name="skill"
              value={isCustomSkill ? "Other" : formData.skill} // Show "Other" for custom skills, otherwise formData.skill
              onChange={handleChange}
              className="w-full h-8 sm:h-9 p-2 bg-gray-100 rounded-md border border-gray-300 text-xs"
            >
              <option value="">Select a skill</option>
              {skillsList.map((skill) => (
                <option key={skill} value={skill}>
                  {skill}
                </option>
              ))}
            </select>
          </div>
          {isCustomSkill && (
            <div className="flex flex-col gap-1">
              <label className="text-gray-900">Custom Skill*</label>
              <input
                name="customSkill"
                value={formData.skill}
                onChange={handleCustomSkillChange}
                placeholder="e.g., Machine Learning"
                className="w-full h-8 sm:h-9 p-2 bg-gray-100 rounded-md border border-gray-300 text-xs placeholder-gray-500"
              />
            </div>
          )}
          <div className="flex flex-col gap-1">
            <label className="text-gray-900">Expertise Level*</label>
            <select
              name="level"
              value={formData.level}
              onChange={handleChange}
              className="w-full h-8 sm:h-9 p-2 bg-gray-100 rounded-md border border-gray-300 text-xs"
            >
              {levels.map((level) => (
                <option key={level} value={level}>
                  {level}
                </option>
              ))}
            </select>
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
              {initialData.skill ? "Save" : "Add"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkillsModal;