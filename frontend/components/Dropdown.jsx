"use client";
import { createContext, useContext, useEffect, useRef, useState } from "react";

export const DropdownContext = createContext();

export function useDropdown() {
  return useContext(DropdownContext);
}

export function DropdownItem({ children, value }) {
  const { handleCheckboxChange, handleSortChange, type, selected } =
    useDropdown();

  const isSelected =
    type === "checkbox" ? selected.includes(value) : selected[0] === value;
  let item;
  if (type === "checkbox")
    item = (
      <div
        key={value}
        className="flex flex-row items-center gap-2 justify-start"
      >
        <input
          type="checkbox"
          checked={isSelected}
          className="text-sm hover:bg-gray-200 px-2 py-1 rounded-sm select-none"
          id={value}
          value={value}
          name={value}
          onChange={() => handleCheckboxChange(value)}
        />
        <label className="select-none" htmlFor={value}>
          {children}
        </label>
      </div>
    );
  else
    item = (
      <div
        key={value}
        className={`${
          isSelected && "bg-gray-200 "
        } text-sm hover:bg-gray-200 px-2 py-1 rounded-sm select-none`}
        data-value={value}
        onClick={(e) => handleSortChange(e.target.dataset.value)}
      >
        {children}
      </div>
    );
  return item;
}

export function DropdownContainer({ children }) {
  return (
    <div className="p-2 text-gray-500 whitespace-nowrap bg-white shadow-md border border-gray-200 rounded-md flex flex-col gap-1 justify-start">
      {children}
    </div>
  );
}

export function Dropdown({ children, icon, title, setSelect, selected, type }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const close = () => setIsOpen(false);
  const toggle = () => setIsOpen((prev) => !prev);

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target))
        close();
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleCheckboxChange(newValue) {
    if (selected.includes(newValue)) {
      const prevSelections = [...selected];
      const updatedSelections = prevSelections.filter(
        (select) => select !== newValue
      );
      setSelect(updatedSelections);
    } else setSelect([...selected, newValue]);
  }

  function handleSortChange(newValue) {
    setSelect(selected[0] === newValue ? [] : [newValue]);
    close();
  }

  return (
    <DropdownContext.Provider
      value={{ close, handleSortChange, type, handleCheckboxChange, selected }}
    >
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
