import React, { useEffect, useState, useCallback, useRef } from "react";
import axios from "axios";
axios.defaults.withCredentials=true
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";
import { FaSearch } from "react-icons/fa";
import JobCard from "../Component/Jobcard";
import images from "../utils/importImages";
import { SearchNormal,Filter } from "iconsax-react"

const Launchpad = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [viewingJobId, setViewingJobId] = useState(null);
  const { BASE_URL } = useAuth();
  const navigate = useNavigate();
  const hasFetchedData = useRef(false);

  const openTab = (tab) => {
    if (activeTab !== tab) {
      setActiveTab(tab);
      setLoading(true)
      setCurrentPage(1);

    }
  };



  // Fetch data from the API
  const fetchAPI = useCallback(
    async (page = 1) => {
      setLoading(true);
      try {

        const response = await fetch(
          `${BASE_URL}jobs`
        );
        const json = await response.json();
        console.log(json.data)
        if (json.success && Array.isArray(json.data)) {

          setOpportunities(json.data);

          setTotalPages(json.totalPages);
          setCurrentPage(json.currentPage);
          setLoading(false)
        } else {
          setOpportunities([]);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
      setLoading(false);
    },
    [activeTab]
  );
  // console.log(activeTab,filters)



  // Debounced fetching logic
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchAPI(currentPage); // Fetch API after debounce delay
    }, 500); // Adjust debounce delay (500ms is a common value)

    // Cleanup function to cancel the previous timeout if the user types again
    return () => clearTimeout(delayDebounce);
  }, [currentPage, activeTab]); // Debounce only on search query and currentPage



  return (
    <main className="w-auto flex flex-col items-center px-4 py-8">
      <section className="w-full flex-1 p-10 max-w-6xl">
        <div className="flex justify-between items-center border-b pb-4">
          <h1 className="font-quickstand text-h6 text-[#0A3D91] font-bold leading-[72px] flex items-center">
            Launchpad
            <span>
              <img src={images["svgg.png"]} alt="Launchpad Icon" className="w-10 h-10 ml-2" />
            </span>
          </h1>




          <div className="relative flex items-center space-x-2">
            <input
              type="text"
              placeholder="Search for jobs"
              className="px-4 py-2 pl-10  rounded-md shadow-md"
            />
            <SearchNormal
              size={25}
              color="#0A3D91"
              className="absolute left-1 top-1/2 transform -translate-y-1/2"
            />
            <div
    onClick={() => alert('Filter & Sort clicked')}
    className="font-Lato text-[#1B85FF] relative  h2 font-bold text- h4 flex items-center space-x-2 hover:text-blue-700 cursor-pointer transition duration-200"
>
<Filter size={20} color="#0A3D91" className="mr-2" />
    Filter & Sort
  </div>
          </div>
        </div>

        <div className="mt-2 flex flex-col gap-y-4  w-full">
          {loading ? (
            <p className="text-gray-500 md:flex-row  text-center">Loading...</p>
          ) : (
            opportunities.map((job) => <JobCard key={job.id} job={job} />)
          )}
        </div>

      </section>

    </main>

  );
};

export default Launchpad;