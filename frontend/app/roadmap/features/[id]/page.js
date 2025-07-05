"use client";
import { BiComment, BiUpvote } from "react-icons/bi";
import { getFeatureById } from "@/actions/features";
import Badge from "@/components/Badge";
import { debounce } from "lodash";
import CommentSection from "@/components/comment_component/CommentSection";
import MiletoneDetail from "@/components/feature_component/MiletoneDetail";
import { useQuery } from "@tanstack/react-query";
import { use } from "react";
import Link from "next/link";
import { useAuth } from "@/app/providers/AuthProvider";
import useSocketFeature from "@/hooks/socket_hooks/useSocketFeature";
import useUpvoteFeature from "@/hooks/feature_hooks/useUpvoteFeature";
import useRemoveUpvoteFeature from "@/hooks/feature_hooks/useRemoveUpvoteFeature";

export default function FeatureDetailsPage({ params }) {
  const pageParams = use(params);
  const { user } = useAuth();
  const featureId = pageParams.id;
  const socket = useSocketFeature(featureId);
  const { upvoteFeature } = useUpvoteFeature();
  const { removeUpvoteFeature } = useRemoveUpvoteFeature();

  const { data: feature } = useQuery({
    queryKey: ["feature", featureId],
    queryFn: async () => await getFeatureById({ id: featureId }),
    refetchOnWindowFocus: false,
  });

  const option = {
    day: "numeric",
    month: "short",
    year: "numeric",
  };
  let creationDate = "";
  let milestones = [];

  if (feature) {
    const { createdAt } = feature;
    creationDate = new Date(createdAt).toLocaleDateString("en-US", option);

    milestones = feature.milestones;
  }

  if (!feature) return;

  const hasVoted = feature.likers.includes(user.id);

  let totalComments = feature.comments;

  const handleUpvote = debounce(() => {
    if (hasVoted) {
      removeUpvoteFeature(
        {
          featureId,
          upvoterId: user.id,
        },
        {
          onSuccess: ({ featureId, upvoterId }) => {
            socket.emit("remove_upvote_feature", {
              featureId,
              upvoterId,
            });
          },
        }
      );
    } else {
      upvoteFeature(
        {
          featureId,
          upvoterId: user.id,
        },
        {
          onSuccess: ({ featureId, upvoterId }) => {
            socket.emit("upvote_feature", {
              featureId,
              upvoterId,
            });
          },
        }
      );
    }
  }, 200);

  return (
    <>
      <div className="p-10 md:p-20 flex flex-col gap-3 items-center justify-center bg-light-bg dark:bg-dark-bg">
        <div className="flex flex-col lg:grid lg:grid-cols-[3fr_2fr] grid-rows-2 gap-10 max-w-[1000px] lg:max-w-[1200px]">
          <div className="lg:col-span-1 lg:row-start-1 lg:row-end-2 p-5 bg-light-fg dark:bg-dark-fg border border-light-line dark:border-dark-line rounded-md w-full flex flex-col gap-5">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-5 sm:justify-between w-full">
              <h1 className="text-xl sm:text-2xl font-bold text-light-title dark:text-dark-title">
                {feature.feature}
              </h1>
              <div className="inline-block">
                <Badge type={feature.status} />
              </div>
            </div>
            <div className="border-l-3 sm:border-l-4 border-gray-200 pl-2 sm:pl-4 w-full">
              <p className="text-light-body dark:text-dark-body text-sm w-full leading-[1.3rem]">
                {feature.description}
              </p>
            </div>
            <div className="mt-auto text-xs text-light-opacity dark:text-dark-opacity italic">
              <div>
                <p>Created:</p>
                <p>{creationDate}</p>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-2 w-full lg:col-span-1 lg:row-start-2 lg:row-end-3 pl-3">
            <MiletoneDetail milestones={milestones} />
          </div>
          <div className="lg:row-start-1 lg:row-end-3 lg:col-start-2 lg:col-end-3">
            <div className="w-full rounded-sm  justify-between gap-3 mb-5">
              <div className="grid grid-cols-[1fr_2fr_1fr] justify-between w-full">
                <button
                  onClick={handleUpvote}
                  className="hover:bg-light-hover dark:hover:bg-dark-hover  transition-all duration-100 bg-light-fg dark:bg-dark-fg cursor-pointer flex flex-row items-center gap-1 border-r-1 border-light-line dark:border-dark-line p-3 rounded-l-md"
                >
                  <BiUpvote
                    className={`${
                      hasVoted
                        ? "fill-amber-500"
                        : "fill-light-icon dark:fill-dark-icon"
                    }`}
                  />
                  <p
                    className={`${
                      hasVoted
                        ? "text-amber-500"
                        : "text-light-icon dark:fill-dark-icon"
                    }`}
                  >
                    {feature.upvotes}
                  </p>
                </button>
                <Link
                  href="#comment"
                  className="hover:bg-light-hover dark:hover:bg-dark-hover transition-all duration-100 bg-light-fg dark:bg-dark-fg  cursor-pointer text-center font-semibold text-light-opacity dark:text-dark-opacity  p-3 "
                >
                  Comments
                </Link>
                <button className="hover:bg-light-hover dark:hover:bg-dark-hover transition-all duration-100 bg-light-fg dark:bg-dark-fg  cursor-pointer flex flex-row items-center gap-1 border-l-1 border-light-line dark:border-dark-line p-3 rounded-r-md">
                  <BiComment className="fill-light-icon dark:fill-dark-icon" />
                  <p className="text-light-icon dark:fill-dark-icon">
                    {totalComments}
                  </p>
                </button>
              </div>
            </div>
            <div className="">
              {/* <Suspense fallback={<LoadingCommentSection />}> */}
              <CommentSection feature={feature} socket={socket} />
              {/* </Suspense> */}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
