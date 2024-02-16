import React, { useState, useEffect } from 'react';
import { bookInfo } from '@/util/bible/Filter/bookInfo';

const Dropdown = ({ onSelectionChange }) => {
    const [selectedBook, setSelectedBook] = useState('Genesis');
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
        onSelectionChange(e.target.value, 1, ""); // Notify parent component about book change and reset chapter and verse
    };


    const handleChapterChange = (e) => {
        setSelectedChapter(parseInt(e.target.value));
        onSelectionChange(selectedBook, parseInt(e.target.value), selectedVerse);
    };

    const handleVerseChange = (e) => {
    const verseValue = parseInt(e.target.value);
        if (!isNaN(verseValue)) {
            setSelectedVerse(verseValue);
            onSelectionChange(selectedBook, selectedChapter, verseValue);
        } else {
            setSelectedVerse("");
            onSelectionChange(selectedBook, selectedChapter, "");
        }
};



    return (
        <div>
            <label htmlFor="books">Select a Book:</label>
            <select id="books" value={selectedBook} onChange={handleBookChange}>
                {Object.keys(bookInfo).map(book => (
                    <option key={book} value={book}>{book}</option>
                ))}
            </select>

            <label htmlFor="chapters">Select a Chapter:</label>
            <select id="chapters" value={selectedChapter} onChange={handleChapterChange}>
                {chapters.map(chapter => (
                    <option key={chapter} value={chapter}>Chapter {chapter}</option>
                ))}
            </select>

            <label htmlFor="verses">Select a Verse:</label>
            <select id="verses" value={selectedVerse} onChange={handleVerseChange}>
                <option value="">Select a Verse</option>
                {verses.map((verse, index) => (
                    <option key={index} value={verse}>Verse {verse}</option>
                ))}
            </select>
        </div>
    );
};

export default Dropdown;
