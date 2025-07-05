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
        className="border-b border-light-line rounded-t-lg dark:border-dark-line flex flex-row items-center gap-2 justify-start pl-3 "
      >
        <input
          type="checkbox"
          checked={isSelected}
          className="text-sm checked:bg-primary rounded-md select-none bg-light-fg dark:bg-dark-fg "
          id={value}
          value={value}
          name={value}
          onChange={() => handleCheckboxChange(value)}
        />
        <label className="select-none grow pr-3.5 py-2 text-sm" htmlFor={value}>
          {children}
        </label>
      </div>
    );
  else
    item = (
      <div
        key={value}
        className={`${
          isSelected && "bg-light-fg dark:bg-dark-fg "
        } text-sm hover:bg-light-fg hover:dark:bg-dark-fg px-2 py-1 rounded-sm select-none`}
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
    <div className="text-light-opacity dark:text-dark-opacity whitespace-nowrap bg-light-bg dark:bg-dark-bg shadow-md border border-light-fg dark:border-dark-fg  rounded-md flex flex-col overflow-hidden justify-start">
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
      <div
        ref={dropdownRef}
        className="relative cursor-pointer rounded-md bg-light-fg dark:bg-dark-fg px-2 py-1.5"
      >
        <div
          className="flex flex-row items-center text-icon text-light-icon dark:text-dark-icon gap-2"
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
