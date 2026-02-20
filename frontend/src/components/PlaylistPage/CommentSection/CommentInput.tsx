import React, { useState } from "react";

interface Props {
  onSubmit: (text: string) => void;
}

const CommentInput: React.FC<Props> = ({ onSubmit }) => {
  const [text, setText] = useState("");

  const handleSubmit = () => {
    if (!text.trim()) return;
    onSubmit(text);
    setText("");
  };

  return (
    <div className="flex gap-4 mb-6">
      <img
        src="/avatar.jpg"
        className="w-10 h-10 rounded-full"
      />

      <div className="flex-1">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Share your thoughts on this playlist..."
          className="w-full rounded-xl border p-4 outline-none resize-none"
          rows={3}
        />

        <div className="flex justify-end mt-3">
          <button
            onClick={handleSubmit}
            className="bg-primaryText text-white px-6 py-2 rounded-full"
          >
            Post Comment
          </button>
        </div>
      </div>
    </div>
  );
};

export default CommentInput;
