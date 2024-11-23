import React, { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContect";


const UserManagement = () => {
    const [activeTab, setActiveTab] = useState("all");
    const [searchQuery, setSearchQuery] = useState("");
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [filters, setFilters] = useState({ year: "", batch: "" });
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const { currentUser, currentUserRole } = useAuth(); // Tracks the current user and role
    const navigate = useNavigate();
    const hasFetchedData = useRef(false);
  
    const handleAddClick = () => {
        navigate("/AddUsers"); // Redirect to AddUsers page
    };

    const toggleFilterMenu = () => {
        setIsFilterOpen(prevState => !prevState);
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
                `http://localhost:5000/api/students?page=${page}&limit=10&type=${activeTab}&year=${filters.year}&batch=${filters.batch}`
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
    }, [activeTab, filters]);
  
    useEffect(() => {
        if (hasFetchedData.current) {
            fetchAPI(currentPage);
        } else {
            hasFetchedData.current = true;
        }
    }, [fetchAPI, currentPage, filters]);
  
    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
        setCurrentPage(1);
    };
  
    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const filteredStudents = students.filter((student) => {
        const fullName = `${student.firstName} ${student.lastName || ""}`.toLowerCase();
        const matchesSearchQuery = fullName.includes(searchQuery.toLowerCase()) || student.rollNumber.includes(searchQuery);
        const matchesYearFilter = filters.year ? student.year === filters.year : true;
        const matchesBatchFilter = filters.batch ? student.batch === filters.batch : true;

        return matchesSearchQuery && matchesYearFilter && matchesBatchFilter;
    });
  
    return (
        <main className="w-full flex flex-col items-center px-4 py-8">
            <section className="w-full max-w-6xl">
                <div className="flex justify-between items-center mb-4 border-b border-gray-200">
                    <div className="flex space-x-4">
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={handleSearchChange}
                            placeholder="Search by Roll Number or Name"
                            className="px-4 py-2 border border-gray-300 rounded-md shadow-md"
                        />
                        <button
                            onClick={toggleFilterMenu}
                            className="px-4 py-2 bg-blue-500 text-white rounded-md shadow hover:bg-blue-600"
                        >
                            Filter
                        </button>
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
                </div>

                {/* Filter Dropdown */}
                {isFilterOpen && (
                    <div className="absolute top-16 right-0 w-48 bg-white shadow-lg p-4 rounded-lg">
                        <div className="flex flex-col space-y-2">
                            <div>
                                <label htmlFor="year" className="block text-sm font-medium text-gray-700">Year</label>
                                <select
                                    id="year"
                                    name="year"
                                    value={filters.year}
                                    onChange={handleFilterChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                >
                                    <option value="">Select Year</option>
                                    <option value="1st">1st Year</option>
                                    <option value="2nd">2nd Year</option>
                                    <option value="3rd">3rd Year</option>
                                    <option value="4th">4th Year</option>
                                </select>
                            </div>
                            <div>
                                <label htmlFor="batch" className="block text-sm font-medium text-gray-700">Batch</label>
                                <select
                                    id="batch"
                                    name="batch"
                                    value={filters.batch}
                                    onChange={handleFilterChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                >
                                    <option value="">Select Batch</option>
                                    <option value="2021-2025">2021-2025</option>
                                    <option value="2017-2021">2017-2021</option>
                                    <option value="2013-2017">2013-2017</option>
                                    <option value="2009-2013">2009-2013</option>
                                </select>
                            </div>
                            <div className="flex justify-end mt-4">
                                <button
                                    onClick={toggleFilterMenu}
                                    className="px-4 py-2 bg-green-500 text-white rounded-md shadow hover:bg-green-600"
                                >
                                    Apply Filters
                                </button>
                            </div>
                        </div>
                    </div>
                )}
    
                {loading ? (
                    <p>Loading...</p>
                ) : (
                    <div className="overflow-x-auto bg-gradient-to-r from-blue-50 to-purple-50 shadow-lg rounded-lg p-6 border border-gray-200">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Roll Number</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Student Name</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Student Year</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Batch</th>
                                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">View Profile</th>
                                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Remove</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredStudents.map((student) => (
                                    <tr key={student.rollNumber} className="hover:bg-gray-100 transition-all">
                                        <td className="px-6 py-4 text-sm text-gray-900">{student.rollNumber}</td>
                                        <td className="px-6 py-4 text-sm text-gray-900">
                                            {student.firstName} {student.lastName || ""}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500">{student.year}</td>
                                        <td className="px-6 py-4 text-sm text-gray-500">{student.batch}</td>
                                        <td className="px-6 py-4 text-center">
                                            <button className="w-24 py-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-sm font-medium rounded-lg shadow-md transition-transform transform hover:scale-105 hover:shadow-lg">View</button>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <button className="w-24 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-sm font-medium rounded-lg shadow-md transition-transform transform hover:scale-105 hover:shadow-lg">Remove</button>
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
