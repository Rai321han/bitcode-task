export async function getComments({ roadmapId, parentCommentId = null }) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_API_URL}/api/roadmaps/${roadmapId}/comments?parentCommentId=${parentCommentId}`,
      {
        credentials: "include",
      }
    );
    if (!res.ok) return null;
    const data = await res.json();

    return data.comments;
  } catch (error) {
    console.log("Error getting data", error.message);
    throw error;
  }
}
