import { fetchInClient } from "@/libs/fetchInClient";

export async function getComments({ roadmapId, parentCommentId = null }) {
  try {
    const res = await fetchInClient(
      `${process.env.NEXT_PUBLIC_BASE_API_URL}/api/roadmaps/${roadmapId}/comments?parentCommentId=${parentCommentId}`,
      {
        credentials: "include",
        cache: "no-store",
      }
    );
    if (!res) {
      throw new Error("Network error");
    }
    if (!res.ok) {
      throw new Error(`Failed to fetch comments: ${res.status}`);
    }
    const data = await res.json();
    return data.comments || [];
  } catch (error) {
    throw new Error(error);
  }
}

export async function getCommentById({ commentId }) {
  try {
    const res = await fetchInClient(
      `${process.env.NEXT_PUBLIC_BASE_API_URL}/api/comment/${commentId}`,
      {
        credentials: "include",
        cache: "no-store",
      }
    );
    if (!res) {
      throw new Error("Network error");
    }

    if (!res.ok) {
      throw new Error(`Failed to fetch comment: ${res.status}`);
    }

    const data = await res.json();
    return data.comment || null;
  } catch (error) {
    throw new Error(error);
  }
}

export async function LikeComment({ commentId, likerId }) {
  try {
    const res = await fetchInClient(
      `${process.env.NEXT_PUBLIC_BASE_API_URL}/api/comments/${commentId}/like`,
      {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ likerId }),
      }
    );
    if (!res.ok) {
      const errorBody = await res.json().catch(() => ({}));
      throw new Error(errorBody.message || "Failed to like comment");
    }

    if (res && res.ok) {
      return {
        commentId,
        likerId,
      };
    }
  } catch (error) {
    throw new Error(error);
  }
}

export async function UnlikeComment({ commentId, unlikerId }) {
  try {
    const res = await fetchInClient(
      `${process.env.NEXT_PUBLIC_BASE_API_URL}/api/comments/${commentId}/unlike`,
      {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ unlikerId }),
      }
    );

    if (!res.ok) {
      const errorBody = await res.json().catch(() => ({}));
      throw new Error(errorBody.message || "Failed to unlike comment");
    }

    if (res && res.ok) {
      return {
        commentId,
        unlikerId,
      };
    }
  } catch (error) {
    console.log("Error updating comment like", error);
    return {
      message: "request error",
    };
  }
}

export async function createComment({
  content,
  roadmapId,
  commenterId,
  commenterName,
  parentComment,
}) {
  try {
    const res = await fetchInClient(
      `${process.env.NEXT_PUBLIC_BASE_API_URL}/api/${roadmapId}/comment`,
      {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content,
          commenterId,
          commenterName,
          parentComment: parentComment || null,
        }),
      }
    );

    if (res.status === 500) {
      console.log(res.status);
      return {
        message: "failed to save comment",
      };
    }

    const data = await res.json();
    if (res.ok) {
      return data.comment;
    }
  } catch (error) {
    throw new Error(error);
  }
}

export async function editComment({ content, commentId }) {
  try {
    const res = await fetchInClient(
      `${process.env.NEXT_PUBLIC_BASE_API_URL}/api/comments/${commentId}`,
      {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content,
        }),
      }
    );

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || "Failed to edit comment");
    }

    const data = await res.json();
    return data.comment;
  } catch (error) {
    throw new Error(error);
  }
}

export async function deleteComment({ comment }) {
  try {
    const res = await fetchInClient(
      `${process.env.NEXT_PUBLIC_BASE_API_URL}/api/comments`,
      {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ comment }),
      }
    );

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || "Failed to delete comment");
    }

    const data = await res.json();
    return data.comment;
  } catch (error) {
    throw new Error(error);
  }
}
