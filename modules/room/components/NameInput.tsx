import { socket } from "@/common/lib/socket";
import { useSetRoomId } from "@/common/recoil/room"
import { useRouter } from "next/router";
import { FormEvent, useEffect, useState } from "react";


const NameInput = () => {
    const setRoomId = useSetRoomId();
    const [name, setName] = useState("");

    const router = useRouter();
    const roomId = (router.query.roomId || "").toString();

    useEffect(() => {
        if (!roomId) return;

        socket.emit("check_room", roomId);

        socket.on("room_exist", (exists) => {
            console.log("Room exists", exists);

            if (!exists) {
                router.push("/");
            }
        });

        return () => {
            socket.off("room_exist");
        }
    }, [roomId, router]);
    
    useEffect(() => {
        const handleJoined = (roomIdFromServer: string, failed?: boolean) => {
            if (failed) {
                router.push("/");
            } else {
                setRoomId(roomIdFromServer);
            }
        };
        socket.on("joined", handleJoined);

        return () => {
            socket.off("joined", handleJoined);
        };
    }, [router, setRoomId]);

    const handleJoinRoom = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        socket.emit("join_room", roomId, name);
    };

    return (
        <form className="flex flex-col items-center" onSubmit={handleJoinRoom}>
            
            <h1 className="font-bold mt-24 text-extra leading-tight">FlowBoard</h1>
            <h3 className="text-2xl">Realtime Whiteboard</h3>
            <div className="mt-10 mb-3 flex flex-col gap-2">
                <label className="self-start font-bold leading-tight">
                    enter your name
                </label>
                <input className="rounded-xl py-1 px-5 border"
                    id="room-id"
                    placeholder="username..."
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                >
                </input>

            </div>

            <button
                className="rounded-xl bg-slate-800 p-5 py-1 text-neutral-200 transition-all hover:scale-110 active:scale-100"
                type="submit"
            >
                enter Room
            </button>
        </form>
    )
};

export default NameInput