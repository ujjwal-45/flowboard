import { socket } from "@/common/lib/socket";
import { useRoom } from "@/common/recoil/room"
import { useEffect, useRef, useState } from "react";
import { useList } from "react-use";
import {motion} from "framer-motion"
import { DEFAULT_EASE } from "@/common/constants/easings";
import { BsChatFill } from "react-icons/bs";
import { FaCaretDown } from "react-icons/fa";
import Message from "./Message";
import ChatInput from "./ChatInput";

const Chat = () => {
    const room = useRoom();

    const msgList = useRef<HTMLDivElement>(null);

    const [newMsg, setNewMsg] = useState(false);
    const [opened, setOpened] = useState(false);
    const [msgs, setMsgs] = useList<Message>([]);

    useEffect(() => {
        const handleNewMsg = (userId: string, msg: string) => {
            const user = room.users.get(userId);

            setMsgs.push({
                userId,
                msg,
                id: msg.length + 1,
                username: user?.name || "Anonymous",
                color: user?.color || "#000"
            });

            msgList.current?.scroll({ top: msgList.current.scrollHeight });

            if (!opened) {
                setNewMsg(true);
            }
        }

        socket.on("new_msg", handleNewMsg);

        return () => {
            socket.off("new_msg", handleNewMsg);
        }
    }, [setMsgs, msgs, opened, room.users]);

    return (
      <motion.div
        className="absolute bottom-0 left-36 z-30 flex h-[300px] w-[30rem] flex-col overflow-hidden rounded-t-md border"
        animate={{ y: opened ? 0 : 260 }}
        transition={{ ease: DEFAULT_EASE, duration: 0.2 }}
      >
        <button
          className="flex w-full cursor-pointer items-center justify-between bg-zinc-900 text-white py-2 px-10"
          onClick={() => {
            setOpened((prev) => !prev);
            setNewMsg(false);
          }}
        >
          <div className="flex items-center gap-2">
            <BsChatFill className="mt-[-2px]" />
            Chat
            {newMsg && (
              <p className="rounded-md bg-emerald-400 px-1 font-semibold text-green-800">
                New!
              </p>
            )}
          </div>
          <motion.div
            animate={{ rotate: opened ? 0 : 100 }}
            transition={{ ease: DEFAULT_EASE, duration: 0.2 }}
          >
            <FaCaretDown />
          </motion.div>

          <div className="flex flex-1 flex-col justify-between bg-neutral-100 p-3">
            <div className="h-[300px] overflow-y-scroll pr-2" ref={msgList}>
              {msgs.map((msg) => (
                <Message key={msg.id} {...msg} />
              ))}
            </div>
            <ChatInput />
          </div>
        </button>
      </motion.div>
    );
};

export default Chat;