"use client"

import React from 'react'
import styles from '@/components/footer/footer.module.css'
import { useSession } from "next-auth/react";

export default function footer() {

    const { data: session } = useSession();

return (
    <footer className={styles.footer}>
    <div className={styles.div}>
        <p className={styles.p}>Hey there <span>{session?.user?.name}</span>, Welcome!!!</p>
        <p className={styles.p}>_______________________________________________________________________________________</p>
    <div style={{ margin: '0', paddingLeft: '0' }}>
        <button className={styles.button}>V</button>
    </div>
    </div>
</footer>
);
}
