import React from 'react';
import styles from "@/app/(pages)/(userPages)/questions/questions.module.css";
import QueryBox  from "@/components/questions/QAcard";

export default function questions() {
    return (
    <main className={styles.main}>
            <QueryBox/>
    </main>
)
}
