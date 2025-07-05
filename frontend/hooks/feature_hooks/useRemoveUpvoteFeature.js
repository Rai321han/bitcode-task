import { UnlikeFeature } from "@/actions/features";

import { useMutation, useQueryClient } from "@tanstack/react-query";

export default function useRemoveUpvoteFeature() {
  const queryClient = useQueryClient();

  const removeUpvoteFeatureMutation = useMutation({
    mutationFn: async ({ featureId, upvoterId }) =>
      await UnlikeFeature({
        featureId,
        upvoterId,
      }),

    onMutate: async ({ featureId, upvoterId }) => {
      // query key
      const featureKey = ["feature", featureId];
      // cancel ongoing query fetch
      await queryClient.cancelQueries({
        queryKey: featureKey,
      });

      // get old cache
      const previous = queryClient.getQueryData(featureKey);

      // update cache
      queryClient.setQueryData(featureKey, (feature) => {
        if (!feature || !upvoterId) return feature;

        return {
          ...feature,
          upvotes: feature.upvotes - 1,
          likers: feature.likers.filter((u) => u !== upvoterId),
        };
      });

      return { previous };
    },

    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(
          ["feature", context.previous._id],
          context.previous
        );
      }
    },
  });

  return {
    removeUpvoteFeature: removeUpvoteFeatureMutation.mutateAsync,
    isUpvoting: removeUpvoteFeatureMutation.isPending,
  };
}
