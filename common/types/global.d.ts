export declare global{
    interface CtsOptions{
        lineWidth: number;
        lineColor: string;
    }

    interface serverToClientEvents{
        socket_draw: (newMoves: [number, number][], options: CtxOptions) => void;
    }
}