import React, { useState, useEffect } from 'react';
import { bookInfo } from '@/util/bible/Filter/bookInfo';
import { translationOptions } from '@/util/bible/translationOptions';
import { oebbookInfo } from '@/util/bible/Filter/oebBooks';
import styles from '@/components/bible/dropdown.module.css';

const Dropdown = ({ onSelectionChange, onSaveClick, onClearClick }) => {

    const [selectedTranslation, setSelectedTranslation] = useState("");
    const [selectedBook, setSelectedBook] = useState("Genesis");
    const [selectedChapter, setSelectedChapter] = useState(1);
    const [selectedVerse, setSelectedVerse] = useState("");
    const [chapters, setChapters] = useState([]);
    const [verses, setVerses] = useState([]);

    useEffect(() => {
        // Populate chapters dropdown based on selected book
        setChapters(bookInfo[selectedBook].map(chapter => chapter.chapter));
    }, [selectedBook]);

    useEffect(() => {
        // Populate verses dropdown based on selected chapter
        const selectedChapterInfo = bookInfo[selectedBook].find(chapter => chapter.chapter === selectedChapter);
        if (selectedChapterInfo) {
            setVerses(Array.from({ length: selectedChapterInfo.verses }, (_, index) => index + 1));
        }
    }, [selectedBook, selectedChapter]);

    const handleBookChange = (e) => {
        setSelectedBook(e.target.value);
        setSelectedChapter(1); // Reset selected chapter to 1
        setSelectedVerse(""); // Reset selected verse to default
        onSelectionChange(e.target.value, 1, "", selectedTranslation); // Notify parent component about book change and reset chapter and verse
    };


    const handleChapterChange = (e) => {
        setSelectedChapter(parseInt(e.target.value));
        onSelectionChange(selectedBook, parseInt(e.target.value), selectedVerse ,selectedTranslation);
    };

    const handleVerseChange = (e) => {
    const verseValue = parseInt(e.target.value);
        if (!isNaN(verseValue)) {
            setSelectedVerse(verseValue);
            onSelectionChange(selectedBook, selectedChapter, verseValue , selectedTranslation);
        } else {
            setSelectedVerse("");
            onSelectionChange(selectedBook, selectedChapter, "" , selectedTranslation);
        }
    };

    const handleTranslationChange = (e) => {
        setSelectedTranslation(e.target.value);

        if (e.target.value === "oeb-us" || e.target.value === "oeb-cw") {
            setSelectedBook("Ruth");
            onSelectionChange("Ruth", 1, "", e.target.value);
        } else {
            onSelectionChange(selectedBook, selectedChapter, selectedVerse, e.target.value);
        }
    };

    const handleSaveButtonClick = () => {
        onSaveClick();
        console.log("parent class")
    };

    const handleClearButtonClick = () => {
        onClearClick();
        console.log("parent class")
    };

    return (
    <div className={styles.dropdown}>
        
        <div className={styles.customButtonC}>
            <button onClick={handleClearButtonClick}>
                Clear
            </button>
        </div>
        
        <label htmlFor="books" style={{ marginRight: 5, marginLeft: 5, color: "#996515" }}></label>
        <div className={styles.customSelect}>
            <select id="books" value={selectedBook} onChange={handleBookChange}>
                {selectedTranslation === "oeb-us" || selectedTranslation === "oeb-cw" ? (
                    Object.keys(oebbookInfo).map(book => (
                        <option key={book} value={book}>{book}</option>
                    ))
                ) : (
                    Object.keys(bookInfo).map(book => (
                        <option key={book} value={book}>{book}</option>
                    ))
                )}
            </select>
        </div>

        <label htmlFor="chapters" style={{ marginRight: 5, marginLeft: 5, color: "#996515" }}></label>
        <div className={styles.customSelect}>
            <select id="chapters" value={selectedChapter} onChange={handleChapterChange}>
                {chapters.map(chapter => (
                    <option key={chapter} value={chapter}>Chapter {chapter}</option>
                ))}
            </select>
        </div>

        <label htmlFor="verses" style={{ marginRight: 5, marginLeft: 5, color: "#996515" }}></label>
        <div className={styles.customSelect}>
            <select id="verses" value={selectedVerse} onChange={handleVerseChange}>
                <option value="">Select a Verse</option>
                {verses.map((verse, index) => (
                    <option key={index} value={verse}>Verse {verse}</option>
                ))}
            </select>
        </div>

        <label htmlFor="translation" style={{ marginRight: 5, marginLeft: 5, color: "#996515" }}></label>
        <div className={styles.customSelect}>
            <select id="translation" value={selectedTranslation} onChange={handleTranslationChange}>
                <option value="">Select a translation</option>
                {translationOptions.map((option, index) => (
                    <option key={index} value={option.value}>{option.label}</option>
                ))}
            </select>
        </div>

        <div className={styles.customButton}>
            <button onClick={handleSaveButtonClick}>
                Save
            </button>
        </div>
    </div>
    );
};

export default Dropdown;
