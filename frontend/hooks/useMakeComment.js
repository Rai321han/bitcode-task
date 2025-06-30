import { createComment } from "@/actions/comments";
import { useAuth } from "@/app/providers/AuthProvider";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export default function useMakeComment() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const commentMutation = useMutation({
    mutationFn: async ({ roadmapId, content, parentCommentId }) =>
      await createComment({
        commenterId: user.id,
        roadmapId,
        content,
        parentCommentId,
        commenterName: user.username,
      }),

    onMutate: async ({
      roadmapId,
      content,
      parentCommentId,
      commenterName,
    }) => {
      const commentKey = parentCommentId
        ? ["comments", parentCommentId]
        : ["comments", roadmapId];

      await queryClient.cancelQueries({
        queryKey: ["comments", commentKey],
      });
      const previous = queryClient.getQueryData(commentKey);

      const tempId = crypto.randomUUID();

      const optimisticComment = {
        _id: tempId,
        commenterName,
        content,
        roadmapId,
        parentCommentId,
        likes: 0,
        likers: [],
        hasChild: false,
        isOptimistic: true,
      };
      queryClient.setQueryData(commentKey, (old = []) => {
        // Prevent duplicates by checking if the comment already exists
        if (old.some((c) => c._id === tempId)) return old;
        return [...old, optimisticComment];
      });

      if (parentCommentId) {
        queryClient.setQueryData(["comment", parentCommentId], (parent) => {
          if (parent) {
            return { ...parent, hasChild: true };
          }
          return parent;
        });
      }

      return { previous, commentKey, optimisticComment };
    },

    onError: (_err, _vars, context) => {
      if (context?.previous && context?.commentKey) {
        queryClient.setQueryData(context.commentKey, context.previous);
      }
    },

    onSuccess: (savedComment, _vars, context) => {
      queryClient.setQueryData(context.commentKey, (old = []) =>
        old.map((c) =>
          c._id === context.optimisticComment._id ? savedComment : c
        )
      );
      queryClient.setQueryData(["comment", savedComment._id], savedComment);
    },
    onSettled: (_data, _error, { roadmapId, parentCommentId }) => {
      const commentKey = parentCommentId
        ? ["comments", parentCommentId]
        : ["comments", roadmapId];

      // Only invalidate if no socket update has occurred
      const currentData = queryClient.getQueryData(commentKey);
      if (currentData && !currentData.some((c) => c._id === _data?._id)) {
        queryClient.invalidateQueries({ queryKey: commentKey });
      }
    },
  });

  return {
    makeComment: commentMutation.mutateAsync,
    isCommenting: commentMutation.isPending,
  };
}
