import { socket } from "@/common/lib/socket";
import { FormEvent, useState } from "react"
import { IoIosSend } from "react-icons/io";


const ChatInput = () => {
    const [msg, setMsg] = useState("");

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        socket.emit("send_msg", msg);
        setMsg("")
    };

    return (
      <form className="flex w-full items-center gap-2" onSubmit={handleSubmit}>
        <input
          className="w-full rounded-xl border border-zinc-300 py-1 p-1"
          onChange={(e) => e.target.value}
        />
          <button className="h-full bg-green-400" type="submit">
            <IoIosSend />;
          </button>
      </form>
    );
}

export default ChatInput;