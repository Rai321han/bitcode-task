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
    res.status(500).json({
      message: "error encountered",
    });
  }
}

export async function getCommentById({ commentId }) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_API_URL}/api/comment/${commentId}`,
      {
        credentials: "include",
      }
    );
    if (!res.ok) return null;
    const data = await res.json();
    return data.comment;
  } catch (error) {
    console.log("Error getting data", error.message);
   
  }
}

export async function LikeComment({ commentId, likerId }) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_API_URL}/api/comments/${commentId}/like`,
      {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ likerId }),
      }
    );

    if (res.status === 204)
      return {
        message: "liked",
      };

    if (res.status === 500)
      return {
        message: "like failed",
      };
  } catch (error) {
    console.log("Error updating like", error);
    return {
      message: "request error",
    };
  }
}

export async function UnlikeComment({ commentId, unlikerId }) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_API_URL}/api/comments/${commentId}/unlike`,
      {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ unlikerId }),
      }
    );

    if (res.status === 204)
      return {
        message: "unliked",
      };

    if (res.status === 500)
      return {
        message: "unlike failed",
      };
  } catch (error) {
    console.log("Error updating unlike", error);
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
  parentCommentId,
}) {
  try {
    // content:
    // roadmapId:
    // commenterName:
    // parentCommentId:
    // hasChild:
    // likes:
    // likers:
    const res = await fetch(
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
          parentCommentId: parentCommentId || null,
        }),
      }
    );

    if (res.status === 500)
      return {
        message: "failed to save comment",
      };

    const data = await res.json();
    if (res.ok) {
      return {
        comment: data.comment,
      };
    }
  } catch (error) {
    console.log("Error saving comment", error);
    return {
      message: "request error",
    };
  }
}
