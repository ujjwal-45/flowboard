import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { RecoilRoot } from "recoil";
import { Raleway } from "next/font/google";
import ModalManager from "@/common/components/modal/components/ModalManager";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


const raleway = Raleway({ subsets: ["latin"] });

export default function App({ Component, pageProps }: AppProps) {
  return (
    <RecoilRoot>
      <ToastContainer />
      <ModalManager />
      <main className={raleway.className}>
        <Component {...pageProps} />;
      </main>
    </RecoilRoot>
  );
}
