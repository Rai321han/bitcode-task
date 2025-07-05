"use client";

import { Dropdown, DropdownContainer, DropdownItem } from "./Dropdown";
import { IoFilterOutline } from "react-icons/io5";
import { BiSortAlt2 } from "react-icons/bi";
import { useRouter, useSearchParams } from "next/navigation";
export default function FilterSort({ filter, sort }) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const updateParams = (key, values) => {
    const params = new URLSearchParams(searchParams.toString());
    if (values.length > 0) {
      params.set(key, values.join(","));
    } else params.delete(key);

    router.replace(`/roadmap?${params.toString()}`);
  };
  return (
    <>
      <Dropdown
        icon={<IoFilterOutline />}
        title={"Filter"}
        selected={filter}
        setSelect={(option) => updateParams("filter", option)}
        type="checkbox"
      >
        <DropdownContainer>
          <DropdownItem value={"planned"}>Planned</DropdownItem>
          <DropdownItem value={"in-progress"}>In progress</DropdownItem>
          <DropdownItem value={"completed"}>Completed</DropdownItem>
        </DropdownContainer>
      </Dropdown>

      {/* sorting */}
      <Dropdown
        icon={<BiSortAlt2 />}
        title={"Sort"}
        selected={sort}
        setSelect={(option) => updateParams("sort", option)}
      >
        <DropdownContainer>
          <DropdownItem value={"highest-voted"}>Highest Voted</DropdownItem>
          <DropdownItem value={"lowest-voted"}>Lowest Voted</DropdownItem>
        </DropdownContainer>
      </Dropdown>
    </>
  );
}
