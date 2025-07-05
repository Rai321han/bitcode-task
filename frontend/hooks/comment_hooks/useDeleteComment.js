import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteComment } from "@/actions/comments"; // your API call

function dfsNestedDelete(commentId, queryClient) {
  const replies = queryClient.getQueryData(["comments", commentId]);
  const hasChild = Array.isArray(replies) && replies.length > 0;

  let res = 1;
  if (hasChild) {
    for (const comment of replies) {
      res = res + dfsNestedDelete(comment._id, queryClient);
    }

    queryClient.removeQueries({
      queryKey: ["comments", commentId],
      exact: true,
    });
  }

  queryClient.removeQueries({ queryKey: ["comment", commentId], exact: true });
  return res;
}

export default function useDeleteComment() {
  const queryClient = useQueryClient();

  const deleteCommentMutation = useMutation({
    mutationFn: async ({ comment }) => await deleteComment({ comment }),

    onMutate: async ({ comment }) => {
      const featureKey = ["feature", comment.featureId];
      const parentCommentId = comment.parentCommentId;
      const commentKey = parentCommentId
        ? ["comments", parentCommentId]
        : ["comments", comment.featureId];

      await queryClient.cancelQueries({ queryKey: commentKey });

      const previousFeature = structuredClone(
        queryClient.getQueryData(featureKey)
      );

      const numOfDeletions = dfsNestedDelete(comment._id, queryClient);

      queryClient.setQueryData(featureKey, (old) => {
        if (!old) return old;
        return {
          ...old,
          comments: Math.max(0, old.comments - numOfDeletions),
        };
      });

      if (parentCommentId) {
        queryClient.setQueryData(["comments", parentCommentId], (old) => {
          if (!old) return old;
          return old.filter((c) => c._id !== comment._id);
        });

        const remainingReplies = queryClient.getQueryData([
          "comments",
          parentCommentId,
        ]);

        const stillHasChildren =
          Array.isArray(remainingReplies) && remainingReplies.length > 0;

        if (!stillHasChildren) {
          queryClient.setQueryData(["comment", parentCommentId], (old) => {
            return old ? { ...old, hasChild: false } : old;
          });
        }
      } else {
        queryClient.setQueryData(["comments", comment.featureId], (old) => {
          if (!old) return old;
          return old.filter((c) => c._id !== comment._id);
        });
      }

      return {
        previousFeature,
        commentKey,
        featureKey,
      };
    },
  });

  return {
    deleteComment: deleteCommentMutation.mutateAsync,
    isDeleting: deleteCommentMutation.isPending,
  };
}
