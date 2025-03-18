import React, { useState, useEffect, useCallback, useRef } from "react";
import axios from "axios";
axios.defaults.withCredentials = true;
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";
import { FaSearch, FaPlus } from "react-icons/fa";

function debounce(func, wait) {
    let timeout;
    return function (...args) {
        const context = this;
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(context, args), wait);
    };
}

const UserManagement = () => {
    const [activeTab, setActiveTab] = useState("all");
    const [searchQuery, setSearchQuery] = useState("");
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [filters, setFilters] = useState({ year: "", batch: "" });
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const { currentUserRole, BASE_URL } = useAuth();
    const navigate = useNavigate();
    const hasFetchedData = useRef(false);

    const handleAddClick = () => {
        navigate("/addusers");
    };

    const toggleFilterMenu = () => {
        setIsFilterOpen((prevState) => !prevState);
    };

    const handleViewProfile = (rollNumber) => {
        navigate(`/profile/${rollNumber}`);
    };

    const fetchAPI = useCallback(async (page = 1) => {
        setLoading(true);
        try {
            const response = await axios.get(
                `${BASE_URL}students?page=${page}&limit=10&type=${activeTab}&year=${filters.year}&batch=${filters.batch}`,
                { withCredentials: true }
            );
            const json = response.data;
            if (json.success && Array.isArray(json.data)) {
                setStudents(json.data);
                setTotalPages(json.totalPages);
                setCurrentPage(json.currentPage);
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        }
        setLoading(false);
    }, [activeTab, filters, BASE_URL]);

    useEffect(() => {
        fetchAPI(currentPage);
    }, [fetchAPI, currentPage]);

    const handleSearchChange = async (e) => {
        const query = e.target.value.trim();
        setSearchQuery(query);

        const params = new URLSearchParams();
        if (/^\d/.test(query)) {
            params.append("rollNumber", query);
        } else {
            const words = query.split(" ");
            params.append("firstName", words[0]);
            if (words.length > 1) params.append("lastName", query);
        }

        try {
            setLoading(true);
            const response = await axios.get(`${BASE_URL}students?${params.toString()}`, {
                withCredentials: true,
            });
            const json = response.data;
            if (json.success) {
                if (params.has("rollNumber")) {
                    setStudents(json.data.filter((student) => student.rollNumber === query));
                } else {
                    setStudents(json.data);
                }
            } else {
                setStudents([]);
                console.error(json.message || "No students found.");
            }
        } catch (error) {
            console.error("Error fetching search results:", error);
        } finally {
            setLoading(false);
        }
    };

    const handlePageChange = (e) => {
        const value = Number(e.target.value);
        if (value >= 1 && value <= totalPages) setCurrentPage(value);
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters((prevState) => ({ ...prevState, [name]: value }));
    };

    return (
        <main className="w-full flex flex-col items-center px-4 py-8 bg-gray-50 min-h-screen">
            <section className="w-full max-w-6xl bg-white p-6 rounded-lg shadow-md">
                <div className="flex flex-col sm:flex-row justify-between items-center mb-6 border-b border-gray-200 pb-4">
                    <h1 className="text-2xl font-bold text-gray-800 mb-4 sm:mb-0">User Management</h1>
                    <div className="flex space-x-4 items-center">
                        <div className="relative w-full max-w-xs">
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={handleSearchChange}
                                placeholder="Search by Roll Number or Name"
                                className="px-4 py-2 w-full border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 pl-10"
                            />
                            <FaSearch className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-400" />
                        </div>
                        <button
                            onClick={toggleFilterMenu}
                            className="px-4 py-2 bg-blue-500 text-white rounded-md shadow hover:bg-blue-600 transition-colors"
                        >
                            Filter
                        </button>
                        {currentUserRole === "staff" && (
                            <button
                                onClick={handleAddClick}
                                className="px-4 py-2 text-sm font-medium text-white bg-green-500 rounded-md shadow hover:bg-green-600 flex items-center gap-2 transition-colors"
                            >
                                <FaPlus /> Add User
                            </button>
                        )}
                    </div>
                </div>

                {isFilterOpen && (
                    <div className="absolute top-24 right-4 w-48 bg-white shadow-lg p-4 rounded-lg z-10">
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
                            <button
                                onClick={toggleFilterMenu}
                                className="px-4 py-2 bg-green-500 text-white rounded-md shadow hover:bg-green-600 mt-2"
                            >
                                Apply Filters
                            </button>
                        </div>
                    </div>
                )}

                {loading ? (
                    <p className="text-center text-gray-600">Loading...</p>
                ) : (
                    <div className="overflow-x-auto bg-gradient-to-r from-blue-50 to-purple-50 shadow-lg rounded-lg p-6">
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
                                {students.map((student) => (
                                    <tr key={student.rollNumber} className="hover:bg-gray-100 transition-all">
                                        <td className="px-6 py-4 text-sm text-gray-900">{student.rollNumber}</td>
                                        <td className="px-6 py-4 text-sm text-gray-900">{student.firstName} {student.lastName || ""}</td>
                                        <td className="px-6 py-4 text-sm text-gray-900">{student.year}</td>
                                        <td className="px-6 py-4 text-sm text-gray-900">{student.batch}</td>
                                        <td className="px-6 py-4 text-center">
                                            <button
                                                onClick={() => handleViewProfile(student.rollNumber)}
                                                className="text-indigo-600 hover:text-indigo-900"
                                            >
                                                View
                                            </button>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <button className="text-red-600 hover:text-red-900">Remove</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                <div className="flex justify-center items-center space-x-2 mt-6">
                    <button
                        onClick={() => setCurrentPage(1)}
                        disabled={currentPage === 1}
                        className={`px-4 py-2 rounded-md shadow text-sm font-medium transition-colors ${
                            currentPage === 1 ? "bg-gray-300 text-gray-500 cursor-not-allowed" : "bg-blue-600 text-white hover:bg-blue-700"
                        }`}
                    >
                        First
                    </button>
                    {currentPage - 1 > 1 && (
                        <button
                            onClick={() => setCurrentPage((prev) => Math.max(prev - 2, 1))}
                            className="px-4 py-2 bg-blue-500 text-white rounded-md shadow hover:bg-blue-600 transition-colors"
                        >
                            {currentPage - 2}
                        </button>
                    )}
                    {currentPage > 1 && (
                        <button
                            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                            className="px-4 py-2 bg-blue-500 text-white rounded-md shadow hover:bg-blue-600 transition-colors"
                        >
                            {currentPage - 1}
                        </button>
                    )}
                    <button className="w-16 text-center py-2 border border-gray-300 rounded-md shadow text-sm font-medium bg-blue-100">
                        {currentPage}
                    </button>
                    {currentPage < totalPages && (
                        <button
                            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                            className="px-4 py-2 bg-blue-500 text-white rounded-md shadow hover:bg-blue-600 transition-colors"
                        >
                            {currentPage + 1}
                        </button>
                    )}
                    {currentPage < totalPages - 1 && (
                        <button
                            onClick={() => setCurrentPage((prev) => Math.min(prev + 2, totalPages))}
                            className="px-4 py-2 bg-blue-500 text-white rounded-md shadow hover:bg-blue-600 transition-colors"
                        >
                            {currentPage + 2}
                        </button>
                    )}
                    <button
                        onClick={() => setCurrentPage(totalPages)}
                        disabled={currentPage === totalPages}
                        className={`px-4 py-2 rounded-md shadow text-sm font-medium transition-colors ${
                            currentPage === totalPages ? "bg-gray-300 text-gray-500 cursor-not-allowed" : "bg-blue-600 text-white hover:bg-blue-700"
                        }`}
                    >
                        Last
                    </button>
                </div>
                <p className="mt-4 text-sm text-gray-500 text-center">Page {currentPage} of {totalPages}</p>
            </section>
        </main>
    );
};

export default UserManagement;