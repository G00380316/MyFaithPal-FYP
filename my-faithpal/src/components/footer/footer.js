"use client"

import React from 'react'
import styles from '@/components/footer/footer.module.css'
import { useSession } from "next-auth/react";

export default function footer() {

    const { data: session } = useSession();

return (
    <footer className={styles.footer}>
    <div className={styles.div}>
        <p className={styles.p}>Hey <span>{session?.user?.username || session?.user?.name}</span>, Welcome!!!</p>
        <p className={styles.p}>_______________________________________________________________________________________</p>
    </div>
</footer>
);
}
