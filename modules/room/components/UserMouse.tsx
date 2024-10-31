import { useEffect, useState } from "react";
import { UseBoardPosition } from "../hooks/UseBoardPosition"
import { socket } from "@/common/lib/socket";
import { motion } from "framer-motion";
import { BsCursorFill } from "react-icons/bs";
import { useRoom } from "@/common/recoil/room";

const UserMouse = ({ userId }: { userId: string }) => {
    const boardPosition = UseBoardPosition();
    const { users } = useRoom();
    const [x, setX] = useState(boardPosition.x.get());
    const [y, setY] = useState(boardPosition.y.get());
    const [pos, setPos] = useState({ x: -1, y: -1 });

    useEffect(() => {
        socket.on("mouse_moved", (newX: number, newY: number, socketIdMoved: string) => {
            if (socketIdMoved === userId) {
                setPos({ x: newX, y: newY });
            }
        });

        return () => {
            socket.off("mouse_moved");
        }
    }, [userId]);

    useEffect(() => {
        const unsubsribe = boardPosition.x.on("change", setX);
        return unsubsribe;
    }, [boardPosition.x]);

    useEffect(() => {
        const unsubsribe = boardPosition.y.on("change", setY);
        return unsubsribe;
    }, [boardPosition.y]);
     
    return (
        <motion.div className={`absolute top-0 left-0 text-emerald-600 ${pos.x === -1 && "hidden"} pointer-events-none `}
            animate={{ x: pos.x + x, y: pos.y + y }}
            transition={{ duration: 0.1, ease: "linear" }}
        >
            <BsCursorFill className="-rotate-90" />
            <p className="ml-2">{ users.get(userId)?.name || "Anonymous"}</p>
        </motion.div>
    )
};

export default UserMouse;