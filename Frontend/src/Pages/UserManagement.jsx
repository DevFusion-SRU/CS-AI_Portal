import React, { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContect";


const UserManagement= () => {
    const [activeTab, setActiveTab] = useState("all");
    const [searchQuery, setSearchQuery] = useState("");
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const { currentUser, currentUserRole } = useAuth(); // Tracks the current user and role
    const navigate = useNavigate();
    const hasFetchedData = useRef(false);
  
    const handleAddClick = () => {
      navigate("/AddUsers"); // Redirect to AddUsers page
    };
  
    const openTab = (tab) => {
        if (activeTab !== tab) {
          setActiveTab(tab);
          // Optionally, reset the page when switching tabs
          setCurrentPage(1);
        }
      };
  
    const fetchAPI = useCallback(async (page = 1) => {
      setLoading(true);
      try {
        const response = await fetch(
          `http://localhost:5000/api/students`
        );
        const json = await response.json();
        if (json.success && Array.isArray(json.data)) {
          setStudents(json.data);
          setTotalPages(json.totalPages);
          setCurrentPage(json.currentPage);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
      setLoading(false);
    }, [activeTab]);
  
    useEffect(() => {
      if (hasFetchedData.current) {
        fetchAPI(currentPage);
      } else {
        hasFetchedData.current = true;
      }
    }, [fetchAPI, currentPage]);
  
    const handleSearchChange = (e) => {
      setSearchQuery(e.target.value);
      setCurrentPage(1);
    };
  
    const filteredStudents = students.filter((student) => {
        const fullName = `${student.firstName} ${student.lastName || ""}`.toLowerCase();
        return fullName.includes(searchQuery.toLowerCase());
      });
  
      return (
        <main className="w-full flex flex-col items-center px-4 py-8">
          <section className="w-full max-w-6xl">
            <div className="flex justify-start space-x-8 mb-4 border-b border-gray-200">
              User Management
            </div>
            {currentUserRole === "admin" && (
              <div className="flex justify-end space-x-4 mb-5">
                <button
                  onClick={handleAddClick}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-md shadow hover:bg-blue-600"
                >
                  Add User
                </button>
              </div>
            )}
    
            {loading ? (
              <p>Loading...</p>
            ) : (
              <div className="overflow-x-auto bg-gradient-to-r from-blue-50 to-purple-50 shadow-lg rounded-lg p-6 border border-gray-200">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Roll Number
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Student Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Student Year
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Batch
                      </th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                        View Profile
                      </th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                        Remove
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredStudents.map((student) => (
                      <tr key={student.rollNumber} className="hover:bg-gray-100 transition-all">
                        <td className="px-6 py-4 text-sm text-gray-900">{student.rollNumber}</td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {student.firstName} {student.lastName || ""}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">Ist Year</td>
                        <td className="px-6 py-4 text-sm text-gray-500">2021-2025</td>
                        <td className="px-6 py-4 text-center">
                          <button
                            className="w-24 py-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-sm font-medium rounded-lg shadow-md transition-transform transform hover:scale-105 hover:shadow-lg"
                          >
                            View
                          </button>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <button
                            className="w-24 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-sm font-medium rounded-lg shadow-md transition-transform transform hover:scale-105 hover:shadow-lg"
                          >
                            Remove
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
    
    <div className="flex flex-col sm:flex-row justify-center items-center mt-4 space-y-4 sm:space-y-0 sm:space-x-4">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="px-5 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-sm font-medium rounded-lg shadow-md transition-transform transform hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>

        <div className="flex items-center space-x-2">
          <span className="text-gray-700 text-sm">Page</span>
          <input
            type="number"
            value={currentPage}
            min="1"
            max={totalPages}
            onChange={(e) => setCurrentPage(Number(e.target.value))}
            onBlur={(e) => {
              const value = Math.min(Math.max(Number(e.target.value), 1), totalPages);
              setCurrentPage(value);
              fetchAPI(value);
            }}
            className="w-20 px-3 py-2 border border-gray-300 rounded-md text-center text-sm shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <span className="text-gray-700 text-sm">of {totalPages}</span>
        </div>

        <button
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="px-5 py-2 bg-gradient-to-r from-green-500 to-teal-500 text-white text-sm font-medium rounded-lg shadow-md transition-transform transform hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>

          </section>
        </main>
      );
    };

export default UserManagement;