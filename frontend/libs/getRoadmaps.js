// import { cookies } from "next/headers";

export default async function getRoadmaps({ filter, sort }) {
  const params = new URLSearchParams();
  filter.forEach((f) => params.append("filter", f));
  sort.forEach((s) => params.append("sort", s));

  try {
    const res = await fetch(
      `${
        process.env.NEXT_PUBLIC_BASE_API_URL
      }/api/roadmaps?${params.toString()}`,
      {
        credentials: "include", // send cookies to backend
        cache: "no-store",
      }
    );

    if (!res.ok) return null;

    return res.json();
  } catch (error) {
    console.error("getRoadmaps error:", error);
    return null;
  }
}
