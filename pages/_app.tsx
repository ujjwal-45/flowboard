import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { RecoilRoot } from 'recoil'
import { Inter, Raleway } from "next/font/google";
import ModalManager from "@/common/components/modal/components/ModalManager";



const inter = Inter({ subsets: ["latin"] });
const raleway = Raleway({ subsets: ["latin"] });

export default function App({ Component, pageProps }: AppProps) {
  return (
    <RecoilRoot>
      <ModalManager />
      <main className={raleway.className}>
      <Component {...pageProps} />;
      </main>
      
    </RecoilRoot>
    
  )
}
