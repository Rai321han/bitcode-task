export default function Footer() {
  return (
    <footer className="w-full items-center border-t-1 border-t-grayline py-5 px-6 sm:px-10 lg:px-20 lg:py-14 bg-gray-100 grid grid-cols-1 lg:grid-cols-3 grid-rows-3 lg:grid-rows-1 ">
      <ul className="flex flex-row gap-3 col-span-1 row-start-1 row-end-2 lg:col-start-1 lg:col-end-2 lg:justify-start justify-center lg:row-span-1">
        <li className="text-xs sm:text-sm text-normal-text tracking-wide">About</li>
        <li className="text-xs sm:text-sm text-normal-text tracking-wide">Contact</li>
        <li className="text-xs sm:text-sm text-normal-text tracking-wide">Privacy</li>
        <li className="text-xs sm:text-sm text-normal-text tracking-wide">Terms</li>
      </ul>
      <div className=" lg:col-start-2 lg:col-end-3 col-span-1 text-center row-start-3 row-end-4 lg:row-span-1">
        <p className="text-xs sm:text-sm text-normal-text tracking-wide">
          All rights reserved by Raihan@2025
        </p>
      </div>
      <ul className="flex flex-row gap-3 col-span-1 lg:col-start-3 lg:col-end-4 lg:justify-end justify-center row-start-2 row-end-3 lg:row-span-1">
        <li className="text-xs sm:text-sm text-normal-text tracking-wide">Facebook</li>
        <li className="text-xs sm:text-sm text-normal-text tracking-wide">LinkedIn</li>
        <li className="text-xs sm:text-sm text-normal-text tracking-wide">Instagram</li>
        <li className="text-xs sm:text-sm text-normal-text tracking-wide">Twitter</li>
      </ul>
    </footer>
  );
}
