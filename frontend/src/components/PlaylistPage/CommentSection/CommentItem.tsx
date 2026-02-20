import React, { useState } from "react";
import { Heart } from "lucide-react";
import type { CommentType } from "./CommentSection";

interface Props {
  comment: CommentType;
}

const CommentItem: React.FC<Props> = ({ comment }) => {
  const [likes, setLikes] = useState(comment.likes);
  const [liked, setLiked] = useState(false);

  const toggleLike = () => {
    setLiked(!liked);
    setLikes(liked ? likes - 1 : likes + 1);
  };

  return (
    <div className="flex gap-4">
      <img
        src={comment.avatar}
        className="w-10 h-10 rounded-full"
      />

      <div className="flex-1">
        <div className="flex items-center gap-3">
          <h4 className="font-semibold text-sm">
            {comment.author}
          </h4>
          <span className="text-xs text-neutral-500">
            {comment.time}
          </span>
        </div>

        <p className="text-sm mt-2 text-secondaryText">
          {comment.content}
        </p>

        <div className="flex items-center gap-4 mt-3 text-xs text-neutral-500">
          <button
            onClick={toggleLike}
            className={`flex items-center gap-1 ${
              liked ? "text-red-500" : ""
            }`}
          >
            <Heart size={14} />
            {likes}
          </button>

          <button className="hover:underline">
            Reply
          </button>
        </div>
      </div>
    </div>
  );
};

export default CommentItem;
