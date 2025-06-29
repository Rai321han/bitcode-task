"use client";

import { useRef, useState } from "react";

export default function CommentBox({ onSubmit }) {
  const [text, setText] = useState("");
  const inputRef = useRef(null);

  function handleInputChange() {
    setText(inputRef.current.innerText);
  }

  function handleSubmit() {
    onSubmit(text);
    inputRef.current.innerText = "";
  }

  return (
    <div className=" bg-white rounded-xl border-2 border-gray-300 ">
      <div className="flex flex-col items-stretch bg-gray-100 rounded-lg">
        <div
          ref={inputRef}
          onInput={handleInputChange}
          role="textbox"
          placeholder="share your throughts..."
          aria-multiline
          contentEditable="true"
          className="overflow-y-scroll max-h-[300px] break-words block text-sm text-gray-700 h-fit px-4 pt-4 pb-2 outline-none  "
        />
        <div className="text-right rounded-b-xl  pr-2 pb-2   w-full">
          <div className="h-2 w-full blur-xs bg-gradient-to-t from-gray-100  via-gray-100 to-gray-100 "></div>
          <button
            onClick={handleSubmit}
            className="px-2 cursor-pointer text-white text-sm rounded-md py-1 bg-amber-600 inline-block"
          >
            Comment
          </button>
        </div>
      </div>
    </div>
  );
}
