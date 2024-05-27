import RoomContextProvider from "../context/Room.context"
import Canvas from "./Canvas"
import { MousePosition } from "./MousePosition"
import { MouseRenderer } from "./MouseRenderer"

const Room = () => {
    return (
        <RoomContextProvider>
            <div className="h-full w-full relative overflow-hidden">

            <Canvas />
            <MousePosition />    
            <MouseRenderer />
            </div>
        </RoomContextProvider>
    )
}

export default Room;