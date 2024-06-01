import { useSetOptions } from "@/common/recoil/options/options.hooks"

export const ToolBar = () => {
    const setOptions = useSetOptions();

    return (
        <div className="absolute flex flex-col top-40 left-10 z-50 p-2 gap-5 rounded-lg bg-slate-900 text-neutral-200">
            <button className="text-red-600" onClick={() => setOptions((prev) => ({...prev, lineColor : "red"}))}>
                Red
            </button>
             <button className="text-blue-600"  onClick={() => setOptions((prev) => ({...prev, lineColor : "blue"}))}>
                Blue
            </button>
             <button className="text-emerald-600"  onClick={() => setOptions((prev) => ({...prev, lineColor : "lime"}))}>
                Green
            </button>
             <button className="text-purple-600"  onClick={() => setOptions((prev) => ({...prev, lineColor : "purple"}))}>
                Purple
            </button>

        </div>
    )
}