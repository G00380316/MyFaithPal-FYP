"use client"

import React, { useState } from "react";
import Dropdown from "@/components/bible/dropdown";
import styles from "@/app/(pages)/(userPages)/bible/bible.module.css";
import DisplayPassage from "@/components/bible/getPassage";

const optionsBooks = [
    { value: 'Genesis', label: 'Genesis' },
    { value: 'Exodus', label: 'Exodus' },
    { value: 'Leviticus', label: 'Leviticus' },
];

const optionsChapters = [
    { value: '1', label: '1' },
    { value: '2', label: '2' },
    { value: '3', label: '3' },
];

export default function Bible() {
    const [selectedBook, setSelectedBook] = useState(optionsBooks[0].value); // Default to the first book
    const [selectedChapter, setSelectedChapter] = useState(optionsChapters[0].value); // Default to the first chapter

    const handleBookSelect = (selectedOption) => {
    setSelectedBook(selectedOption.value);
    console.log('Selected Book:', selectedOption.value);
    };

    const handleChapterSelect = (selectedOption) => {
    setSelectedChapter(selectedOption.value);
    console.log('Selected Chapter:', selectedOption.value);
    };

    return (
    <>
        <nav className={styles.nav}>
        <div>
            <Dropdown options={optionsBooks} onSelect={handleBookSelect} />
        </div>
        <div>
            <Dropdown options={optionsChapters} onSelect={handleChapterSelect} />
        </div>
        </nav>
        <div>
        <DisplayPassage selectedBook={selectedBook} selectedChapter={selectedChapter} />
        </div>
    </>
    );
}
