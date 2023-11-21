import Link from "next/link"
import styles from "@/app/page.module.css"
import navStyles from "@/components/navbar/navbar.module.css"

export default function navbar() {
    return (
        <nav className={navStyles.nav}>
        <Link href='/'><h1>MYFAITHPAL</h1></Link>
        <h1  style={{ height: 50 }}>_____________________</h1>
        <Link href='/bible'><p style={{ fontSize: 20 }}>Bible</p></Link>
        <Link href='/swipe'><p style={{ fontSize: 20 }}>Swipe</p></Link>
        <Link href='/explore'><p style={{ fontSize: 20 }}>Explore</p></Link>
        <Link href='/questions'><p style={{ fontSize: 20 }}>Questions</p></Link>
        <Link href='/chat'><p style={{fontSize: 20}}>Chat</p></Link>
        <Link href='/login'><button className={styles.button}>Login/Register</button></Link>
        </nav>
    )
}