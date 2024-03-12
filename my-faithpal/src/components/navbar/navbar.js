"use client"

import Link from "next/link"
import styles from "@/app/page.module.css"
import navStyles from "@/components/navbar/navbar.module.css"
import { useSession } from "next-auth/react"

export default function navbar() {
    
    const { data: session } = useSession();

    return (
        <nav className={navStyles.nav}>
        <Link href='/'><h1>MYFAITHPAL</h1></Link>
        <h1  style={{ height: 50 }}>_____________________</h1>
        <Link href='/bible'><p style={{ fontSize: 20 }}>Bible</p></Link>
        <Link href='/feed'><p style={{ fontSize: 20 }}>Feed</p></Link>
        <Link href='/questions'><p style={{ fontSize: 20 }}>Questions</p></Link>
        <Link href='/chat'><p style={{fontSize: 20}}>Chat</p></Link>
        {session ? (
                <Link href='/profile'><button className={styles.button}>Profile</button></Link>
            ) : (
                <Link href='/login'><button className={styles.button}>Login/Register</button></Link>
            )}
        </nav>
    )
}