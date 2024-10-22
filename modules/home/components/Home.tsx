import { socket } from "@/common/lib/socket";
import { useModal } from "@/common/recoil/modal";
import { useSetRoomId } from "@/common/recoil/room";
import { useRouter } from "next/router";
import { FormEvent, useEffect, useState } from "react"
import NotFound from "../modals/NotFound";

const Home = () => {
    
    const [roomId, setRoomId] = useState("");

    const [username, setUsername] = useState("");
    
    const router = useRouter();

    const setAtomRoomId = useSetRoomId();

    const { openModal } = useModal();

    useEffect(() => {
        socket.on("created", (roomIdFromServer) => {
            setAtomRoomId(roomIdFromServer);
            router.push(roomIdFromServer);
        });

        

        const handleJoinedRoom = (roomIdFromServer: string, failed?: boolean) => {
            if (!failed) {
                setAtomRoomId(roomIdFromServer);
                router.push(roomIdFromServer);
            }     
            else {
                openModal(<NotFound id={roomId} />);
            }
        }

        socket.on("joined", handleJoinedRoom);
        

        return () => {
            socket.off("created");
            socket.off("joined",handleJoinedRoom);
        }

    },[openModal,roomId,router, setAtomRoomId]);
    

    const handleCreateRoom = () => {
        socket.emit("create_room",username);
    }

    const handleJoinRoom = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        socket.emit("join_room", roomId,username);
    }

    return (
      <div className="flex flex-col items-center ">
        <h1 className="mt-20 text-[6rem] font-bold leading-tight text-slate-800 ">
          <span>FlowBoard</span>
        </h1>
        <h3 className="text-xl">Real Time WhiteBoard</h3>

        <div className="mt-10 flex flex-col gap-2">
          <label
            htmlFor="username"
            className="self-start font-bold leading-tight"
          >
            enter your username
          </label>

          <input
            id="username"
            className="rounded-lg border p-5 py-1"
            placeholder="JohnWick.."
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          ></input>
        </div>

        <div className="my-8 h-px w-96 bg-slate-200"></div>

        <form
          className="mt-2 flex flex-col items-center gap-2"
          onSubmit={handleJoinRoom}
        >
          <label htmlFor="room-id" className=" font-bold leading-tight">
            Enter room id
          </label>

          <input
            className="rounded-xl border p-5 py-1 outline-none"
            id="room-id"
            value={roomId}
            placeholder="Room id..."
            onChange={(e) => setRoomId(e.target.value)}
          />
          <button
            className="rounded-xl bg-slate-800 p-5 py-1 text-neutral-200 transition-all hover:scale-110 active:scale-100 hover:bg-neutral-100 hover:text-slate-800 hover:border-b-2 hover:font-semibold"
            type="submit"
          >
            Join Room
          </button>
        </form>

        <div className="my-8 h-px w-96 bg-slate-200">
          <div className="h-px w-full bg-slate-200" />
          <p className="text-slate-400 flex justify-center my-2">or</p>
          <div className="h-px w-full bg-slate-200" />
        </div>

        <div className="mt-10 flex flex-col items-center gap-2">
          <h5 className="self-start font-bold leading-tight">
            Create new Room
          </h5>
          <button
            className="rounded-xl bg-slate-800 p-5 py-1 text-neutral-200 transition-all hover:scale-110 active:scale-100 hover:bg-neutral-100 hover:text-slate-800 hover:border-b-2 hover:font-semibold"
            onClick={handleCreateRoom}
          >
            Create Room
          </button>
        </div>
      </div>
    );
};

export default Home;
