import React from "react";
import CommentItem from "./CommentItem";
import { CommentType } from ".";

interface Props {
  comments: CommentType[];
}

const CommentList: React.FC<Props> = ({ comments }) => {
  return (
    <div className="flex flex-col gap-6">
      {comments.map((comment) => (
        <CommentItem key={comment.id} comment={comment} />
      ))}
    </div>
  );
};

export default CommentList;
