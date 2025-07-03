import { LikeRoadmap } from "@/actions/roadmaps";
import { useAuth } from "@/app/providers/AuthProvider";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export default function useUpvoteRoadmap() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const upvoteRoadmapMutation = useMutation({
    mutationFn: async ({ roadmapId, upvoterId }) =>
      await LikeRoadmap({
        roadmapId,
        upvoterId,
      }),

    onMutate: async ({ roadmapId, upvoterId }) => {
      // query key
      const roadmapKey = ["roadmap", roadmapId];
      // cancel ongoing query fetch
      await queryClient.cancelQueries({
        queryKey: roadmapKey,
      });

      // get old cache
      const previous = queryClient.getQueryData(roadmapKey);

      // update cache
      queryClient.setQueryData(roadmapKey, (roadmap) => {
        if (!roadmap || !upvoterId) return roadmap;

        return {
          ...roadmap,
          upvotes: roadmap.upvotes + 1,
          likers: [...roadmap.likers, upvoterId],
        };
      });

      return { previous };
    },

    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(
          ["roadmap", context.previous._id],
          context.previous
        );
      }
    },
  });

  return {
    upvoteRoadmap: upvoteRoadmapMutation.mutateAsync,
    isUpvoting: upvoteRoadmapMutation.isPending,
  };
}
