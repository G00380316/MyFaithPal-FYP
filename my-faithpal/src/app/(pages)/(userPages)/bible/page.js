"use client"

import React, { useState } from "react";
import Dropdown from "@/components/bible/dropdown";
import styles from "@/app/(pages)/(userPages)/bible/bible.module.css";
import DisplayPassage from "@/components/bible/getPassage";


export default function Bible() {
    const [selectedBook, setSelectedBook] = useState("Genesis");
    const [selectedChapter, setSelectedChapter] = useState("1");
    const [selectedVerse, setSelectedVerse] = useState("");

    const handleSelectionChange = (book, chapter, verse) => {
        setSelectedBook(book);
        setSelectedChapter(chapter);
        setSelectedVerse(verse);
    };

    return (
        <main className={styles.main}>
            <nav className={styles.nav}>
                <div>
                    <Dropdown onSelectionChange={handleSelectionChange} />
                </div>
            </nav>
            <div>
                <DisplayPassage selectedBook={selectedBook} selectedChapter={selectedChapter} selectedVerse={selectedVerse} />
            </div>
        </main>
    );
}
