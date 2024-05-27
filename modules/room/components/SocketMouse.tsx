import { useEffect, useState } from "react";
import { UseBoardPosition } from "../hooks/UseBoardPosition"
import { socket } from "@/common/lib/socket";
import { motion } from "framer-motion";
import { BsCursorFill } from "react-icons/bs";

export const SocketMouse = ({ socketId }: { socketId: string }) => {
    const boardPosition = UseBoardPosition();
    
    const [x, setX] = useState(boardPosition.x.get());
    const [y, setY] = useState(boardPosition.y.get());
    const [pos, setPos] = useState({ x: -1, y: -1 });

    useEffect(() => {
        socket.on("mouse_moved", (newX, newY, socketIdMoved) => {
            if (socketIdMoved === socketId) {
                setPos({ x: newX, y: newY });
            }
        });

        return () => {
            socket.off("mouse_moved");
        }
    }, [socketId]);

    useEffect(() => {
        const unsubsribe = boardPosition.x.on("change", setX);
        return unsubsribe;
    }, [boardPosition.x]);

    useEffect(() => {
        const unsubsribe = boardPosition.y.on("change", setY);
        return unsubsribe;
    }, [boardPosition.y]);
     
    return (
        <motion.div className={`absolute top-0 left-0 ${pos.x === -1 && "hidden"}`}
            animate={{ x: pos.x + x, y: pos.y + y }}
            transition={{duration : 0.3, ease : "linear"}}
        >
        <BsCursorFill className="-rotate-90" />
        </motion.div>
    )
}