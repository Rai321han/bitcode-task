import { fetchInServer } from "@/libs/fetchInServer";
import { cookies } from "next/headers";

export async function getRoadmaps({ filter, sort }) {
  const params = new URLSearchParams();
  filter.forEach((f) => params.append("filter", f));
  sort.forEach((s) => params.append("sort", s));

  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;

  if (!accessToken) {
    return {
      error: true,
      message: "no token",
    };
  }

  try {
    const refreshToken = cookieStore.get("refreshToken")?.value;
    const res = await fetchInServer(
      `${
        process.env.NEXT_PUBLIC_BASE_API_URL
      }/api/roadmaps?${params.toString()}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Cookie: `refreshToken=${refreshToken}`, // due to server action
        },
        cache: "no-store",
      }
    );

    if (!res.ok) return null;
    const data = await res.json();

    return data.roadmaps;
  } catch (error) {
    console.error("Error fetching roadmaps:", error);
    return { error: true, message: error.message };
  }
}

export async function getRoadById({ id }) {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;
    if (!accessToken) return null;
    const refreshToken = cookieStore.get("refreshToken")?.value;
    const res = await fetchInServer(
      `${process.env.NEXT_PUBLIC_BASE_API_URL}/api/roadmaps/${id}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Cookie: `refreshToken=${refreshToken}`,
        },
        cache: "no-store",
      }
    );

    if (!res.ok) return null;
    const data = await res.json();

    return data.roadmap;
  } catch (error) {
    console.log("Error getting data", error.message);
  }
}
