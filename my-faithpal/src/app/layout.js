import { Inter } from "next/font/google";
import { Providers } from "./Providers";
import "./globals.css";

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
          </Providers>
      </body>
    </html>
  );
}
