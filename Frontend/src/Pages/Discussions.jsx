import React, { useState } from 'react'
import axios from "axios";
axios.defaults.withCredentials = true
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";
import { Messages, SearchNormal, Clock } from "iconsax-react"

const Discussions = () => {
    const [activeTab, setActiveTab] = useState('all')
    const [currenpage, setCurrentPage] = useState(1)
    const [loading, setLoading] = useState(false)
    const openTab = (tab) => {
        if (activeTab !== tab) {
            setActiveTab(tab);
            setLoading(true)
            setCurrentPage(1);

        }
    };
    let posts = [
        {
            "_id": "67b71264c349300097a8c6bf",
            "title": "posts title 3",
            "description": "lorem ipsum 3",
            "photo": null,
            "postedBy": "2203A51L93",
            "userType": "Student",
            "likes": [],
            "likedUserType": [],
            "comments": [],
            "postId": "2cb0c251-c5b0-4e5b-b8c5-606afd8ec969",
            "createdAt": "2025-02-20T11:30:44.619Z",
            "updatedAt": "2025-02-20T11:30:44.619Z",
            "__v": 0
        },
        {
            "_id": "67b7125dc349300097a8c6bd",
            "title": "posts title 2",
            "description": "lorem ipsum 2",
            "photo": null,
            "postedBy": "2203A51L93",
            "userType": "Student",
            "likes": [],
            "likedUserType": [],
            "comments": [],
            "postId": "dd3ce729-3272-467e-9e5e-613141b83ae6",
            "createdAt": "2025-02-20T11:30:37.416Z",
            "updatedAt": "2025-02-20T11:30:37.416Z",
            "__v": 0
        },
        {
            "_id": "67b71256c349300097a8c6bb",
            "title": "posts title 1",
            "description": "lorem ipsum 1",
            "photo": null,
            "postedBy": "2203A51L93",
            "userType": "Student",
            "likes": [],
            "likedUserType": [],
            "comments": [],
            "postId": "a954a74e-d4bf-44f0-a8bc-01a66ba2017b",
            "createdAt": "2025-02-20T11:30:30.129Z",
            "updatedAt": "2025-02-20T11:30:30.129Z",
            "__v": 0
        },
        {
            "_id": "67b71256c349300097a8c6bx",
            "title": "posts title 1",
            "description": "lorem ipsum 1",
            "photo": null,
            "postedBy": "2203A51L93",
            "userType": "Student",
            "likes": [],
            "likedUserType": [],
            "comments": [],
            "postId": "a954a74x-d4bf-44f0-a8bc-01a66ba2017b",
            "createdAt": "2025-02-20T11:30:30.129Z",
            "updatedAt": "2025-02-20T11:30:30.129Z",
            "__v": 0
        },
        {
            "_id": "67b71256c349300097a8c6by",
            "title": "posts title 1",
            "description": "lorem ipsum 1",
            "photo": null,
            "postedBy": "2203A51L93",
            "userType": "Student",
            "likes": [],
            "likedUserType": [],
            "comments": [],
            "postId": "a954a74y-d4bf-44f0-a8bc-01a66ba2017b",
            "createdAt": "2025-02-20T11:30:30.129Z",
            "updatedAt": "2025-02-20T11:30:30.129Z",
            "__v": 0
        },
        {
            "_id": "67b71256c349300097a8c6bz",
            "title": "posts title 1",
            "description": "lorem ipsum 1",
            "photo": null,
            "postedBy": "2203A51L93",
            "userType": "Student",
            "likes": [],
            "likedUserType": [],
            "comments": [],
            "postId": "a954a74z-d4bf-44f0-a8bc-01a66ba2017b",
            "createdAt": "2025-02-20T11:30:30.129Z",
            "updatedAt": "2025-02-20T11:30:30.129Z",
            "__v": 0
        }
    ]


    return (
        <div className="w-full  flex flex-col pl-7 py-4 overflow-hidden">
            {/* Header Section */}
            <div className="font-quicksand space-y-8">
                <div className="flex justify-start items-center">
                    <div className="font-semibold text-4xl text-[#0A3D91]">Discussion Pods</div>
                    <Messages size={42} color="#0A3D91" className="ml-2" />
                </div>
                <div className="flex w-full">
                    <div className="flex justify-start text-sm font-bold items-center space-x-8 text-[#3A3A3A]">
                        {[
                            { id: "all", label: "All Pods" },
                            { id: "Full-time", label: "My Pods" },
                            { id: "Internship", label: "Mission Pods" },
                            { id: "Hackathon", label: "Open Forums" },
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                className={`${activeTab === tab.id ? "border-b-2 border-b-[#0A3D91]" : ""}`}
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

            {/* Main Content */}
            <div className="flex flex-1 my-4  space-x-8 ">
                {/* Left scrollable container */}
                <div className="h-screen w-3/4 space-y-3 overflow-y-auto  ">
                    {loading ? (
                        <div className="flex justify-center items-center">
                            <p className="text-gray-500">Loading...</p>
                        </div>
                    ) : posts.length === 0 ? (
                        <p className="text-gray-500 text-center py-4">No opportunities found. Try a different search.</p>
                    ) : (
                        posts.map((opportunity) => (
                            <React.Fragment key={opportunity.postId}>
                                <div className=" px-4 py-4 w-full space-y-3 bg-[#FFFFFF]">
                                    <div className="flex items-center w-full">
                                        <div className="flex items-center space-x-2">
                                            <Messages size={60} color="#0A3D91"  />
                                            <div className="space-y-2">
                                                <div className="font-pt text-lg text-[#222222]">{opportunity.postedBy}</div>
                                                <div className="font-pt text-sm text-[#3A3A3A]">{opportunity.userType}</div>
                                            </div>
                                        </div>
                                        <div className="ml-auto  text-sm text-right text-gray-500">5 hours ago</div>
                                        <Clock size={20} color="#0A3D91" className="mx-2" />
                                    </div>
                                    <div className='font-quicksand text-2xl font-semibold'>{opportunity.title}</div>
                                    <div className='font-pt'>{opportunity.description}</div>

                                </div>
                            </React.Fragment>
                        ))
                    )}
                </div>

                {/* Right static container */}
                <div className='flex-1 space-y-4'>
                    <div className="py-6 h-72   bg-white rounded-lg ">
                        <div className="pl-7 mb-4  text-2xl font-quicksand  font-semibold">Tops Pods to join</div>
                        <div className='space-y-4'>
                            <div className="pl-7 font-lato text-[#3A3A3A] text-sm">Design & UX</div>
                            <div className="pl-7 font-lato text-[#3A3A3A] text-sm">Design & UX</div>
                            <div className="pl-7 font-lato text-[#3A3A3A] text-sm">Design & UX</div>
                            <div className="pl-7 font-lato text-[#3A3A3A] text-sm">Design & UX</div>
                            <div className="pl-7 font-lato text-[#3A3A3A] text-sm">Design & UX</div>
                            <div className="pl-7 font-lato text-[#3A3A3A] text-sm">Design & UX</div>

                        </div>
                    </div>
                    <div className=" h-72   bg-white rounded-lg ">
                        <div className="pl-7 mb-4  text-2xl font-quicksand  font-semibold">Tops Pods to join</div>
                        <div className='space-y-4'>
                            <div className="pl-7 font-lato text-[#3A3A3A] text-sm">Design & UX</div>
                            <div className="pl-7 font-lato text-[#3A3A3A] text-sm">Design & UX</div>
                            <div className="pl-7 font-lato text-[#3A3A3A] text-sm">Design & UX</div>
                            <div className="pl-7 font-lato text-[#3A3A3A] text-sm">Design & UX</div>
                            <div className="pl-7 font-lato text-[#3A3A3A] text-sm">Design & UX</div>
                            <div className="pl-7 font-lato text-[#3A3A3A] text-sm">Design & UX</div>

                        </div>
                    </div>

                </div>
            </div>
        </div>

    )
}

export default Discussions
