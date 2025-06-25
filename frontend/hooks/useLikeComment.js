import { LikeComment } from "@/actions/comments";
import { useAuth } from "@/app/providers/AuthProvider";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export default function useLikeComment() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const likeMutation = useMutation({
    mutationFn: ({ commentId }) => LikeComment({ commentId, likerId: user.id }),
    onMutate: async ({ commentId }) => {
      await queryClient.cancelQueries({ queryKey: ["comment", commentId] });
      const previous = queryClient.getQueryData(["comment", commentId]);
      if (previous && !previous.likers.includes(user.id)) {
        queryClient.setQueryData(["comment", commentId], {
          ...previous,
          likes: previous.likes + 1,
          likers: [...previous.likers, user.id],
        });
      }

      return { previous };
    },

    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(
          ["comment", context.previous._id],
          context.previous
        );
      }
    },
    onSettled: ({ commentId }) => {
      queryClient.invalidateQueries({ queryKey: ["comment", commentId] });
    },
  });

  return {
    likeComment: (commentId) => likeMutation.mutate({ commentId }),
    isLiking: likeMutation.isPending,
  };
}
