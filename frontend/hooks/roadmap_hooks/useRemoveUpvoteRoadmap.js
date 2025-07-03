import { UnlikeRoadmap } from "@/actions/roadmaps";

import { useMutation, useQueryClient } from "@tanstack/react-query";

export default function useRemoveUpvoteRoadmap() {
  const queryClient = useQueryClient();

  const removeUpvoteRoadmapMutation = useMutation({
    mutationFn: async ({ roadmapId, upvoterId }) =>
      await UnlikeRoadmap({
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
          upvotes: roadmap.upvotes - 1,
          likers: roadmap.likers.filter((u) => u !== upvoterId),
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
    removeUpvoteRoadmap: removeUpvoteRoadmapMutation.mutateAsync,
    isUpvoting: removeUpvoteRoadmapMutation.isPending,
  };
}
