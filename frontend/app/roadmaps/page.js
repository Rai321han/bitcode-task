"use client";
import Roadmap from "@/components/Roadmap";
import { IoFilterOutline } from "react-icons/io5";
import { BiSortAlt2 } from "react-icons/bi";
import { useState } from "react";
import {
  Dropdown,
  DropdownContainer,
  DropdownItem,
} from "@/components/Dropdown";
import useRoadmaps from "@/hooks/useRoadmaps";

const roadmapData = [
  {
    id: 1,
    feature: "User authentication",
    status: "In progress",
    upvotes: 5,
    comments: 2,
    milestones: [
      { title: "Identify auth approach", status: "incompleted" },
      { title: "Implement registration", status: "incompleted" },
      { title: "Implement login", status: "incompleted" },
      { title: "Test auth", status: "incompleted" },
    ],
  },
  {
    id: 2,
    feature: "Dark mode support",
    status: "Completed",
    upvotes: 23,
    comments: 4,
    milestones: [
      { title: "Design dark theme palette", status: "completed" },
      { title: "Implement theme toggle", status: "completed" },
      { title: "Persist user preference", status: "completed" },
    ],
  },
  {
    id: 3,
    feature: "Mobile responsiveness",
    status: "In progress",
    upvotes: 15,
    comments: 3,
    milestones: [
      { title: "Update layout for small screens", status: "completed" },
      { title: "Test on iOS/Android", status: "incompleted" },
      { title: "Bug fixes", status: "incompleted" },
    ],
  },
  {
    id: 4,
    feature: "Admin dashboard",
    status: "Planned",
    upvotes: 9,
    comments: 1,
    milestones: [
      { title: "Define admin features", status: "incompleted" },
      { title: "Design dashboard UI", status: "incompleted" },
      { title: "Implement user management", status: "incompleted" },
    ],
  },
  {
    id: 5,
    feature: "Notification system",
    status: "Planned",
    upvotes: 12,
    comments: 2,
    milestones: [
      { title: "Decide notification types", status: "incompleted" },
      { title: "Build backend API", status: "incompleted" },
      { title: "Display alerts in UI", status: "incompleted" },
    ],
  },
  {
    id: 6,
    feature: "Performance improvements",
    status: "Completed",
    upvotes: 30,
    comments: 7,
    milestones: [
      { title: "Lazy load components", status: "completed" },
      { title: "Optimize bundle size", status: "completed" },
      { title: "Improve API response time", status: "completed" },
    ],
  },
];

export default function RoadmapsPage() {
  const [sort, setSort] = useState("");
  const [filter, setFilter] = useState("");

  function handleSort(option) {
    setSort(option);
  }
  function handleFilter(option) {
    setFilter(option);
  }
  const { data, isLoading, isError } = useRoadmaps(filter, sort);

  return (
    <div className="mt-5 mx-16">
      <div className="flex flex-col gap-5">
        <div className="mb-5">
          <h1 className="text-2xl text-gray-500 font-extrabold capitalize">
            ROADMAPS
          </h1>
        </div>
        <div className="flex flex-row justify-end gap-4">
          <Dropdown
            icon={<IoFilterOutline />}
            title={"Filter"}
            onSelect={handleFilter}
          >
            <DropdownContainer>
              <DropdownItem value={"planned"}>Planned</DropdownItem>
              <DropdownItem value={"in-progress"}>In progress</DropdownItem>
              <DropdownItem value={"completed"}>Completed</DropdownItem>
            </DropdownContainer>
          </Dropdown>

          <Dropdown icon={<BiSortAlt2 />} title={"Sort"} onSelect={handleSort}>
            <DropdownContainer>
              <DropdownItem value={"highest-voted"}>Highest Voted</DropdownItem>
              <DropdownItem value={"lowest-voted"}>Lowest Voted</DropdownItem>
            </DropdownContainer>
          </Dropdown>
        </div>
        <div className="flex flex-row flex-wrap gap-3.5 bg-gray-100 rounded-lg p-5">
          {roadmapData.map((roadmap) => (
            <Roadmap key={roadmap.id} data={roadmap} />
          ))}
        </div>
      </div>
    </div>
  );
}
