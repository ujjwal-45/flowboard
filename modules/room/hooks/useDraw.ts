import { useOptionsValue } from "@/common/recoil/options";
import { useCallback, useEffect, useState } from "react";
import { UseBoardPosition } from "./UseBoardPosition";
import { useMyMoves } from "@/common/recoil/room";
import { socket } from "@/common/lib/socket";
import { getPos } from "@/common/lib/getPos";

let tempMoves:[number, number][] = [];

export const useDraw = (ctx: CanvasRenderingContext2D | undefined,
    blocked: boolean
) => {

    const { handleAddMyMove, handleRemoveMyMove } = useMyMoves();
    const options = useOptionsValue();
    const [drawing, setDrawing] = useState(false);

    const boardPosition = UseBoardPosition();

    const movedX = boardPosition.x;
    const movedY = boardPosition.y;

    useEffect(() => {
        if (ctx) {
            ctx.lineJoin = "round";
            ctx.lineCap = "round";
            ctx.lineWidth = options.lineWidth;
            ctx.strokeStyle = options.lineColor;
        }
    });

    const handleUndo = useCallback(() => {
        if (ctx) {
            handleRemoveMyMove();
            socket.emit("undo");

        }
    }, [ctx, handleRemoveMyMove]);

    useEffect(() => {
        const handleUndokeyboard = (e: KeyboardEvent) => {
            if (e.key === 'z' && e.ctrlKey) {
                handleUndo();
            }
        };

        document.addEventListener("keydown", handleUndokeyboard);

        return () => {
            document.removeEventListener("keydown", handleUndokeyboard);
        }
    }, [handleUndo]);

    const handleStartDrawing = (x: number, y: number) => {
        if (!ctx || blocked) return;

        setDrawing(true);

        ctx.beginPath();
        ctx.lineTo(getPos(x,movedX), getPos(y,movedY));
        ctx.stroke();

        tempMoves.push([getPos(x, movedX), getPos(y, movedY)]);
    };

    const handleEndDrawing = () => {
        if (!ctx || blocked) return;
        
        setDrawing(false);
        ctx.closePath();

        const move: Move = {
            path: tempMoves,
            options
        }
        
        handleAddMyMove(move);
        tempMoves = [];

        socket.emit("draw", move);
    };

    const handleDraw = (x: number, y: number) => {
        if (!ctx || !drawing || blocked) {
            return;
        }
       
        ctx.lineTo( getPos(x,movedX), getPos(y,movedY));
        ctx.stroke();
        tempMoves.push([getPos(x,movedX), getPos(y,movedY)]);
    };

    return {
        handleDraw,
        handleEndDrawing,
        handleStartDrawing,
        handleUndo,
        drawing,
    }
}