
import Home from "@/modules/home/components/Home";
import { NextPage } from "next";
import { Inter } from "next/font/google";



const inter = Inter({ subsets: ["latin"] });

const HomePage : NextPage = () => {
  return (
    <Home />
  )
}

export default HomePage;