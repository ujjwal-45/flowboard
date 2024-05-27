import { useState, useEffect } from 'react'

export const useViewPortSize = () => {
    const [height, setHeight] = useState(0);
    const [width, setWidth] = useState(0);
    
    useEffect(() => {
    const handleResize = () => {
        setHeight(window.innerHeight);
        setWidth(window.innerWidth);
    }

    window.addEventListener("resize", handleResize);

    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
    }, [])
  
  return { width, height };
}