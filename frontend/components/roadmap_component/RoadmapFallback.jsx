export function RoadmapCard() {
  return (
    <div className="hover:outline hover:outline-blue-300 p-4  gap-2 w-[350px] bg-white flex flex-col items-start shadow-2xl shadow-gray-200 min-h[450px] rounded-md">
      <div className="rounded-sm">
        <p className="text-gray-600 text-md w-[100px] h-[30px] animate-pulse"></p>
      </div>
      <div className="flex flex-row justify-between w-full">
        <div className="text-gray-400 text-sm h-[20px] animate-pulse"></div>
        <div className="flex flex-row gap-1 w-[100px] h-[20px] text-gray-500 animate-pulse"></div>
      </div>
      <div className="mt-3">
        <div className="flex py-0.5 items-center flex-row gap-2 border-t-1 border-gray-200">
          <div className="text-sm text-gray-500 truncate overflow-hidden w-[200px] h-[30px] animate-pulse"></div>
        </div>
      </div>
    </div>
  );
}

export default function RoadmapFallback() {
  return (
    <div className="flex flex-row flex-wrap gap-3.5 bg-[#f4f4f4] rounded-lg p-5 animate-pulse">
      <RoadmapCard />
      <RoadmapCard />
      <RoadmapCard />
      <RoadmapCard />
      <RoadmapCard />
      <RoadmapCard />
    </div>
  );
}
