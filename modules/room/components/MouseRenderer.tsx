import { socket } from "@/common/lib/socket";
import { useEffect, useState } from "react"
import { SocketMouse } from "./SocketMouse";

export const MouseRenderer = () => {
    const [mouses, setMouses] = useState<string[]>([]);

    console.log(mouses);

    useEffect(() => {
        socket.on("users_in_room", (socketIds) => {
            const allUsers = socketIds.filter((socketId) => socketId !== socket.id);
            setMouses(allUsers);
        });
    });

    return (
        <>
            {mouses.map((socketId) => {
                <SocketMouse socketId={socketId} key={socketId} />
            })}
        </>
    );
};