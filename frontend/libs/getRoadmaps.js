import { cookies } from "next/headers";

export default async function getRoadmaps({ filter, sort }) {
  const params = new URLSearchParams();
  filter.forEach((f) => params.append("filter", f));
  sort.forEach((s) => params.append("sort", s));

  const cookie = cookies();
  const accessToken = cookie.get("accessToken")?.value;

  if (!accessToken) {
    return {
      error: true,
      message: "no token",
    };
  }

  try {
    const res = await fetch(
      `${
        process.env.NEXT_PUBLIC_BASE_API_URL
      }/api/roadmaps?${params.toString()}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        cache: "no-store",
      }
    );

    if (!res.ok) return null;
    const data = await res.json();

    return data.roadmaps;
  } catch (error) {
    console.error("getRoadmaps error:", error);
    return null;
  }
}
