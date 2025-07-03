import { fetchInClient } from "@/libs/fetchInClient";

export async function getRoadmaps({ filter, sort }) {
  const params = new URLSearchParams();
  filter.forEach((f) => params.append("filter", f));
  sort.forEach((s) => params.append("sort", s));

  try {
    const res = await fetchInClient(
      `${
        process.env.NEXT_PUBLIC_BASE_API_URL
      }/api/roadmaps?${params.toString()}`,
      {
        cache: "no-store",
      }
    );

    if (!res || !res.ok) return null;
    const data = await res.json();

    return data.roadmaps;
  } catch (error) {
    console.error("Error fetching roadmaps:", error);
    return { error: true, message: error.message };
  }
}

export async function getRoadById({ id }) {
  try {
    const res = await fetchInClient(
      `${process.env.NEXT_PUBLIC_BASE_API_URL}/api/roadmaps/${id}`,
      {
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

export async function LikeRoadmap({ roadmapId, upvoterId }) {
  try {
    const res = await fetchInClient(
      `${process.env.NEXT_PUBLIC_BASE_API_URL}/api/roadmaps/${roadmapId}/like`,
      {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ upvoterId }),
      }
    );

    if (!res.ok) {
      const errorBody = await res.json().catch(() => ({}));
      throw new Error(errorBody.message || "Failed to like roadmap");
    }

    if (res && res.ok) {
      return {
        roadmapId,
        upvoterId,
      };
    }
  } catch (error) {
    console.log("Error updating roadmap like", error);
    return {
      message: "request error",
    };
  }
}

export async function UnlikeRoadmap({ roadmapId, upvoterId }) {
  try {
    const res = await fetchInClient(
      `${process.env.NEXT_PUBLIC_BASE_API_URL}/api/roadmaps/${roadmapId}/unlike`,
      {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ upvoterId }),
      }
    );

    if (!res.ok) {
      const errorBody = await res.json().catch(() => ({}));
      throw new Error(errorBody.message || "Failed to remove upvote");
    }

    if (res && res.ok) {
      return {
        roadmapId,
        upvoterId,
      };
    }
  } catch (error) {
    console.log("Error updating roadmap upvote", error);
    return {
      message: "request error",
    };
  }
}
