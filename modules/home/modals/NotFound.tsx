import { useModal } from "@/common/recoil/modal"
import{AiOutlineClose} from "react-icons/ai"

const NotFound = ({ id }: { id: string }) => {
    const { closeModal } = useModal();

    return (
        <div className="relative flex flex-col items-center rounded-md bg-white p-10">
            <button className="absolute top-5 right-5" onClick={closeModal}>
                <AiOutlineClose />
            </button>
            <h2 className="text-lg font-bold">Room with id {id} not found!</h2>
            <h3>try again with the correct room id</h3>
        </div>
    )
};

export default NotFound;