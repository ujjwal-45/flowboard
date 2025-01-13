import { socket } from "@/common/lib/socket"

const Message = ({ userId, username, color, msg }: Message) => {
    const isMe = socket.id === userId;

    return (
        <div className={`my-2 flex gap-2 text-clip ${isMe && 'justify-end text-right'}`}>
            {!isMe && (
                <h5 style={{ color }} className="font-semibold">
                    {username}
                </h5>
            )}
            <p style={{ wordBreak: "break-all" }}>
                {msg}
            </p>
        </div>
    )
};

export default Message;