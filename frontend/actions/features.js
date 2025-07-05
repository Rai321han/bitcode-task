import { fetchInClient } from "@/libs/fetchInClient";

export async function getFeatures({ filter, sort }) {
  const params = new URLSearchParams();
  filter.forEach((f) => params.append("filter", f));
  sort.forEach((s) => params.append("sort", s));

  try {
    const res = await fetchInClient(
      `${
        process.env.NEXT_PUBLIC_BASE_API_URL
      }/api/roadmap?${params.toString()}`,
      {
        cache: "no-store",
      }
    );

    if (!res || !res.ok) return null;
    const data = await res.json();

    return data.features;
  } catch (error) {
    console.error("Error fetching features:", error);
    return { error: true, message: error.message };
  }
}

export async function getFeatureById({ id }) {
  try {
    const res = await fetchInClient(
      `${process.env.NEXT_PUBLIC_BASE_API_URL}/api/roadmap/features/${id}`,
      {
        cache: "no-store",
      }
    );

    if (!res.ok) return null;
    const data = await res.json();

    return data.feature;
  } catch (error) {
    console.log("Error getting data", error.message);
  }
}

export async function LikeFeature({ featureId, upvoterId }) {
  try {
    const res = await fetchInClient(
      `${process.env.NEXT_PUBLIC_BASE_API_URL}/api/roadmap/features/${featureId}/like`,
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
      throw new Error(errorBody.message || "Failed to like feature");
    }

    if (res && res.ok) {
      return {
        featureId,
        upvoterId,
      };
    }
  } catch (error) {
    console.log("Error updating feature like", error);
    return {
      message: "request error",
    };
  }
}

export async function UnlikeFeature({ featureId, upvoterId }) {
  try {
    const res = await fetchInClient(
      `${process.env.NEXT_PUBLIC_BASE_API_URL}/api/roadmap/features/${featureId}/unlike`,
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
        featureId,
        upvoterId,
      };
    }
  } catch (error) {
    console.log("Error updating feature upvote", error);
    return {
      message: "request error",
    };
  }
}
