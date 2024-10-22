import { socket } from "@/common/lib/socket";
import  UserMouse  from "./UserMouse";
import { useRoom } from "@/common/recoil/room";

export const MouseRenderer = () => {
    
    const room = useRoom();

    return (
        <>
            {[...room.users.keys()].map((userId) => {
                if (userId === socket.id) return null;
                return <UserMouse userId={userId}
                    key={userId}
                    username={room.users.get(userId) || "Anonymous"}
                />
            })}
        </>
    );
};