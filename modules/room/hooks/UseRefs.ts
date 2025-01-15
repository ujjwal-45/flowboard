import { useContext } from "react"
import { roomContext } from "../context/Room.context"

export const useRefs = () => {
    const { undoRef, canvasRef, bgRef, minimapRef } = useContext(roomContext);

    return { undoRef, canvasRef, bgRef, minimapRef };
}