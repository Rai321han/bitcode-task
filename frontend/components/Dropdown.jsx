"use client";
import { createContext, useContext, useEffect, useRef, useState } from "react";

export const DropdownContext = createContext();

export function useDropdown() {
  return useContext(DropdownContext);
}

export function DropdownItem({ children, value }) {
  const { handleChange, selected } = useDropdown();
  return (
    <li
      className={`${
        selected === value && "bg-gray-200"
      } text-sm hover:bg-gray-200 px-2 py-1 rounded-sm select-none`}
      data-value={value}
      onClick={(e) => handleChange(e.target.dataset.value)}
    >
      {children}
    </li>
  );
}

export function DropdownContainer({ children }) {
  return (
    <ul className="p-2 text-gray-500 whitespace-nowrap bg-white shadow-md border border-gray-200 rounded-md flex flex-col gap-1">
      {children}
    </ul>
  );
}

export function Dropdown({ children, icon, title, onSelect }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState("");
  const dropdownRef = useRef(null);

  function close() {
    setIsOpen(false);
  }

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target))
        close();
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleChange(newValue) {
    if (selected === newValue) {
      setSelected("");
      onSelect("");
    } else {
      setSelected(newValue);
      onSelect(newValue);
    }
    close();
  }

  function toggle() {
    setIsOpen((prev) => !prev);
  }

  return (
    <DropdownContext.Provider value={{ close, handleChange, selected }}>
      <div ref={dropdownRef} className="relative cursor-pointer">
        <div
          className="flex flex-row items-center text-gray-500 gap-2"
          onClick={toggle}
        >
          <div>{icon}</div>
          <div className="select-none">{title}</div>
        </div>
        {isOpen && <div className="absolute top-7 right-0">{children}</div>}
      </div>
    </DropdownContext.Provider>
  );
}
