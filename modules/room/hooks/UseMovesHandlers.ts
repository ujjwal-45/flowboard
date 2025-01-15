import { useMyMoves, useRoom } from "@/common/recoil/room";
import { useRefs } from "./UseRefs";
import { useEffect, useMemo, useState } from "react";
import { socket } from "@/common/lib/socket";


let prevMovesLength = 0;

export const useMovesHandlers = () => {
  const { canvasRef, minimapRef } = useRefs();
  const { handleAddMyMove, handleRemoveMyMove } = useMyMoves();
  const room = useRoom();

  const [ctx, setCtx] = useState<CanvasRenderingContext2D>();

  useEffect(() => {
    const newCtx = canvasRef.current?.getContext("2d");
    if (newCtx) setCtx(newCtx);
  }, [canvasRef]);

  const sortedMoves = useMemo(() => {
    const { usersMoves, movesWithoutUser, myMoves } = room;

    const moves = [...movesWithoutUser, ...myMoves];

    usersMoves.forEach((userMoves) => moves.push(...userMoves));

    moves.sort((a, b) => a.timeStamp - b.timeStamp);

    return moves;
  }, [room]);

  const copyCanvasToSmall = () => {
    if (canvasRef.current && minimapRef.current) {
      const smallCtx = minimapRef.current.getContext("2d");
      if (smallCtx) {
        smallCtx.clearRect(0, 0, smallCtx.canvas.width, smallCtx.canvas.height);
        smallCtx.drawImage(
          canvasRef.current,
          0,
          0,
          smallCtx.canvas.width,
          smallCtx.canvas.height
        );
      }
    }
  };

  const drawMove = (move: Move) =>
    new Promise((resolve) => {
      const { path } = move;

      if (!ctx && !path.length) {
        resolve("bye");
        return;
      }
      const moveOptions = move.options;

      if (moveOptions.shape === "image") {
        const img = new Image();
        img.src = move.base64;
        img.addEventListener("load", () => {
          ctx?.drawImage(img, path[0][0], path[0][1]);
          copyCanvasToSmall();

          resolve("bye");
        });
        return;
      }
        
        ctx!.lineWidth = moveOptions.lineWidth;
        ctx!.strokeStyle = moveOptions.lineColor;
        if (move.eraser) {
            ctx!.globalCompositeOperation = "destination-out"
        }

        switch (moveOptions.shape) {
          case "line":
            ctx?.beginPath();
            path.forEach(([x, y]) => {
              ctx?.lineTo(x, y);
            });
            ctx?.stroke();
            ctx?.closePath();
            break;

          case "circle":
            ctx?.beginPath();
            ctx?.arc(path[0][0], path[0][1], move.radius, 0, 2 * Math.PI);
            ctx?.stroke();
            ctx?.closePath();
            break;

          case "rect":
            ctx?.beginPath();
            ctx?.rect(path[0][0], path[0][1], move.width, move.height);
            ctx?.stroke();
            ctx?.closePath();
            break;

          default:
            break;
        }

        copyCanvasToSmall();
        resolve("bye");
    });

    const drawAllMoves = async () => {
        if (!ctx) return;

        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

        for (const move of sortedMoves) {
            await drawMove(move);
        }
    };

    useEffect(() => {
        socket.on("your_move", (move) => {
            handleAddMyMove(move);
        });

        return () => {
            socket.off("your_move");
        }
    }, [handleAddMyMove]);

    useEffect(() => {
        if (prevMovesLength >= sortedMoves.length || !prevMovesLength) {
            drawAllMoves();
        }
        else {
            drawMove(sortedMoves[sortedMoves.length - 1])
        }

        return () => {
            prevMovesLength = sortedMoves.length;
        }
    }, [sortedMoves]);

    const handleUndo = () => {
        if (ctx) {
            handleRemoveMyMove();
            socket.emit("undo");
        }
    }

    useEffect(() => {
        const handleUndokeyboard = (e: KeyboardEvent) => {
            if (e.key === 'z' && e.ctrlKey) {
                handleUndo();
            }
        };

        document.addEventListener("keydown", handleUndokeyboard);

        return () => {
            document.removeEventListener("keydown", handleUndokeyboard);
        };
    }, [handleUndo])


    return {
        handleUndo, drawAllMoves, drawMove
    };
};
