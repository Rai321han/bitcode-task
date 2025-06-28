import { getRoadById } from "@/actions/roadmaps";
import Badge from "@/components/Badge";

import CommentSection from "@/components/CommentSection";
import LoadingCommentSection from "@/components/LoadingCommentSection";
import MiletoneDetail from "@/components/MiletoneDetail";
import { Suspense } from "react";

export default async function RoadmapDetailsPage({ params }) {
  const pageParams = await params;
  const roadmapId = pageParams.id;

  const roadmap = await getRoadById({ id: roadmapId });

  const option = {
    day: "numeric",
    month: "short",
    year: "numeric",
  };
  let creationDate = "";
  let lastModified = "";
  let milestones = [];

  if (roadmap) {
    const { createdAt, updatedAt } = roadmap;
    creationDate = new Date(createdAt).toLocaleDateString("en-US", option);
    lastModified = new Date(updatedAt).toLocaleDateString("en-US", option);
    milestones = roadmap.milestones;
  }

  if (!roadmap) return;

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
              <div>
                <p>Last modified:</p>
                <p>{lastModified}</p>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-2 w-full lg:col-span-1 lg:row-start-2 lg:row-end-3 pl-3">
            <MiletoneDetail milestones={milestones} />
          </div>
          <div className="lg:col-start-2 lg:col-end-3 lg:row-span-2">
            <Suspense fallback={<LoadingCommentSection />}>
              <CommentSection roadmap={roadmap} />
            </Suspense>
          </div>
        </div>
      </div>
    </>
  );
}
