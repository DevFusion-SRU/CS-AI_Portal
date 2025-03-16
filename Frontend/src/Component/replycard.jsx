import React, { useEffect, useState } from "react";
import axios from "axios";
import { Messages, Clock } from "iconsax-react";
import { useAuth } from "../Context/AuthContext";

const Replycard = ({ commentId }) => {
  const [loading, setLoading] = useState(true);
  const [replies, setReplies] = useState([]);
  const { BASE_URL } = useAuth();

  // Fetch replies based on commentId
  const fetchReplies = async () => {
    try {
      const url = `${BASE_URL}forums/replies/${commentId}`;
      const response = await axios.get(url);
      console.log("Replies Data:", response.data);

      if (response.data.success) {
        setReplies(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching replies:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReplies();
  }, [commentId]);

  if (loading) return <div className="text-gray-400 text-sm ml-4">Loading replies...</div>;
  if (replies.length === 0) return <div className="text-gray-400 text-sm ml-4">No replies yet</div>;

  return (
    <div className="mt-2 space-y-3">
      {replies.map((reply) => (
        <div key={reply.replyId} className="px-4 py-4 w-full ml-4 space-y-3 bg-[#FFF] shadow-md rounded-lg">
          {/* Reply Header */}
          <div className="flex items-center w-full">
            <div className="flex items-center space-x-2">
              <Messages size={40} color="#0A3D91" />
              <div className="space-y-1">
                <div className="font-pt text-lg text-[#222222]">
                  {reply.firstName} {reply.lastName}
                </div>
                <div className="font-pt text-sm text-[#3A3A3A]">{reply.userType}</div>
              </div>
            </div>
            <div className="ml-auto text-sm text-gray-500">
              {new Date(reply.createdAt).toLocaleDateString()}
            </div>
            <Clock size={20} color="#0A3D91" className="mx-2" />
          </div>

          {/* Reply Content */}
          <div className="font-pt">{reply.text}</div>
        </div>
      ))}
    </div>
  );
};

export default Replycard;
