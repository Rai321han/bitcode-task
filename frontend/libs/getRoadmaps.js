import { cookies } from "next/headers";

export default async function getRoadmaps({ filter, sort }) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;

  if (!accessToken) return null;

  const params = new URLSearchParams();
  filter.forEach((f) => params.append("filter", f));
  sort.forEach((s) => params.append("sort", s));

  try {
    const res = await fetch(
      `${process.env.BASE_API_URL}/api/roadmaps?${params.toString()}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
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
