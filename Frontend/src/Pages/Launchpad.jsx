import React, { useEffect, useState, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";
import JobCard from "../Component/Jobcard";
import images from "../utils/importImages";
import { SearchNormal } from "iconsax-react";
import axios from "axios";
import FilterMenu from "../Component/Filterandsort";
import debounce from "lodash.debounce";

const SkeletonJobCard = () => (
  <div className="animate-pulse bg-gray-200 rounded-lg p-4 shadow-md">
    <div className="h-4 bg-gray-300 rounded w-3/4 mb-3"></div>
    <div className="h-3 bg-gray-400 rounded w-1/2 mb-3"></div>
    <div className="h-3 bg-gray-400 rounded w-2/3 mb-3"></div>
    <div className="h-10 bg-gray-300 rounded w-full"></div>
  </div>
);

const Launchpad = () => {
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({});
  const { BASE_URL } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const contentRef = useRef(null);
  const [hasMore, setHasMore] = useState(true);

  const LIMIT = 25;

  const buildQueryParams = () => {
    const params = [`page=${currentPage}`, `limit=${LIMIT}`];
    const keyMapping = {
      jobType: "type",
      industry: "category",
      modeOfWork: "modeOfWork",
      compensation: "compensationType",
      skills: "skills",
      sort: "sort",
    };

    Object.entries(filters).forEach(([key, value]) => {
      const mappedKey = keyMapping[key] || key;
      if (Array.isArray(value) && value.length > 0) {
        params.push(`${mappedKey}=${value.join(",")}`);
      } else if (typeof value === "string" && value.trim() !== "") {
        params.push(`${mappedKey}=${value === "Newest" ? "-createdAt" : "createdAt"}`);
      }
    });

    return params.join("&");
  };

  const fetchAPI = async () => {
    if (loading || !hasMore) return;
    setLoading(true);

    try {
      let url = "";
      const params = buildQueryParams();

      if (searchQuery.trim() !== "") {
        url = `${BASE_URL}jobs/searchCompanies?query=${encodeURIComponent(searchQuery.trim())}&${params}`;
      } else {
        url = `${BASE_URL}jobs?${params}`;
      }

      const response = await axios.get(url);

      if (response.data.success && Array.isArray(response.data.data)) {
        const newJobs = response.data.data;
        setOpportunities((prevJobs) =>
          currentPage === 1 ? newJobs : [...prevJobs, ...newJobs]
        );
        setHasMore(newJobs.length === LIMIT);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Error fetching data:", error.response?.data || error.message);
    } finally {
      setLoading(false);
      setInitialLoading(false);
    }
  };

  useEffect(() => {
    setInitialLoading(true);
    fetchAPI();
  }, [currentPage, filters]);

  useEffect(() => {
    setCurrentPage(1);
    setOpportunities([]);
    setHasMore(true);
    fetchAPI();
  }, [searchQuery]);

  const handleScroll = useCallback(
    debounce(() => {
      const container = contentRef.current;
      if (!container || loading || !hasMore) return;

      const bottomReached =
        container.scrollTop + container.clientHeight >= container.scrollHeight - 50;

      if (bottomReached) {
        setCurrentPage((prevPage) => prevPage + 1);
      }
    }, 300),
    [loading, hasMore]
  );

  useEffect(() => {
    const container = contentRef.current;
    if (!container) return;

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  const handleFilterApply = (selectedFilters) => {
    setFilters(selectedFilters);
    setCurrentPage(1);
    setOpportunities([]);
    setHasMore(true);
  };

  const debouncedSearch = useCallback(
    debounce((query) => {
      setSearchQuery(query);
    }, 300),
    []
  );

  const handleSearchChange = (e) => {
    const query = e.target.value.trim();
    setSearchQuery(query);
    debouncedSearch(query);
  };

  return (
    <main
      ref={contentRef}
      className="w-full min-h-screen overflow-y-auto flex flex-col items-center 
                 bg-gray-50 p-2
                 scrollbar-thin scrollbar-thumb-blue-500 scrollbar-track-gray-200 
                 scrollbar-thumb-rounded-md"
    >
      <section className="w-full flex-1 p-3 sm:p-5 md:p-8 max-w-[1600px] bg-white rounded-lg shadow-lg">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center 
                       border-b border-gray-200 pb-3 gap-3 sm:gap-0">
          <h1 className="font-quickstand text-xl sm:text-3xl md:text-5xl 
                        text-[#0A3D91] font-bold 
                        flex items-center whitespace-nowrap">
            Launchpad
            <span>
              <img 
                src={images["svgg.png"]} 
                alt="Launchpad Icon" 
                className="w-6 h-6 sm:w-8 sm:h-8 ml-2" 
              />
            </span>
          </h1>
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center 
                         gap-2 sm:gap-4 w-full sm:w-auto">
            <div className="relative flex items-center w-full sm:w-72">
              <SearchNormal
                size={20}
                color="#0A3D91"
                className="absolute left-3 top-1/2 transform -translate-y-1/2"
              />
              <input
                type="text"
                placeholder="Search jobs..."
                className="w-full pl-10 pr-4 py-2 rounded-lg shadow-sm bg-gray-100 
                          text-sm text-gray-800 placeholder-gray-500 
                          focus:outline-none focus:ring-2 focus:ring-blue-400 
                          transition duration-200"
                value={searchQuery}
                onChange={handleSearchChange}
              />
            </div>
            <FilterMenu onApplyFilters={handleFilterApply} />
          </div>
        </div>

        <div className="mt-4 flex flex-col gap-4 w-full">
          {initialLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array(6)
                .fill()
                .map((_, index) => (
                  <SkeletonJobCard key={index} />
                ))}
            </div>
          ) : opportunities.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {opportunities.map((job) => (
                <JobCard 
                  key={job.id} 
                  job={job} 
                  className="bg-white hover:bg-blue-50 border border-gray-200 
                            shadow-md hover:shadow-lg transition duration-200 
                            rounded-lg p-4" 
                />
              ))}
            </div>
          ) : (
            <p className="text-gray-600 text-center py-8 text-base font-medium">
              No jobs found matching your criteria
            </p>
          )}

          {loading && !initialLoading && (
            <div className="flex justify-center items-center py-4">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 
                            border-b-2 border-blue-500"></div>
              <p className="ml-3 text-gray-600 text-sm font-medium">
                Loading more jobs...
              </p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
};

export default Launchpad;