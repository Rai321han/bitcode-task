export default function Loading() {
  return (
    <div className="w-screen min-h-[90vh] flex flex-row justify-center p-5 md:p-10 ">
      <div className="grid w-full md:grid-cols-[2fr_1.5fr] grid-cols-1 grid-rows-2 gap-3 md:grid-rows-1  max-w-[1200px] ">
        <div className="flex flex-col gap-3 col-start-1 col-end-1 row-start-1 row-end-2">
          <div className="rounded-md  min-w-[300px] min-h-[400px] bg-gray-200 animate-pulse"></div>
          <div className="grow grid grid-rows-4 gap-2 rounded-md min-w-[300px] min-h-[200px] animate-pulse">
            <div className="bg-gray-200 rounded-md"></div>
            <div className="bg-gray-200 rounded-md"></div>
            <div className="bg-gray-200 rounded-md"></div>
            <div className="bg-gray-200 rounded-md"></div>
            <div className="bg-gray-200 rounded-md"></div>
          </div>
        </div>
        <div className="rounded-md bg-gray-200 animate-pulse col-span-1 row-start-2 row-end-3 md:col-start-2 md:col-end-3 md:row-start-1 md:row-end-2"></div>
      </div>
    </div>
  );
}
