import { useRoom } from "@/common/recoil/room"

const UsersList = () => {
    const room = useRoom();

    return (
        <div className="pointers-event-none z-10 flex absolute p-5">
            {[...room.users.keys()].map((userId, index) => {
                return (
                    <div key={userId} className="flex h-8 w-8 select-none justify-center items-center rounded-full text-white"
                        style={{ backgroundColor: room.users.get(userId)?.color || 'black', marginLeft: index !== 0 ? '-0.5rem' : 0 }}
                    >
                        {room.users.get(userId)?.name.split("")[0] || 'A'}
                    </div>
                );
            })}

        </div>
        
    )
};

export default UsersList;