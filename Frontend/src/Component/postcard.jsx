import React from "react";
import { useNavigate } from "react-router-dom";
import { Messages, Clock } from "iconsax-react";

const PostCard = ({ opportunity }) => {

    const navigate = useNavigate();

    const handleClick = () => {
        navigate(`/discussions/${opportunity.postId}`); // Use 'discussionpods' for consistency
    };
    return (
        <div onClick={handleClick} className="px-4 py-4 w-full mt-2 space-y-3 bg-[#FFF] shadow-md rounded-lg">
            <div className="flex items-center w-full">
                <div className="flex items-center space-x-2">
                    <Messages size={60} color="#0A3D91" />
                    <div className="space-y-2">
                        <div className="font-pt text-lg text-[#222222]">{opportunity.postedBy}</div>
                        <div className="font-pt text-sm text-[#3A3A3A]">{opportunity.userType}</div>
                    </div>
                </div>
                <div className="ml-auto text-sm text-right text-gray-500">
                    {new Date(opportunity.createdAt).toLocaleString()}
                </div>
                <Clock size={20} color="#0A3D91" className="mx-2" />
            </div>
            <div className="font-quicksand text-2xl font-semibold">{opportunity.title}</div>
            <div className="font-pt">{opportunity.description}</div>
            
        </div>
    );
};

export default PostCard;
