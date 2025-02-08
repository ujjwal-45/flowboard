import { useOptions } from "@/common/recoil/options";
import { AnimatePresence, motion } from "framer-motion";
import { useRef, useState } from "react"
import { FaCircle, FaLine, FaSquare } from "react-icons/fa";
import { LiaPaintBrushSolid } from "react-icons/lia";
import { useClickAway } from "react-use";
import { ColorPickerAnimation } from "../../animations/ColorPicker.animations";

const ShapeSelector = () => {
    const ref = useRef<HTMLDivElement>(null);
    const [options, setOptions] = useOptions();
    const [opened, setOpened] = useState(false);

    useClickAway(ref, () => setOpened(false));

    const handleShapeChange = (shape: Shape) => {
        setOptions((prev) => ({
            ...prev, shape,
        }));

        setOpened(false);
    };


    return (
      <div className="relative flex items-center text-black" ref={ref}>
        <button className="text-xl" onClick={() => setOpened((prev) => !prev)}>
          {options.shape === "circle" && <FaCircle />}
          {options.shape === "line" && <FaLine />}
          {options.shape === "rect" && <FaSquare />}
        </button>

        <AnimatePresence>
          {opened && (
            <motion.div
              className="absolute flex left-14 gap-1 rounded-lg bg-zinc-900 p-2"
              variants={ColorPickerAnimation}
              initial="from"
              animate="to"
              exit="from"
            >
              <button
                className="text-xl"
                onClick={() => handleShapeChange("circle")}
              >
                <FaCircle />
              </button>
              <button
                className="text-xl"
                onClick={() => handleShapeChange("line")}
              >
                <LiaPaintBrushSolid />
              </button>
              <button
                className="text-xl"
                onClick={() => handleShapeChange("rect")}
              >
                <FaSquare />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
}

export default ShapeSelector;