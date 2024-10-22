import ColorPicker from "./ColorPicker";
import LineWidthPicker from "./LineWidthPicker";
import { IoMdColorFill } from "react-icons/io";

export const ToolBar = () => {
  return (
    <div
      className="absolute flex flex-col top-[50%] left-10 z-50 p-2 gap-5 items-center rounded-lg bg-slate-900 text-neutral-200"
      style={{ transform: "translateY(-50%)" }}
    >
      <ColorPicker />
      <LineWidthPicker />
      <button className="text-xl">
        <IoMdColorFill />
      </button>
      <button className="text-xl">
        <IoMdColorFill />
      </button>
      <button className="text-xl">
        <IoMdColorFill />
      </button>
      <button className="text-xl">
        <IoMdColorFill />
      </button>
    </div>
  );
};
