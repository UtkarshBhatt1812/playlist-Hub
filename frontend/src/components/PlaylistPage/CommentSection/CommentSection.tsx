import React, { useState } from "react";
import CommentInput from "./CommentInput";
import CommentList from "./CommentList";

export interface CommentType {
  id: number;
  author: string;
  avatar: string;
  content: string;
  time: string;
  likes: number;
}

const CommentSection: React.FC = () => {
  const [comments, setComments] = useState<CommentType[]>([
    {
      id: 1,
      author: "Marcus Chen",
      avatar: "/avatar1.jpg",
      content:
        "This is exactly what I needed for finals week! 🔥",
      time: "2 hours ago",
      likes: 24,
    },
  ]);

  const handleAddComment = (text: string) => {
    const newComment: CommentType = {
      id: Date.now(),
      author: "You",
      avatar: "/avatar.jpg",
      content: text,
      time: "Just now",
      likes: 0,
    };

    setComments([newComment, ...comments]);
  };

  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm">
      <h2 className="text-lg font-semibold mb-6">
        Community ({comments.length})
      </h2>

      <CommentInput onSubmit={handleAddComment} />
      <CommentList comments={comments} />
    </div>
  );
};

export default CommentSection;
