import { useOptionsValue } from "@/common/recoil/options";
import { useEffect, useState } from "react";
import { UseBoardPosition } from "./UseBoardPosition";
import { useMyMoves, useRoom } from "@/common/recoil/room";
import { socket } from "@/common/lib/socket";
import { getPos } from "@/common/lib/getPos";
import {drawCircle, drawLine, drawRect } from "../helpers/Canvas.helpers";
import { useRefs } from "./UseRefs";

let tempMoves: [number, number][] = [];


let tempRadius = 0;
let tempSize = { width: 0, height: 0 };

export const useDraw = (
    blocked: boolean, drawAllMoves: () => void
) => {

    const { canvasRef } = useRefs();
    const options = useOptionsValue();
    const boardPosition = UseBoardPosition();
    const [drawing, setDrawing] = useState(false);
    const [ctx, setCtx] = useState<CanvasRenderingContext2D>()

    const movedX = boardPosition.x;
    const movedY = boardPosition.y;

    useEffect(() => {
        const newCtx = canvasRef.current?.getContext("2d")
        if (newCtx) {
          setCtx(newCtx);
        }
    }, [canvasRef]);
    
    const setCtxOptions = () => {
        if (ctx) {
            // ctx.lineJoin = "round";
            // ctx.lineCap = "round";
            ctx.lineWidth = options.lineWidth;
            ctx.strokeStyle = options.lineColor;
            if (options.erase) {
                ctx.globalCompositeOperation = "destination-out";
            }
            else {
                ctx.globalCompositeOperation = "source-over";
            }
        }
    };

    const drawAndSet = () => {
        drawAllMoves();
        setCtxOptions();
    }


    const handleStartDrawing = (x: number, y: number) => {
        if (!ctx || blocked) return;

        setDrawing(true);
        setCtxOptions();

        ctx.beginPath();
        ctx.lineTo(getPos(x,movedX), getPos(y,movedY));
        ctx.stroke();

        tempMoves.push([getPos(x, movedX), getPos(y, movedY)]);
    };
    const handleDraw = (x: number, y: number, shift? : boolean) => {
        if (!ctx || !drawing || blocked) {
            return;
        }
       
        const finalX = getPos(x, movedX);
        const finalY = getPos(y, movedY);

        switch (options.shape) {
            case "line":
                if (shift) {
                    tempMoves = tempMoves.slice(0, 1);
                    drawAndSet();
                }
                drawLine(ctx, tempMoves[0], finalX, finalY, shift);
                tempMoves.push([finalX, finalY]);
            
            case "circle":
                drawAndSet();
                tempRadius = drawCircle(
                    ctx,
                    tempMoves[0],
                    finalX,
                    finalY,
                );
                break;
            
            case "rect":
                drawAndSet();
                tempSize = drawRect(
                    ctx,
                    tempMoves[0],
                    finalX,
                    finalY,
                    shift
                );
                break;
            
            default:
                break;
        }

    };
    
    const handleEndDrawing = () => {
        if (!ctx || blocked) return;
        
        setDrawing(false);
        ctx.closePath();

        if (options.shape !== "circle") {
            tempRadius = 0;
        }
        if (options.shape !== "rect") {
            tempSize = { width: 0, height: 0};
        }

        const move: Move = {
            ...tempSize,
            radius: tempRadius,
            path: tempMoves,
            options,
            timeStamp: 0,
            eraser: options.erase,
            base64:"",
        }
        
        tempMoves = [];
        ctx.globalCompositeOperation = "source-over";
        
        socket.emit("draw", move);
    };


    return {
        handleDraw,
        handleEndDrawing,
        handleStartDrawing,
        drawing,
    }
}