"use client"

import React from "react";
import Dropdown from "@/components/bible/dropdown";

const options = [
    { value: 'Genesis 1', label: 'Genesis' },
    { value: 'Exodus 1', label: 'Exodus' },
    { value: 'Leviticus 1', label: 'Leviticus' },
];

const handleOptionSelect = (selectedOption) => {
        console.log(`Selected option: ${selectedOption}`);
}
    
export default function bible() {
    return (
    <div>
    <h1>Dropdown Example</h1>
    <Dropdown options={options} onSelect={handleOptionSelect} />
    </div>
    )
}