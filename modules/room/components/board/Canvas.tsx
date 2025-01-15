import { CANVAS_SIZE } from "@/common/constants/canvasSize";
import { useViewPortSize } from "@/common/hooks/useViewPortSize";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useKeyPressEvent } from "react-use";
import { useDraw } from "../../hooks/useDraw";
import { useSocketDraw } from "../../hooks/useSocketDraw";
import { socket } from "@/common/lib/socket";
import Minimap from "./Minimap";
import { UseBoardPosition } from "../../hooks/UseBoardPosition";
import Background from "./Background";
import { useRefs } from "../../hooks/UseRefs";
import { useMovesHandlers } from "../../hooks/UseMovesHandlers";

const Canvas = () => {

  const { canvasRef, undoRef, bgRef } = useRefs();
  const { drawAllMoves, handleUndo } = useMovesHandlers();

  const [ctx, setCtx] = useState<CanvasRenderingContext2D>();
  const [dragging, setDragging] = useState(false);
  const [, setMovedMinimap] = useState(false);

  const { width, height } = useViewPortSize();
  const { x, y } = UseBoardPosition();

  useKeyPressEvent("Control", (e) => {
    if (e.ctrlKey && !dragging) {
      setDragging(true);
    }
  });

  const {
    handleDraw,
    handleEndDrawing,
    handleStartDrawing,
    drawing,
  } = useDraw(dragging, drawAllMoves);

  useSocketDraw(ctx, drawing);

  useEffect(() => {
    const newCtx = canvasRef.current?.getContext("2d");
    if (newCtx) setCtx(newCtx);

    const handleKeyUp = (e: KeyboardEvent) => {
      if (!e.ctrlKey && dragging) {
        setDragging(false);
      }
    };

    window.addEventListener("keyup", handleKeyUp);

    const undoBtn = undoRef.current;
    undoBtn?.addEventListener("click", handleUndo);

    return () => {
      window.removeEventListener("keyup", handleKeyUp);
      undoBtn?.removeEventListener("click", handleUndo)
    };
  }, [dragging, handleUndo, undoRef, canvasRef]);

  useEffect(() => {
    if (ctx) {
      socket.emit("joined_room");
    }
  }, [ctx]);


  return (
    <div className="relative h-full w-full overflow-hidden">
      <motion.canvas
        ref={canvasRef}
        width={CANVAS_SIZE.width}
        height={CANVAS_SIZE.height}
        className={`absolute top-0 z-10 ${dragging && "cursor-move"}`}
        style={{ x, y }}
        drag={dragging}
        dragConstraints={{
          left: -(CANVAS_SIZE.width - width),
          right: 0,
          top: -(CANVAS_SIZE.height - height),
          bottom: 0,
        }}
        dragElastic={0}
        dragTransition={{ power: 0, timeConstant: 0 }}
        onMouseDown={(e) => handleStartDrawing(e.clientX, e.clientY)}
        onMouseUp={handleEndDrawing}
        onMouseMove={(e) => {
          handleDraw(e.clientX, e.clientY);
        }}
        onTouchStart={(e) => {
          handleStartDrawing(
            e.changedTouches[0].clientX,
            e.changedTouches[0].clientY
          );
        }}
        onTouchEnd={handleEndDrawing}
        onTouchMove={(e) => {
          handleDraw(e.changedTouches[0].clientX, e.changedTouches[0].clientY);
        }}
      />
      <Background bgRef={bgRef} />
      <Minimap
        dragging={dragging}
        setMovedMinimap={setMovedMinimap}
      />
    </div>
  );
};

export default Canvas;
