import { editComment } from "@/actions/comments";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export default function useEditComment() {
  const queryClient = useQueryClient();

  const commentMutation = useMutation({
    mutationFn: async ({ comment, content }) =>
      await editComment({
        commentId: comment._id,
        content,
      }),

    onMutate: async ({ comment, content }) => {
      const commentKey = ["comment", comment._id];

      await queryClient.cancelQueries({
        queryKey: commentKey,
      });

      const previous = queryClient.getQueryData(commentKey);

      const optimisticComment = {
        ...comment,
        content,
        isOptimistic: true,
      };
      queryClient.setQueryData(commentKey, optimisticComment);

      //
      if (!comment.parentCommentId) {
        const commentsKey = ["comments", comment.roadmapId];
        queryClient.setQueryData(commentsKey, (old = []) =>
          old.map((c) =>
            c._id === optimisticComment._id ? optimisticComment : c
          )
        );
      }

      //
      if (comment.parentCommentId) {
        const commentsKey = ["comments", comment.parentCommentId];
        queryClient.setQueryData(commentsKey, (old = []) =>
          old.map((c) =>
            c._id === optimisticComment._id ? optimisticComment : c
          )
        );
      }

      return { previous, commentKey, optimisticComment };
    },

    onError: (_err, _vars, context) => {
      if (context?.previous && context?.commentKey) {
        queryClient.setQueryData(context.commentKey, context.previous);

        const comment = context.previous;
        if (comment?.roadmapId && !comment?.parentCommentId) {
          queryClient.setQueryData(["comments", comment.roadmapId], (old) =>
            Array.isArray(old)
              ? old.map((c) => (c._id === comment._id ? comment : c))
              : []
          );
        }

        if (comment?.parentCommentId) {
          queryClient.setQueryData(
            ["comments", comment.parentCommentId],
            (old) =>
              Array.isArray(old)
                ? old.map((c) => (c._id === comment._id ? comment : c))
                : []
          );
        }
      }
    },

    onSuccess: (savedComment, _vars, context) => {
      if (context?.commentKey) {
        queryClient.setQueryData(context.commentKey, savedComment);
      }

      if (!savedComment.parentCommentId) {
        const commentsKey = ["comments", savedComment.roadmapId];
        queryClient.setQueryData(commentsKey, (old = []) =>
          old.map((c) => (c._id === savedComment._id ? savedComment : c))
        );
      }

      if (savedComment.parentCommentId) {
        const commentsKey = ["comments", savedComment.parentCommentId];
        queryClient.setQueryData(commentsKey, (old = []) =>
          old.map((c) => (c._id === savedComment._id ? savedComment : c))
        );
      }
    },
    onSettled: (_data, _error, context) => {
      if (context?.commentKey) {
        queryClient.invalidateQueries({ queryKey: context.commentKey });
      }
    },
  });

  return {
    editComment: commentMutation.mutateAsync,
    isEditing: commentMutation.isPending,
  };
}
