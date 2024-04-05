import { Inter } from "next/font/google";
import { Providers } from "./Providers";
import "./globals.css";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "FaithPal",
  description: "Made by Enoch Abiodun",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <body className={inter.className}>
          <Providers>
          {children}
          <ToastContainer newestOnTop limit={3} style={{width:450}}/>
          </Providers>
      </body>
    </html>
  );
}
