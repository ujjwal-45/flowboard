import { useState } from "react";
import { COLORS_ARRAY } from "@/common/constants/colors";
import { socket } from "@/common/lib/socket";
import {
  useRoom,
  useSetRoom,
  useSetUsers,
} from "@/common/recoil/room/room.hooks";
import { MotionValue, useMotionValue } from "framer-motion";
import { ReactChild, RefObject, createContext, useEffect, useRef } from "react";
import { toast } from "react-toastify";

export const roomContext = createContext<{
  x: MotionValue;
  y: MotionValue;
  undoRef: RefObject<HTMLButtonElement>;
  canvasRef: RefObject<HTMLCanvasElement>;
  bgRef: RefObject<HTMLCanvasElement>;
  minimapRef: RefObject<HTMLCanvasElement>;
  moveImage: string;
  setMoveImage: (base64: string) => void;
}>(null!);

const RoomContextProvider = ({ children }: { children: ReactChild }) => {
  const setRoom = useSetRoom();
  const { users } = useRoom();
  const { handleAddUser, handleRemoveUser } = useSetUsers();
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const undoRef = useRef<HTMLButtonElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const bgRef = useRef<HTMLCanvasElement>(null);
  const minimapRef = useRef<HTMLCanvasElement>(null);

  const [moveImage, setMoveImage] = useState("");

  useEffect(() => {
    socket.on("room", (room, usersMovesToParse, usersToParse) => {
      const usersMoves = new Map<string, Move[]>(JSON.parse(usersMovesToParse));
      const usersParsed = new Map<string, string>(JSON.parse(usersToParse));

      const newUsers = new Map<string, User>();

      usersParsed.forEach((name, id) => {
        if (id === socket.id) return;

        const index = [...usersParsed.keys()].indexOf(id);

        const color = COLORS_ARRAY[index % COLORS_ARRAY.length];

        newUsers.set(id, {
          name,
          color,
        });
      });

      setRoom((prev) => ({
        ...prev,
        users: newUsers,
        usersMoves,
        movesWithoutUser: room.drawed,
      }));
    });

    socket.on("new_user", (userId, username) => {
      toast(`${username} joined the room`, {
        position: "top-right",
        theme: "colored",
      });
      handleAddUser(userId, username);
    });
      socket.on("user_disconnected", (userId) => {
        toast(`${users.get(userId)?.name || "Anonymous"} exited the room`, {
          position: "bottom-right",
          theme: "colored",
        });
      handleRemoveUser(userId);
    });

    return () => {
      socket.off("room");
      socket.off("new_user");
      socket.off("user_disconnected");
    };
  }, [handleAddUser, handleRemoveUser, setRoom, users]);

  return (
    <roomContext.Provider
      value={{
        x,
        y,
        undoRef,
        canvasRef,
        bgRef,
        minimapRef,
        moveImage,
        setMoveImage,
      }}
    >
      {children}
    </roomContext.Provider>
  );
};

export default RoomContextProvider;
