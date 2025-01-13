import { useEffect, useState } from "react";
import { UseBoardPosition } from "../../hooks/UseBoardPosition";
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
  const [msg, setMsg] = useState("");

  useEffect(() => {
    socket.on(
      "mouse_moved",
      (newX: number, newY: number, socketIdMoved: string) => {
        if (socketIdMoved === userId) {
          setPos({ x: newX, y: newY });
        }
      }
    );

    const handleMsg = (msgUserId: string, newMsg: string) => {
      if (msgUserId == userId) {
        setMsg(newMsg);

        setTimeout(() => {
          setMsg("");
        }, 3000)
      }
    };

    socket.on("new_msg", handleMsg);

    return () => {
      socket.off("mouse_moved");
      socket.off("new_msg", handleMsg);
    };
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
    <motion.div
      className={`absolute top-0 left-0 text-emerald-600 ${
        pos.x === -1 && "hidden"
      } pointer-events-none `}
      animate={{ x: pos.x + x, y: pos.y + y }}
      transition={{ duration: 0.1, ease: "linear" }}
    >
      <BsCursorFill className="-rotate-90" />
      {msg && (
        <p className="absolute top-full left-5 max-w-[15rem] overflow-hidden text-ellipsis rounded-md
        bg-zinc-900 p-1 x-3 text-white
        ">
          {msg}
        </p>
      )}
      <p className="ml-2">{users.get(userId)?.name || "Anonymous"}</p>
    </motion.div>
  );
};

export default UserMouse;
