import React, { useState } from "react";
import { useAuth } from "../Context/AuthContext";

const AddUsers = () => {
  const { BASE_URL } = useAuth(); 

  const [userData, setUserData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    rollNumber: "",
    mobile: "",
    course: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalType, setModalType] = useState(""); 
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "",
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    // Validate fields
    Object.keys(userData).forEach((key) => {
      if (!userData[key].trim()) {
        newErrors[key] = `${key.replace(/([A-Z])/g, " $1")} is required.`;
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch(`${BASE_URL}students`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
        body: JSON.stringify(userData),
      });

      const result = await response.json();
      if (response.ok) {
        setModalMessage("User added successfully!");
        setModalType("success");
        setUserData({
          firstName: "",
          lastName: "",
          email: "",
          rollNumber: "",
          mobile: "",
          course: "",
        });
      } else {
        setModalMessage(result.message || "An error occurred.");
        setModalType("error");
      }
    } catch (error) {
      console.error("Error adding user:", error);
      setModalMessage("An error occurred while adding the user.");
      setModalType("error");
    } finally {
      setIsSubmitting(false);
      setIsModalOpen(true);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="flex flex-col items-center min-h-screen p-4 bg-gray-50">
      <div className="w-full max-w-4xl p-6 bg-white shadow-md rounded-lg">
        <h1 className="text-xl font-bold mb-4">Add User</h1>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.keys(userData).map((key) => (
            <div key={key}>
              <label
                htmlFor={key}
                className={`block text-sm font-medium ${
                  errors[key] ? "text-red-500" : ""
                }`}
              >
                {key.replace(/([A-Z])/g, " $1")}
              </label>
              <input
                type="text"
                id={key}
                name={key}
                value={userData[key]}
                onChange={handleChange}
                className={`w-full p-2 border rounded-md ${
                  errors[key]
                    ? "border-red-500 bg-red-100"
                    : "border-gray-300"
                }`}
              />
              {errors[key] && (
                <p className="text-red-500 text-sm mt-1">{errors[key]}</p>
              )}
            </div>
          ))}

          <div className="md:col-span-2 flex justify-end">
            <button
              type="submit"
              className={`px-6 py-2 text-white rounded-md shadow ${
                isSubmitting
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-500 hover:bg-blue-600"
              }`}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Add User"}
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

export default AddUsers;
