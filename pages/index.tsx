
import { Inter } from "next/font/google";
import { useEffect, useRef, useState } from "react";
import { useDraw } from "@/common/hooks/drawing";
import {socket} from '@/common/lib/socket'
import Canvas from "@/modules/room/components/Canvas";
import Room from "@/modules/room/components/Room";


const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <Room/>
  )
}
