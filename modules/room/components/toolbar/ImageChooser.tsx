import Resizer from "react-image-file-resizer"
import { useMoveImage } from "../../hooks/UseMoveImage"
import { BsFillImageFill } from "react-icons/bs";


const ImageChooser = () => {
    const { setMoveImage } = useMoveImage();
    const handleInput = () => {
        const fileInput = document.createElement("input")
        fileInput.type = "file";
        fileInput.accept = "image/*"
        fileInput.click()

        fileInput.addEventListener("change", () => {
            if (fileInput && fileInput.files) {
                const file = fileInput.files[0]
                Resizer.imageFileResizer(
                    file,
                    700,
                    700,
                    "WEBP",
                    100,
                    0,
                    (uri) => {
                        setMoveImage(uri.toString())
                    },
                    "base64"
                )
            }
        });
    };

    return (
        <button className="text-xl" onClick={handleInput}>
            <BsFillImageFill />
        </button>
    )
};

export default ImageChooser;