import React, { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";
axios.defaults.withCredentials = true;
import { Messages, SearchNormal } from "iconsax-react";
import PostCard from "../Component/postcard";
import debounce from "lodash.debounce";
import { useAuth } from "../Context/AuthContext";

const Discussions = () => {
    const [activeTab, setActiveTab] = useState("all");
    const [opportunities, setOpportunities] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const contentRef = useRef(null);
    const { BASE_URL } = useAuth();
    const [hasMore, setHasMore] = useState(true);

    

    const openTab = (tab) => {
        if (activeTab !== tab) {
            setActiveTab(tab);
            setLoading(true);
            setCurrentPage(1);
        }
    };
    const fetchAPI = async (page = 1) => {
        if (loading || !hasMore) return; // Stop fetching if already loading or no more posts
        setLoading(true);
    
        try {
            const url = `${BASE_URL}forums/posts?page=${page}`;
            console.log("API Call:", url);
    
            const response = await axios.get(url);
            console.log(response)
            const newPosts = response.data?.data || []; 
    
            if (response.data.success && Array.isArray(newPosts)) {
                setOpportunities((prevPosts) => {
                    // Append new posts only if they are not duplicates
                    const uniquePosts = [...new Map([...prevPosts, ...newPosts].map(post => [post.postId, post])).values()];
                    return uniquePosts;
                });
    
                // If API returns an empty array, stop fetching
                if (newPosts.length === 0) {
                    setHasMore(false);
                    console.log("All posts loaded, stopping fetch.");
                }
            } else {
                console.warn("Unexpected API response format:", response);
            }
        } catch (error) {
            console.error("Error fetching data:", error.response?.data || error.message);
        } finally {
            setLoading(false);
        }
    };
    
    
    useEffect(() => {
        if (hasMore) {
            fetchAPI(currentPage);
        }
    }, [currentPage, hasMore]); // Only runs if `hasMore` is true
    

    const handleScroll = useCallback(
        debounce(() => {
            if (!hasMore || loading) return; // Stop scrolling if all posts are loaded
    
            const container = contentRef.current;
            if (!container) return;
    
            const bottomReached =
                container.scrollTop + container.clientHeight >= container.scrollHeight - 10;
    
            if (bottomReached) {
                setCurrentPage((prevPage) => prevPage + 1);
            }
        }, 500), // Increased debounce delay
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

    return (
        <div className="h-screen w-full flex flex-col  overflow-hidden">
    
    {/* Header Section */}
    <div className="font-quicksand px-7 py-4 space-y-8">
        <div className="flex justify-start items-center">
            <div className="font-semibold text-4xl text-[#0A3D91]">Discussion Pods</div>
            <Messages size={42} color="#0A3D91" className="ml-2" />
        </div>
        <div className="flex w-full">
            <div className="flex justify-start text-sm font-bold items-center space-x-8 text-[#3A3A3A]">
                {[
                    { id: "all", label: "All Pods" },
                    { id: "Full-time", label: "My Pods" },
                    
                ].map((tab) => (
                    <button
                        key={tab.id}
                        className={`${
                            activeTab === tab.id ? "border-b-2 border-b-[#0A3D91]" : ""
                        }`}
                        onClick={() => openTab(tab.id)}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>
            <div className="ml-auto">
                <div className="flex items-center w-[210px] h-[30px] border-none bg-[#FFFFFF] rounded-3xl px-3 space-x-2">
                    <SearchNormal size={20} color="#0A3D91" className="mr-2" />
                    <input
                        type="text"
                        placeholder="Search for Pods"
                        className="w-full text-gray-500 text-sm outline-none bg-transparent"
                    />
                </div>
            </div>
        </div>
    </div>

    {/* Main Content Section (Left: Scrollable, Right: Static) */}
    <div className="flex flex-1 px-7 space-x-8 h-full min-h-0">

        
        {/* Left Scrollable Container */}
        <div ref={contentRef} className="flex-1 h-full overflow-y-auto p-4 rounded-lg">

            {loading ? (
                <div className="flex justify-center items-center">
                    <p className="text-gray-500">Loading...</p>
                </div>
            ) : opportunities.length === 0 ? (
                <p className="text-gray-500 text-center py-4">
                    No opportunities found. Try a different search.
                </p>
            ) : (
                opportunities.map((post) => <PostCard key={post.postId} opportunity={post} />)
            )}
        </div>

        {/* Right Static Sidebar */}
        <div className="w-[296px] min-w-[240px] p-6 flex flex-col items-start gap-[22px] bg-white rounded-lg shadow-md overflow-hidden">

            {/* Section 1: Top Pods */}
            <div>
                <div className="mb-4 text-2xl font-quicksand font-semibold">Top Pods to Join</div>
                <div className="space-y-4">
                    {[
                        "Meta Hacker Cup Discussion",
                        "Adobe UX Internship Insights",
                        "Amazon SDE Hiring Pod",
                        "PayPal Summer Internship Q&A",
                        "SIH Hackathon Teaming & Strategy",
                    ].map((pod, index) => (
                        <div key={index} className="text-[#3A3A3A] text-sm">
                            {pod}
                        </div>
                    ))}
                </div>
            </div>

            {/* Section 2: Moderator Rules */}
            <div>
                <div className="mb-4 text-2xl font-quicksand font-semibold">Moderator Rules</div>
                <div className="space-y-4">
                    {["Be respectful", "Stay on topic", "No Spam", "Share value", "Follow Guidelines"].map(
                        (rule, index) => (
                            <div key={index} className="text-[#3A3A3A] text-sm">
                                {rule}
                            </div>
                        )
                    )}
                </div>
            </div>
        </div>
    </div>
</div>

    );
};

export default Discussions;
