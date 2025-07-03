"use client";

import { useRef, useState } from "react";

export default function CommentBox({
  onSubmit,
  prefill,
  buttonName = "Submit",
}) {
  const [text, setText] = useState(prefill || "");
  const [inputError, setInputError] = useState("");
  const textareaRef = useRef(null);

  function handleSubmit() {
    if (text.trim().length === 0) return;
    onSubmit(text.trim());
    setText("");
    setInputError("");
  }

  function handleInputChange(e) {
    const el = e.target;
    el.style.height = "auto"; 
    const scrollHeight = el.scrollHeight;
    const maxHeight = 300; 
    el.style.height = `${Math.min(scrollHeight, maxHeight)}px`;

    const currentText = e.target.value;

    if (currentText.length > 300) {
      setInputError("More than 300 characters!");
    } else {
      setInputError("");
      setText(currentText);
    }
  }

  const focusTextarea = () => {
    textareaRef.current?.focus();
  };

  return (
    <div className=" bg-white rounded-xl border-2 border-gray-300 ">
      <div className="flex flex-col items-stretch bg-gray-100 rounded-lg">
        <textarea
          ref={textareaRef}
          value={text}
          placeholder="share your throught"
          onChange={handleInputChange}
          className="w-full p-2 rounded placeholder:text-gray-400 break-words placeholder:text-sm resize-none overflow-y-auto outline-none text-sm text-gray-700"
          style={{ height: "auto" }}
          rows={1}
        />
        <div
          className=" rounded-b-xl w-full"
          onClick={(e) => {
            if (e.target.tagName.toLowerCase() !== "button") {
              focusTextarea();
            }
          }}
        >
          <div className="h-2 w-full blur-xs bg-gradient-to-t from-gray-100  via-gray-100 to-gray-100 "></div>
          <div className="flex flex-row justify-between w-full p-1">
            <div className="mr-5 text-xs text-red-400">{inputError}</div>
            <button
              onClick={handleSubmit}
              className="px-2 cursor-pointer text-white text-sm rounded-md py-1 bg-amber-600 inline-block"
            >
              {buttonName}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
