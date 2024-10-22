import { atom } from "recoil";

export const roomAtom = atom<ClientRoom>({
    key: "room",
    default: {
        id: "",
        usersMoves: new Map(),
        users: new Map(),
        movesWithoutUser: [],
        myMoves: [],
    }
});