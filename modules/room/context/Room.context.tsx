import { socket } from "@/common/lib/socket";
import { useSetRoom, useSetUsers } from "@/common/recoil/room/room.hooks";
import { MotionValue, useMotionValue } from "framer-motion";
import { ReactChild, createContext, useEffect } from "react";

export const roomContext = createContext<{ x: MotionValue, y: MotionValue }>(null!);

const RoomContextProvider = ({ children }: { children: ReactChild }) => {
    const setRoom = useSetRoom();
    const{handleAddUser,handleRemoveUser} = useSetUsers();
     const x = useMotionValue(0);
    const y = useMotionValue(0);

    useEffect(() => {

        socket.on("room", (room, usersMovesToParse, usersToParse) => {
            const usersMoves = new Map<string, Move[]>(JSON.parse(usersMovesToParse));
            const users = new Map<string, string>(JSON.parse(usersToParse));

            setRoom((prev) => ({
                ...prev,
                users,
                usersMoves,
                movesWithoutUser: room.drawed
            }));
        });

        socket.on("new_user", (userId,username) => {
            handleAddUser(userId,username);
        })
        socket.on("user_disconnected", (userId) => {
            handleRemoveUser(userId);
        });


        return () => {
            socket.off("room");
            socket.off("new_user");
            socket.off("user_disconnected");
        };
    }, [handleAddUser,handleRemoveUser,setRoom]);

    return (
        <roomContext.Provider value={{ x, y }}>{children}</roomContext.Provider>
    );
};

export default RoomContextProvider;