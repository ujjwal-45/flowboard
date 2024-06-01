import { CANVAS_SIZE } from "@/common/constants/canvasSize";
import { useViewPortSize } from "@/common/hooks/useViewPortSize";
import { motion } from "framer-motion";
import { useRef, useState, useEffect } from "react"
import {useKeyPressEvent} from 'react-use'
import { useDraw, useSocketDraw } from "../hooks/Canvas.hooks";
import {socket} from "@/common/lib/socket"
import Minimap from "./Minimap";
import { UseBoardPosition } from "../hooks/UseBoardPosition";


const Canvas = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const smallCanvasRef = useRef<HTMLCanvasElement>(null);
    
    const [ctx, setCtx] = useState<CanvasRenderingContext2D>();
    const [dragging, setDragging] = useState(false);
    const [, setMovedMinimap] = useState(false);

    const { width, height } = useViewPortSize();

    useKeyPressEvent("Control", (e) => {
        if (e.ctrlKey && !dragging) {
            setDragging(true);
        }
    });

    // const x = useMotionValue(0);
    // const y = useMotionValue(0);

    const { x, y } = UseBoardPosition();

    const copyCanvasToSmall = () => {
        if (canvasRef.current && smallCanvasRef.current) {
            const smallCtx = smallCanvasRef.current.getContext("2d");
            if (smallCtx) {
                smallCtx.clearRect(0, 0, CANVAS_SIZE.width, CANVAS_SIZE.height);
                smallCtx.drawImage(canvasRef.current, 0, 0, CANVAS_SIZE.width, CANVAS_SIZE.height);
            }
        }
    };

    const { handleDraw, handleEndDrawing, handleStartDrawing,handleUndo, drawing } = useDraw(
        ctx, dragging , copyCanvasToSmall
    );

    useEffect(() => {
        const newCtx = canvasRef.current?.getContext("2d");
        if (newCtx) setCtx(newCtx);
        
        const handleKeyUp = (e: KeyboardEvent) => {
            if (!e.ctrlKey && dragging) {
                setDragging(false);
            }
        };

        window.addEventListener("keyup", handleKeyUp);

        return () => {
            window.removeEventListener("keyup", handleKeyUp);
        };

    }, [dragging])

    useSocketDraw(ctx, drawing, copyCanvasToSmall);
    
    return (
        <div className="relative h-full w-full overflow-hidden">
            <button className="absolute top-0 " onClick={handleUndo} >
                {/* Undo */}
            </button>
            <motion.canvas
                ref={canvasRef}
                width={CANVAS_SIZE.width}
                height={CANVAS_SIZE.height}
                className={`bg-neutral-200 ${dragging && "cursor-move"}`}
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
                onMouseMove={(e) => { handleDraw(e.clientX, e.clientY) }}
                onTouchStart={(e) => {
                    handleStartDrawing(e.changedTouches[0].clientX, e.changedTouches[0].clientY)
                }}
                onTouchEnd={handleEndDrawing}
                onTouchMove={(e) => {
                    handleDraw(e.changedTouches[0].clientX, e.changedTouches[0].clientY)
                }}
            />
            <Minimap
                ref={smallCanvasRef}
                dragging={dragging}
                setMovedMinimap={setMovedMinimap}
            />

            
        </div>
    )
    
};

export default Canvas;