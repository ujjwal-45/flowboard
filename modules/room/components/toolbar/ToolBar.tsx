import { RefObject } from "react";
import { useRefs } from "../../hooks/UseRefs";
import ColorPicker from "./ColorPicker";
import Eraser from "./Eraser";
import LineWidthPicker from "./LineWidthPicker";
import { IoMdColorFill } from "react-icons/io";
import { FaUndoAlt } from "react-icons/fa";
import ShapeSelector from "./ShapeSelector";
import { CANVAS_SIZE } from "@/common/constants/canvasSize";
import { BsDownload } from "react-icons/bs";
import ImageChooser from "./ImageChooser";

export const ToolBar = () => {

  const { canvasRef, undoRef, bgRef } = useRefs();

  const handleDownload = () => {
    const canvas = document.createElement("canvas");
    canvas.height = CANVAS_SIZE.height
    canvas.width = CANVAS_SIZE.width

    const tempCtx = canvas.getContext("2d")

    if (tempCtx && canvasRef.current && bgRef.current) {
      tempCtx.drawImage(bgRef.current, 0, 0);
      tempCtx.drawImage(canvasRef.current, 0, 0)
    }

    const link = document.createElement("a");
    link.href = canvas.toDataURL("image/png")
    link.download = "canvas.png"
    link.click()
  }

  return (
    <div
      className="absolute flex flex-col top-[50%] left-10 z-50 p-2 gap-5 items-center rounded-lg bg-white border-2 border-black text-neutral-200"
      style={{ transform: "translateY(-50%)" }}
    >
      <button className="text-xl text-black" ref={undoRef}>
        <FaUndoAlt />
      </button>
      <ColorPicker />
      <LineWidthPicker />
      <ShapeSelector />
      <Eraser />
      <ImageChooser />
      <button className="text-xl text-black">
        <IoMdColorFill />
      </button>
      {/* <button className="text-xl text-black">
        <IoMdColorFill />
      </button>
      <button className="text-xl text-black">
        <IoMdColorFill />
      </button>
      <button className="text-xl text-black">
        <IoMdColorFill />
      </button> */}
      <button className="text-xl text-black" onClick={handleDownload}>
        <BsDownload />
      </button>
    </div>
  );
};
