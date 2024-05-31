import { socket } from "@/common/lib/socket";
import usersAtom, { useUserIds } from "@/common/recoil/users";
import { MotionValue, useMotionValue } from "framer-motion";
import { ReactChild, ReactNode, createContext, useEffect } from "react";
import { useSetRecoilState } from "recoil";

export const roomContext = createContext<{ x: MotionValue, y: MotionValue }>(null!);

const RoomContextProvider = ({ children }: { children: ReactChild }) => {
    const setUsers = useSetRecoilState(usersAtom);
    const usersIds = useUserIds();
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    useEffect(() => {
        socket.on("new_user", (newUsers) => {
            setUsers((prevUsers) => ({ ...prevUsers, [newUsers]: [] }));
        })
        socket.on("user_disconnected", (userId) => {
            setUsers((preUsers) => {
                const newUsers = { ...preUsers };
                delete newUsers[userId];
                return newUsers;
            })
        });


        return () => {
            socket.off("new_user");
            socket.off("user_disconnected");
        };
    }, [setUsers, usersIds]);

    return (
        <roomContext.Provider value={{ x, y }}>{children}</roomContext.Provider>
    );
};

export default RoomContextProvider;