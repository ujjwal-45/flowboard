import { useOptions } from '@/common/recoil/options';
import { AnimatePresence } from 'framer-motion';
import React, { useRef, useState } from 'react'
import { BsBorderWidth } from "react-icons/bs";
import { useClickAway } from 'react-use';
import{motion} from "framer-motion"

const LineWidthPicker = () => {

    const [options, setOptions] = useOptions();
    const ref = useRef<HTMLDivElement>(null);
    const [opened, setOpened] = useState(false);

    useClickAway(ref, () => setOpened(false));

    return (
      <div className="relative flex items-center" ref={ref}>
        <button className="text-xl" onClick={() => setOpened(!opened)}>
          <BsBorderWidth />
        </button>
        <AnimatePresence>
          {opened && (
                <motion.div
                    className="absolute top-[6px] left-15 w-36"
                    initial="from"
                    animate="to"
                    exit="from"
                >
                    
                        <input
                            type="range"
                            min={1}
                            max={20}
                            value={options.lineWidth}
                            onChange={(e) => {
                                setOptions((prev) => ({...prev, lineWidth: parseInt(e.target.value, 10)}))
                            }}
                            className='cursor-pointer h-full w-full appearance-none rounded-lg bg-neutral-300'
                        >
                            
                        </input>
                    
                    
                </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
}

export default LineWidthPicker