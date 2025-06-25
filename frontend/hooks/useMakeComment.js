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
      const previous = queryClient.getQueryData(["comments", commentKey]);

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
      };
      queryClient.setQueryData(["comments", commentKey], (old = []) => [
        optimisticComment,
        ...old,
      ]);

      return { previous, commentKey };
    },

    onError: (_err, _vars, context) => {
      if (context?.previous && context?.commentKey) {
        queryClient.setQueryData(context.commentKey, context.previous);
      }
    },
    onSettled: (_data, _error, { roadmapId, parentCommentId }) => {
      const commentKey = parentCommentId
        ? ["comments", parentCommentId]
        : ["comments", roadmapId];

      queryClient.invalidateQueries({ queryKey: commentKey });
    },
  });

  return {
    makeComment: ({ roadmapId, content, parentCommentId }) =>
      commentMutation.mutate({
        roadmapId,
        content,
        parentCommentId,
      }),
    isCommenting: commentMutation.isPending,
  };
}
