import { VscLoading } from "react-icons/vsc";
export default function loading() {
  return (
    <div className="text-center w-[100vw] h-[100vh] flex flex-row items-center justify-center">
      <VscLoading className="w-[100px] h-[100px] animate-spin fill-amber-600" />
    </div>
  );
}
