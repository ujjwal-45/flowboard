import { CANVAS_SIZE } from "@/common/constants/canvasSize";
import { useViewPortSize } from "@/common/hooks/useViewPortSize";
import { MotionValue, useMotionValue } from "framer-motion";
import { Dispatch, SetStateAction, forwardRef, useEffect, useRef } from "react";
import {motion} from 'framer-motion'
import { UseBoardPosition } from "../hooks/UseBoardPosition";

interface miniMapProps{
    dragging: boolean;
    setMovedMinimap: Dispatch<SetStateAction<boolean>>; 
}

const Minimap = forwardRef<HTMLCanvasElement, miniMapProps>(
    
    ({ dragging, setMovedMinimap }, ref) => {

    const { x, y } = UseBoardPosition();
    const containerRef = useRef<HTMLDivElement>(null)
    const { width, height } = useViewPortSize();
    const miniX = useMotionValue(0);
    const miniY = useMotionValue(0);

    useEffect(() => {
        miniX.on('change',(newX) => {
            if (!dragging) x.set(-newX * 10);
        });
        miniY.on('change',(newY) => {
            if (!dragging) y.set(-newY * 10);
        });

        return () => {
            miniX.clearListeners();
            miniY.clearListeners();
        }

    }, [dragging, miniX, miniY, x, y])

    return (
        <div className="absolute right-10 top-10 z-50 bg-neutral-100 rounded-lg " ref={containerRef}
        style={{width : CANVAS_SIZE.width / 10, height : CANVAS_SIZE.height / 10}} 
        >
            <canvas className="h-full w-full"
                ref={ref}
                width={CANVAS_SIZE.width}
                height={CANVAS_SIZE.height}

            />
            <motion.div
                drag={true}
                dragConstraints={containerRef}
                dragElastic={0}
                dragTransition={{ power: 0, timeConstant: 0 }}
                onDragStart={() => setMovedMinimap((prev) => !prev)}
                onDragEnd={() => setMovedMinimap((prev: boolean) => !prev)}
                className="absolute top-0 left-0 border-2 border-blue-500 rounded-lg"
                style={{ width: width / 10, height: height / 10, x: miniX, y: miniY }}
                animate={{ x: -x.get() / 10, y: -y.get() / 10 }}
                transition={{duration : 0}}
                
            >

            </motion.div>
        </div>
    )
});

Minimap.displayName = "Minimap";

export default Minimap;