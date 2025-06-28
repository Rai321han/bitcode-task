export default function LoadingCommentSection() {
  return (
    <>
      <>
        <div className="w-full mt-10 md:mt-0 rounded-sm  justify-between gap-3 ">
          <div className="grid grid-cols-[1fr_2fr_1fr] justify-between w-full p-3 animate-pulse"></div>
        </div>
        <div className="relative w-full flex flex-col gap-3 mb-5">
          <div className="border-t-2 border-t-gray-400 mt-3"></div>
          <div className="h-[70vh] flex flex-col w-full">
            <div
              className="px-2 [&::-webkit-scrollbar]:w-1
  [&::-webkit-scrollbar-track]:bg-white
  [&::-webkit-scrollbar-thumb]:bg-gray-200 w-full pb-5 flex flex-col gap-3 rounded-md lg:max-w-[500px]  overflow-scroll overflow-x-auto"
            >
              <div className="p-5 w-full h-[100px] animate-pulse rounded-md bg-gray-200"></div>
              <div className="p-5 w-full h-[100px] animate-pulse rounded-md bg-gray-200"></div>
              <div className="p-5 w-full h-[100px] animate-pulse rounded-md bg-gray-200"></div>
              <div className="p-5 w-full h-[100px] animate-pulse rounded-md bg-gray-200"></div>
              <div className="p-5 w-full h-[100px] animate-pulse rounded-md bg-gray-200"></div>
            </div>
            <div
              // ref={commentBoxRef}
              className="w-full rounded-xl"
            >
              <div className="p-2 w-full h-[250px] animate-pulse rounded-md bg-gray-200"></div>
            </div>
          </div>
        </div>
      </>
    </>
  );
}
