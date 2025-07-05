export function RoadmapCard() {
  return (
    <div className="hover:outline  p-4  gap-2 w-[350px] bg-light-bg dark:bg-dark-bg flex flex-col items-start  min-h[450px] rounded-md">
      <div className="rounded-sm">
        <p className=" w-[100px] h-[30px] animate-pulse"></p>
      </div>
      <div className="flex flex-row justify-between w-full">
        <div className=" h-[20px] animate-pulse"></div>
        <div className="flex flex-row gap-1 w-[100px] h-[20px]  animate-pulse"></div>
      </div>
      <div className="mt-3">
        <div className="flex py-0.5 items-center flex-row gap-2 border-t-1 border-light-line dark:border-dark-line">
          <div className="text-sm  truncate overflow-hidden w-[200px] h-[30px] animate-pulse"></div>
        </div>
      </div>
    </div>
  );
}

export default function RoadmapFallback() {
  return (
    <div className="flex flex-row flex-wrap gap-3.5 bg-light-fg dark:bg-dark-fg rounded-lg p-5 animate-pulse">
      <RoadmapCard />
      <RoadmapCard />
      <RoadmapCard />
      <RoadmapCard />
      <RoadmapCard />
      <RoadmapCard />
    </div>
  );
}
