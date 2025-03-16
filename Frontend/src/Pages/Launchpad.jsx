import React, { useEffect, useState, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";
import JobCard from "../Component/Jobcard";
import images from "../utils/importImages";
import { SearchNormal } from "iconsax-react";
import axios from "axios";
import FilterMenu from "../Component/Filterandsort";
import debounce from "lodash.debounce";

const Launchpad = () => {
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({});
  const { BASE_URL } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const contentRef = useRef(null);
  const [hasMore, setHasMore] = useState(true);




const buildQueryParams = () => {
  const params = [`page=${currentPage}`]; // Start with page parameter

  const keyMapping = {
    jobType: "type",
    industry: "category",
    modeOfWork: "modeOfWork",
    compensation: "compensationType",
    skills: "skills",
  };

  Object.entries(filters).forEach(([key, value]) => {
    const mappedKey = keyMapping[key] || key;

    if (Array.isArray(value) && value.length > 0) {
      params.push(`${mappedKey}=${value.join(",")}`); // ✅ Manually construct query
    } else if (typeof value === "string" && value.trim() !== "") {
      params.push(`${mappedKey}=${value}`);
    }
  });

  const queryString = params.join("&"); // ✅ Join all parameters
  console.log("Final Query String:", queryString); // Debugging output
  return queryString;
};
 

  

  // Fetch job listings
  const fetchAPI = async () => {
    if (loading || !hasMore) return;
    setLoading(true);
  
    try {
      let url = "";
      const params = buildQueryParams(); // ✅ Get query parameters
  
      if (searchQuery.trim() !== "") {
        // ✅ Only fetch from search API when searching
        url = `${BASE_URL}jobs/searchCompanies?query=${encodeURIComponent(searchQuery)}&${params}`;
      } else {
        // ✅ Otherwise, fetch normal jobs
        url = `${BASE_URL}jobs?${params}`;
      }
  
      console.log("API Call:", url); // ✅ Now logs the correct updated URL
  
      const response = await axios.get(url);
  
      if (response.data.success && Array.isArray(response.data.data)) {
        setOpportunities((prevJobs) =>
          currentPage === 1 ? response.data.data : [...prevJobs, ...response.data.data] // ✅ Append if scrolling
        );}
    } catch (error) {
      console.error("Error fetching data:", error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };
  
  
  useEffect(() => {
    if (searchQuery.trim() === "") {
      fetchAPI();
    }
  }, [currentPage, filters]);

  useEffect(() => {
    if (searchQuery.trim() !== "") {
      setCurrentPage(1); // ✅ Reset page on new search
      setOpportunities([]); // ✅ Clear old jobs before fetching new ones
      setHasMore(true);
      fetchAPI();
    }
    else {
      setCurrentPage(1); // ✅ Reset page when clearing search
      setOpportunities([]); // ✅ Clear search results
      setHasMore(true);
      fetchAPI(); // ✅ Fetch default job listings when searchQuery is empty
    }
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
    console.log("Scroll listener added");
  
    return () => {
      container.removeEventListener("scroll", handleScroll);
      console.log("Scroll listener removed");
    };
  }, []);
  

  // Apply filters and reset page
  const handleFilterApply = (selectedFilters) => {
    console.log(selectedFilters)
    setFilters(selectedFilters);
    setCurrentPage(1);
    setOpportunities([]); // Reset the job list on filter change
    setHasMore(true);
  };


  const handleSearchChange = (e) => {
    const query = e.target.value.trim();
    setSearchQuery(query);
    setCurrentPage(1);
    setHasMore(true);
  };
  
  
  
  
  return (
    <main
      ref={contentRef}
      className="w-full h-screen overflow-y-auto flex flex-col items-center px-4 py-8 
                scrollbar-thin scrollbar-thumb-blue-500 scrollbar-track-gray-200 scrollbar-thumb-rounded-md">
      <section className="w-full flex-1 p-10 max-w-8xl">
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
  placeholder="Search by company"
  className="px-4 py-2 pl-10 rounded-md shadow-md"
  value={searchQuery}
  onChange={handleSearchChange}
/>
            <SearchNormal
              size={25}
              color="#0A3D91"
              className="absolute left-1 top-1/2 transform -translate-y-1/2"
            />
            <FilterMenu onApplyFilters={handleFilterApply} />
          </div>
        </div>
        <div className="mt-2 flex flex-col gap-y-4 w-full">

  {opportunities.length > 0 ? (
    opportunities.map((job) => (
      <JobCard key={job.id} job={job} />
    ))
  ) : (
    !loading && <p className="text-gray-500 text-center">No jobs found</p>
  )}

  {loading && <p className="text-gray-500 text-center">Loading more jobs...</p>}
</div>

      </section>
    </main>
  ); 
};

export default Launchpad;
