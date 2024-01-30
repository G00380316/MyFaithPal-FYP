import React, { useState } from 'react';

const Dropdown = ({ options, onSelect }) => {
    const handleSelect = (e) => {
        const selectedOption = options.find(option => option.value === e.target.value);
        onSelect(selectedOption);
    };

    return (
        <select onChange={handleSelect}>
            {options.map(option => (
                <option key={option.value} value={option.value}>
                    {option.label}
                </option>
            ))}
        </select>
    );
};

export default Dropdown;
