import { useSetOptions } from "@/common/recoil/options/options.hooks"

export const ToolBar = () => {
    const setOptions = useSetOptions();

    return (
        <div className="absolute top-0 left-10 z-50 flex gap-5 bg-slate-900 text-neutral-200">
            <button onClick={() => setOptions((prev) => ({...prev, lineColor : "red"}))}>
                Red
            </button>
             <button onClick={() => setOptions((prev) => ({...prev, lineColor : "blue"}))}>
                Blue
            </button>
             <button onClick={() => setOptions((prev) => ({...prev, lineColor : "lime"}))}>
                Green
            </button>
             <button onClick={() => setOptions((prev) => ({...prev, lineColor : "purple"}))}>
                Purple
            </button>

        </div>
    )
}