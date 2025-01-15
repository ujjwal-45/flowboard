import { useRoom } from "@/common/recoil/room";
import RoomContextProvider from "../context/Room.context";
import Canvas from "./board/Canvas";
import { MousePosition } from "./board/MousePosition";
import { MouseRenderer } from "./board/MouseRenderer";
import { ToolBar } from "./toolbar/ToolBar";
import NameInput from "./NameInput";
import UsersList from "./UsersList";
import Chat from "./chat/Chat";
import MoveImage from "./board/MoveImage";

const Room = () => {
  const room = useRoom();

  if (!room.id) {
    return <NameInput />;
  }

  return (
    <RoomContextProvider>
      <div className="absolute h-full w-full overflow-hidden">
        <UsersList />
        <ToolBar />
        <MoveImage />
        <Canvas  />
        <MousePosition />
        <MouseRenderer />
        <Chat />
      </div>
    </RoomContextProvider>
  );
};

export default Room;
