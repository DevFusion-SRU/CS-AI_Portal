import React, { useState } from "react";
import { Messages, Clock } from "iconsax-react";
import Replycard from "./Replycard";

const CommentsCard = ({ comment }) => {
  const [showReplies, setShowReplies] = useState(false);

  return (
    <div className="px-4 py-4 w-full mt-2 space-y-3 bg-[#FFF] shadow-md rounded-lg">
      {/* Comment Header */}
      <div className="flex items-center w-full">
        <div className="flex items-center space-x-2">
          <Messages size={60} color="#0A3D91" />
          <div className="space-y-1">
            {/* Username and Role */}
            <div className="font-pt text-lg text-[#222222]">
              {comment.firstName} {comment.lastName}
            </div>
            <div className="font-pt text-sm text-[#3A3A3A]">
              {comment.userType}
            </div>
          </div>
        </div>
        {/* Date */}
        <div className="ml-auto text-sm text-gray-500">
          {new Date(comment.createdAt).toLocaleDateString()}
        </div>
        <Clock size={20} color="#0A3D91" className="mx-2" />
      </div>

      {/* Comment Text */}
      <div className="font-pt">{comment.text}</div>

      {/* Replies Button */}
      {comment.replies && comment.replies.length > 0 && (
        <button
          className="text-blue-600 mt-2"
          onClick={() => setShowReplies(!showReplies)}
        >
          {showReplies ? "Hide Replies" : `View ${comment.replies.length} Replies`}
        </button>
      )}

      {/* Replies Section */}
      {showReplies && <Replycard key={comment.commentId} commentId={comment.commentId} />}

    </div>
  );
};

export default CommentsCard;
