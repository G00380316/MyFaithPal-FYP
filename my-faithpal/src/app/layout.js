import { Inter } from "next/font/google";
import "./globals.css";

//components
import Navbar from "@/components/navbar/navbar.js";
import Footer from "@/components/footer/footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "FaithPal",
  description: "Made by Enoch Abiodun",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
