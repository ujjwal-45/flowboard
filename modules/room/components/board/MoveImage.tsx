import { useRefs } from "../../hooks/UseRefs";
import { UseBoardPosition } from "../../hooks/UseBoardPosition";
import { useMotionValue } from "framer-motion";
import { useMoveImage } from "../../hooks/UseMoveImage";
import { getPos } from "@/common/lib/getPos";
import { socket } from "@/common/lib/socket";
import { motion } from "framer-motion";
import Image from "next/image";

const MoveImage = () => {
  const { canvasRef } = useRefs();
  const { x, y } = UseBoardPosition();

  const imageX = useMotionValue(50);
  const imageY = useMotionValue(50);

  const { moveImage, setMoveImage } = useMoveImage();

  const handleMoveImage = () => {
    const [finalX, finalY] = [getPos(imageX.get(), x), getPos(imageY.get(), y)];

    const move: Move = {
      width: 0,
      height: 0,
      radius: 0,
      path: [[finalX, finalY]],
      options: {
        lineColor: "#000",
        lineWidth: 1,
        erase: false,
        shape: "image",
      },
      timeStamp: 0,
      eraser: false,
      base64: moveImage,
    };

    socket.emit("draw", move);

    setMoveImage("");
    imageX.set(50);
    imageY.set(50);
  };

  if (!moveImage) return null;

  return (
    <motion.div
      drag
      dragConstraints={canvasRef}
      dragElastic={0}
      dragTransition={{ power: 0.03, timeConstant: 50 }}
      className="absolute top-0 z-20 cursor-grab"
      style={{ x: imageX, y: imageY }}
    >
      <button
        className="w-full text-center text-black"
        onClick={handleMoveImage}
      >
        Accept
      </button>
      <Image
        className="pointer-events-none"
        src={moveImage}
        alt="image to be moved"
      />
    </motion.div>
  );
};

export default MoveImage;