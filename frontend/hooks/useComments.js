import { getComments } from "@/actions/comments";
import { useQuery } from "@tanstack/react-query";

export default function useComments(roadmapId) {
  const {
    data: comments = [],
    status,
    isError,
  } = useQuery({
    queryKey: ["comments", roadmapId],
    queryFn: () => getComments({ roadmapId, parentCommentId: null }),
    retry: 2,
    enabled: !!roadmapId,
  });

  return {
    comments,
    status,
    isError,
  };
}
