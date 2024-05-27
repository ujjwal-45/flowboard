import { MotionValue, useMotionValue } from "framer-motion";
import { ReactChild, ReactNode, createContext } from "react";

export const roomContext = createContext<{ x: MotionValue, y: MotionValue }>(null!);

const RoomContextProvider = ({ children }: { children: ReactNode }) => {
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    return (
        <roomContext.Provider value={{ x, y }}>{children}</roomContext.Provider>
    );
};

export default RoomContextProvider;