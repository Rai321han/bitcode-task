"use client";
import { BiComment, BiUpvote } from "react-icons/bi";
import { getRoadById } from "@/actions/roadmaps";
import Badge from "@/components/Badge";
import { debounce } from "lodash";
import CommentSection from "@/components/comment_component/CommentSection";
import MiletoneDetail from "@/components/roadmap_component/MiletoneDetail";
import { useQuery } from "@tanstack/react-query";
import { use } from "react";
import Link from "next/link";
import useSocketRoadmap from "@/hooks/socket_hooks/useSocketRoadmap";
import useUpvoteRoadmap from "@/hooks/roadmap_hooks/useUpvoteRoadmap";
import { useAuth } from "@/app/providers/AuthProvider";
import useRemoveUpvoteRoadmap from "@/hooks/roadmap_hooks/useRemoveUpvoteRoadmap";

export default function RoadmapDetailsPage({ params }) {
  const pageParams = use(params);
  const { user } = useAuth();
  const roadmapId = pageParams.id;
  const socket = useSocketRoadmap(roadmapId);
  const { upvoteRoadmap } = useUpvoteRoadmap();
  const { removeUpvoteRoadmap } = useRemoveUpvoteRoadmap();

  const { data: roadmap } = useQuery({
    queryKey: ["roadmap", roadmapId],
    queryFn: async () => await getRoadById({ id: roadmapId }),
    refetchOnWindowFocus: false,
  });

  const option = {
    day: "numeric",
    month: "short",
    year: "numeric",
  };
  let creationDate = "";
  let milestones = [];

  if (roadmap) {
    const { createdAt } = roadmap;
    creationDate = new Date(createdAt).toLocaleDateString("en-US", option);

    milestones = roadmap.milestones;
  }

  if (!roadmap) return;

  const hasVoted = roadmap.likers.includes(user.id);

  let totalComments = roadmap.comments;

  const handleUpvote = debounce(() => {
    if (hasVoted) {
      removeUpvoteRoadmap(
        {
          roadmapId,
          upvoterId: user.id,
        },
        {
          onSuccess: ({ roadmapId, upvoterId }) => {
            socket.emit("remove_upvote_roadmap", {
              roadmapId,
              upvoterId,
            });
          },
        }
      );
    } else {
      upvoteRoadmap(
        {
          roadmapId,
          upvoterId: user.id,
        },
        {
          onSuccess: ({ roadmapId, upvoterId }) => {
            socket.emit("upvote_roadmap", {
              roadmapId,
              upvoterId,
            });
          },
        }
      );
    }
  }, 200);

  return (
    <>
      <div className="px-2 pt-5 flex flex-col gap-3 items-center justify-center">
        <div className="flex flex-col lg:grid lg:grid-cols-[3fr_2fr] grid-rows-2 gap-10 max-w-[1000px] lg:max-w-[1200px]">
          <div className="lg:col-span-1 lg:row-start-1 lg:row-end-2 p-5 border border-gray-300 rounded-md w-full flex flex-col gap-5">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-5 sm:justify-between w-full">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-600">
                {roadmap.feature}
              </h1>
              <div className="inline-block">
                <Badge type={roadmap.status} />
              </div>
            </div>
            <div className="border-l-3 sm:border-l-4 border-gray-200 pl-2 sm:pl-4 w-full">
              <p className="text-gray-500 text-sm w-full leading-[1.3rem]">
                User authentication is a fundamental aspect of modern web
                applications, providing a secure mechanism for verifying the
                identity of users and controlling access to sensitive features
                and data. This process typically begins with a registration
                system, where new users can create an account by providing
                essential information such as a username, email address, and
                password.
              </p>
            </div>
            <div className="flex flex-row justify-between text-xs text-gray-400 italic">
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
            <div className="w-full rounded-sm  justify-between gap-3 ">
              <div className="grid grid-cols-[1fr_2fr_1fr] justify-between w-full">
                <button
                  onClick={handleUpvote}
                  className="hover:bg-gray-50 cursor-pointer flex flex-row items-center gap-1 border-1 border-gray-300 p-3 rounded-l-md"
                >
                  <BiUpvote
                    className={`${
                      hasVoted ? "fill-amber-500" : "fill-gray-500"
                    }`}
                  />
                  <p
                    className={`${
                      hasVoted ? "text-amber-500" : "text-gray-500"
                    }`}
                  >
                    {roadmap.upvotes}
                  </p>
                </button>
                <Link
                  href="#comment"
                  className="hover:bg-gray-50 cursor-pointer text-center font-semibold text-gray-600 border-1 border-gray-300 p-3 "
                >
                  Comments
                </Link>
                <button className="hover:bg-gray-50 cursor-pointer flex flex-row items-center gap-1 border-1 border-gray-300 p-3 rounded-r-md">
                  <BiComment className="fill-gray-500" />
                  <p className="text-gray-500">{totalComments}</p>
                </button>
              </div>
            </div>
            <div className="">
              {/* <Suspense fallback={<LoadingCommentSection />}> */}
              <CommentSection roadmap={roadmap} socket={socket} />
              {/* </Suspense> */}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
