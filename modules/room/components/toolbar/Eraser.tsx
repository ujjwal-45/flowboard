import { useOptions } from "@/common/recoil/options"
import{FaEraser} from 'react-icons/fa'

const Eraser = () => {
    const [options, setOptions] = useOptions();

    return (
        <button
            className={`text-xl ${options.erase && "bg-emerald-400"}`}
            onClick={() => {
                setOptions((prev) => ({ ...prev, erase: !prev.erase }))
            }}
        >
            <FaEraser />
        </button>
    )
};

export default Eraser;