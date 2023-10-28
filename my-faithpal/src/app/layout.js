import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'FaithPal',
  description: 'Made by Enoch Abiodun',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
      <nav className="nav">
          <a href='/'><h1>MYFAITHPAL</h1></a>
          <h1  style={{ height: 50 }}>_____________________</h1>
          <a href='/bible'><p style={{ fontSize: 20 }}>Bible</p></a>
          <a href='/swipe'><p style={{ fontSize: 20 }}>Swipe</p></a>
          <a href='/notes'><p style={{ fontSize: 20 }}>Notes</p></a>
          <a href='/explore'><p style={{ fontSize: 20 }}>Explore</p></a>
          <a href='/bible'><p style={{fontSize: 20}}>Chat</p></a>
          <a href='/Questions'><button className="button">Questions</button></a>
        </nav>
        {children}
      </body>
    </html>
  )
}
