import { useRoom } from "@/common/recoil/room";
import RoomContextProvider from "../context/Room.context";
import Canvas from "./Canvas";
import { MousePosition } from "./MousePosition";
import { MouseRenderer } from "./MouseRenderer";
import { ToolBar } from "./toolbar/ToolBar";
import NameInput from "./NameInput";

const Room = () => {
  const room = useRoom();

  if (!room.id) {
    return <NameInput />
  }
  
  
  return (
    <RoomContextProvider>
      <div className="absolute h-full w-full overflow-hidden">
        <ToolBar />
        <Canvas />
        <MousePosition />
        <MouseRenderer />
      </div>
    </RoomContextProvider>
  );
};

export default Room;
