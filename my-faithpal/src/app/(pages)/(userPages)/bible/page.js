"use client"

import React, { useState } from "react";
import Dropdown from "@/components/bible/dropdown";
import styles from "@/app/(pages)/(userPages)/bible/bible.module.css";
import DisplayPassage from "@/components/bible/getPassagetest";

export default function Bible() {
    const [selectedBook, setSelectedBook] = useState("Genesis");
    const [selectedChapter, setSelectedChapter] = useState("1");
    const [selectedVerse, setSelectedVerse] = useState("");
    const [selectedTranslation, setSelectedTranslation] = useState("");

    const handleSelectionChange = (book, chapter, verse, translation) => {
        setSelectedBook(book);
        setSelectedChapter(chapter);
        setSelectedVerse(verse);
        setSelectedTranslation(translation);
    };

    return (
        <main className={styles.main}>
            <nav className={styles.nav}>
                <div>
                    <Dropdown onSelectionChange={handleSelectionChange} />
                </div>
            </nav>
            <div>
                <DisplayPassage selectedBook={selectedBook} selectedChapter={selectedChapter} selectedVerse={selectedVerse} selectedTranslation={selectedTranslation}/>
            </div>
        </main>
    );
}
