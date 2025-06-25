import { cookies } from "next/headers";

export default async function getRoadById({ id }) {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;
    if (!accessToken) return null;
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_API_URL}/api/roadmaps/${id}`,

      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
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
