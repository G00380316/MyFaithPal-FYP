"use client"

import React from "react";
import Dropdown from "@/components/bible/dropdown";
import styles from "@/app/(pages)/(userPages)/bible/bible.module.css";
import DisplayPassage from "@/components/bible/getPassage";

const optionsBooks = [
    { value: 'Genesis 1', label: 'Genesis' },
    { value: 'Exodus 1', label: 'Exodus' },
    { value: 'Leviticus 1', label: 'Leviticus' },
];

const optionsChapters = [
    { value: '1', label: '1' },
    { value: '2', label: '2' },
    { value: '3', label: '3' },
];

const handleOptionSelect = (selectedOption) => {
        console.log(`Selected option: ${selectedOption}`);
}
    
export default function bible() {
    return (
    <>
    <nav className={styles.nav}>
        <div>
        <Dropdown options={optionsBooks} onSelect={handleOptionSelect} />
            </div>
            <div>
                <Dropdown options={optionsChapters} onSelect={handleOptionSelect} />
            </div>
    </nav>
    <div>
    <DisplayPassage/>
    </div>
    </>
    )
}