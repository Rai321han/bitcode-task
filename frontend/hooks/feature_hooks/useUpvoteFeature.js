import { LikeFeature } from "@/actions/features";
import { useAuth } from "@/app/providers/AuthProvider";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export default function useUpvoteFeature() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const upvotefeatureMutation = useMutation({
    mutationFn: async ({ featureId, upvoterId }) =>
      await LikeFeature({
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
          upvotes: feature.upvotes + 1,
          likers: [...feature.likers, upvoterId],
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
    upvoteFeature: upvotefeatureMutation.mutateAsync,
    isUpvoting: upvotefeatureMutation.isPending,
  };
}
