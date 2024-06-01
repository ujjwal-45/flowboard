import { socket } from "@/common/lib/socket";
import { useSetRoomId } from "@/common/recoil/room";
import { useRouter } from "next/router";
import { FormEvent, useEffect, useState } from "react"

const Home = () => {
    const [roomId, setRoomId] = useState("");
    
    const router = useRouter();

    const setAtomRoomId = useSetRoomId();

    useEffect(() => {
        socket.on("created", (roomIdFromServer) => {
            setAtomRoomId(roomIdFromServer);
            router.push(roomIdFromServer);
        });

        socket.on("joined", (roomIdFromServer, falied) => {
            if (!falied) {
                setAtomRoomId(roomIdFromServer);
                router.push(roomIdFromServer);
            }
                
            else {
                console.log("failed to join the room");
            }
        });

        return () => {
            socket.off("created");
            socket.off("joined");
        }
    }, [router, setAtomRoomId]);

    const handleCreateRoom = () => {
        socket.emit("create_room");
    }

    const handleJoinRoom = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        socket.emit("join_room", roomId);
    }

    return (
        <div className="flex flex-col items-center">
            <h1 className="mt-20 text-[6rem] font-extrabold leading-tight ">FlowBoard</h1>
            <h3 className="text-xl">Real Time WhiteBoard</h3>

            <form className="mt-8 flex flex-col items-center gap-2" onSubmit={handleJoinRoom}>
                <label htmlFor="room-id" className="self-start font-bold leading-tight">
                    Enter room id
                </label>

                <input className="rounded-xl border p-5 py-1 outline-none"
                    id="room-id"
                    value={roomId}
                    placeholder="Room id..."
                    onChange={(e) => setRoomId(e.target.value)}
                />
                <button className="rounded-xl bg-slate-800 p-5 py-1 text-neutral-200 transition-all hover:scale-110 active:scale-100"
                    type="submit"
                >
                    Join Room
                </button>
            </form>

            <div className="mt-8 flex flex-col items-center gap-2">
                <h5 className="self-start font-bold leading-tight">Create new Room</h5>
                <button className="rounded-xl bg-slate-800 p-5 py-1 text-neutral-200 transition-all hover:scale-110 active:scale-100"
                    onClick={handleCreateRoom}
                >
                    Create Room
                </button>
            </div>

        </div>
    )
};

export default Home;
