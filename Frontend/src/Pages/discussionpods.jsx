import React, { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";
import Messagecard from "../Component/messagecard";
import debounce from "lodash.debounce";
import { useAuth } from "../Context/AuthContext";
import { Messages, SearchNormal } from "iconsax-react";
import { useParams } from "react-router-dom";
import Commentscard from "../Component/commentscard";


const discussionpods = () => {
    const [activeTab, setActiveTab] = useState("all");
    const [opportunities, setOpportunities] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [comments,setComments]=useState([])
    const [post,setPost]=useState([])

    const { BASE_URL } = useAuth();

    const { postId } = useParams();

    useEffect(() => {
        console.log("Post ID:", postId); // Logs only when postId changes
    }, [postId]);

    const fetchAPI=async(page = 1)=>{
        try{
        if(loading) return;
        setLoading(true)

        const url=`${BASE_URL}forums/posts/${postId}?sort=mostReplied?page=${page}`
        const response=await axios.get(url)
        console.log(response)

        if (response.data.success) {
            setPost(response.data.data.post);
            setComments(response.data.data.comments ? response.data.data.comments : []);
            console.log("Post Data:", response.data.data.post);
            console.log("Comments Data:", response.data.data.comments);
        }
        
    }
    catch (error) {
        console.error("Error fetching data:", error.response?.data || error.message);
    } finally {
        setLoading(false);
    }
    };
    useEffect(()=>{
        fetchAPI(currentPage);
    },[postId,currentPage]);

    

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
                        <p>
                            Pods
                        </p>
                        <p>mentoring session for google</p>
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
                <div className="flex-1 h-full overflow-y-auto  p-4 rounded-lg">

                    <Messagecard postId={postId} />
                    <div className="w-[968px] h-[65px]  mt-4 rounded-[10px] border border-gray-300 flex items-center bg-white justify-between px-4">
                        <input
                            type="text"
                            placeholder="Add a comment"
                            className="w-full text-gray-500 text-sm outline-none bg-transparent"
                        />
                        <button className="rounded-[8px] border border-[#1B85FF] bg-gradient-to-bl from-white via-[#F7F8FA] to-[#F7F8FA] px-4 py-2 text-[#1B85FF] font-semibold hover:from-[#F7F8FA] hover:to-white transition">post</button>
                    </div>
                    <div className="w-[198px] h-[44px] rounded-[8px] mt-4 border-b border border-[#1B85FF] bg-gradient-to-br from-[#1B85FF] via-[#3B9CE7] to-[#3CC3E9] text-white font-semibold px-4 py-2 transition hover:opacity-90">
                        <button>generate summary</button></div>
                    <div className=" mt-4">
                        <button className="w-[150px] h-[32px] text-center leading-[20px] rounded-[8px] border border-[#1B85FF] bg-gradient-to-bl from-white via-[#F7F8FA] to-[#F7F8FA] px-[16px] py-[6px] text-[#1B85FF] font-semibold hover:from-[#F7F8FA] hover:to-white transition">Newest</button>
                        <button className="w-[156px] h-[32px] ml-2 text-center leading-[20px] rounded-[8px] border-t border border-[#1B85FF] bg-gradient-to-br from-[#1B85FF] via-[#3B9CE7] to-[#3CC3E9] text-white font-semibold px-[16px] py-[6px] transition hover:opacity-90">Most popular</button>
                    </div>
                    
<div className="mt-4">
  {comments === undefined ? (
    <p className="text-gray-500 text-center">Loading comments...</p>
  ) : comments.length > 0 ? (
    comments.map((comment) => (
      <Commentscard key={comment._id || comment.commentId} comment={comment} />
    ))
  ) : (
    <p className="text-gray-500 text-center">No comments available for this post</p>
  )}
</div>

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

export default discussionpods;