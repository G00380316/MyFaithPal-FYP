"use client"

import React, { useState, useEffect } from "react";
import Dropdown from "@/components/bible/dropdown";
import styles from "@/app/(pages)/(userPages)/bible/bible.module.css";
import DisplayPassage from "@/components/bible/getPassage";

export default function Bible() {
    const [selectedBook, setSelectedBook] = useState("Genesis");
    const [selectedChapter, setSelectedChapter] = useState("1");
    const [selectedVerse, setSelectedVerse] = useState("");
    const [selectedTranslation, setSelectedTranslation] = useState("");
    const [saveClicked, setSaveClicked] = useState(false);

    const handleSelectionChange = (book, chapter, verse, translation) => {
        setSelectedBook(book);
        setSelectedChapter(chapter);
        setSelectedVerse(verse);
        setSelectedTranslation(translation);
    };

    const handleSaveButtonClick = () => {
        setSaveClicked(true);
        console.log("Update saveClicked state to: ", saveClicked);
    };

    useEffect(() => {
        if (saveClicked) {
            console.log("Save operation completed.");
            // Reset saveClicked back to false
            setSaveClicked(false);
        }
    }, [saveClicked]);


    return (
        <main className={styles.main}>
            <div className={styles.passage}>
                <nav className={styles.nav}>
                    <div>
                        <Dropdown onSelectionChange={handleSelectionChange} onSaveClick={handleSaveButtonClick}/>
                    </div>
                </nav>
                <div>
                    <DisplayPassage selectedBook={selectedBook} selectedChapter={selectedChapter} selectedVerse={selectedVerse} selectedTranslation={selectedTranslation} saveClicked={saveClicked} />
                </div>
            </div>
        </main>
    );
}
