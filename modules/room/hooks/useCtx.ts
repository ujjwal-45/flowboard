import { useEffect, useState } from "react";
import { useRefs } from "./UseRefs"

export const UseCtx = () => {
    const { canvasRef } = useRefs();

    const [ctx, setCtx] = useState<CanvasRenderingContext2D>();

    useEffect(() => {
        const newCtx = canvasRef.current?.getContext("2d");

        if (newCtx) {
            newCtx.lineJoin = "round";
            newCtx.lineCap = "round";
            setCtx(newCtx);
        }
    }, [canvasRef]);

    return ctx;
}