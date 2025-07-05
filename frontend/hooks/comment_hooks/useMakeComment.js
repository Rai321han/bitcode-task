import { createComment } from "@/actions/comments";
import { useAuth } from "@/app/providers/AuthProvider";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export default function useMakeComment() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const commentMutation = useMutation({
    mutationFn: async ({ featureId, content, parentComment }) =>
      await createComment({
        commenterId: user.id,
        featureId,
        content,
        parentComment,
        commenterName: user.username,
      }),

    onMutate: async ({ featureId, content, parentComment, commenterName }) => {
      const parentCommentId = parentComment ? parentComment._id : null;
      const commentKey = parentCommentId
        ? ["comments", parentCommentId]
        : ["comments", featureId];

      const featureKey = ["feature", featureId];

      await queryClient.cancelQueries({
        queryKey: commentKey,
      });
      const previousComment = structuredClone(
        queryClient.getQueryData(commentKey)
      );
      const previousFeature = queryClient.getQueryData(featureKey);

      const tempId = crypto.randomUUID();

      const optimisticComment = {
        _id: tempId,
        commenterName,
        content,
        featureId,
        parentCommentId,
        commenterId: user.id,
        likes: 0,
        likers: [],
        chain: [],
        hasChild: false,
        isOptimistic: true,
        createdAt: new Date(),
      };

      if (parentCommentId) {
        const parentComment = queryClient.getQueryData([
          "comment",
          parentCommentId,
        ]);
        optimisticComment.chain = [...parentComment.chain, parentCommentId];
      }

      // updating comment cache
      queryClient.setQueryData(commentKey, (old = []) => {
        // Prevent duplicates by checking if the comment already exists

        if (old.some((c) => c._id === tempId)) return old;
        return [...old, optimisticComment];
      });

      // updating feature comment count cache
      queryClient.setQueryData(featureKey, (old) => {
        if (!old) return old;
        return {
          ...old,
          comments: old.comments + 1,
        };
      });

      if (parentCommentId) {
        queryClient.setQueryData(["comment", parentCommentId], (parent) => {
          if (parent) {
            return { ...parent, hasChild: true };
          }
          return parent;
        });
      }

      return {
        previousComment,
        previousFeature,
        featureKey,
        commentKey,
        optimisticComment,
      };
    },

    onError: (_err, _vars, context) => {
      if (context?.previousComment && context?.commentKey) {
        queryClient.setQueryData(context.commentKey, context.previousComment);
      }

      if (context?.previousFeature && context?.featureKey) {
        queryClient.setQueryData(context.featureKey, (old) => {
          return {
            ...old,
            comments: Math.max(0, old.comments - 1),
          };
        });
      }

      //todo - show toast
    },

    onSuccess: (savedComment, _vars, context) => {
      queryClient.setQueryData(context.commentKey, (old = []) =>
        old.map((c) =>
          c._id === context.optimisticComment._id ? savedComment : c
        )
      );
      queryClient.setQueryData(["comment", savedComment._id], savedComment);
    },
    onSettled: (_data, _error, { featureId, parentComment }) => {
      const parentCommentId = parentComment ? parentComment._id : null;
      const commentKey = parentCommentId
        ? ["comments", parentCommentId]
        : ["comments", featureId];

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
