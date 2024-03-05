import React, { useState } from 'react';

const Dropdown = ({ options, onSelect }) => {
    const [selectedOption, setSelectedOption] = useState('');

    const handleSelect = (option) => {
    setSelectedOption(option);
    onSelect(option);
};

return (
    <div>
        <select
        value={selectedOption}
        onChange={(e) => handleSelect(e.target.value)}
        >
        <option value="" disabled>Select an Option</option>
        {options.map((option) => (
        <option key={option.value} value={option.value}>
            {option.label}
        </option>
        ))}
    </select>
    </div>
    );
};

export default Dropdown;
