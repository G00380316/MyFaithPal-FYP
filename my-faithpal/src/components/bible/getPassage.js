import React, { useEffect, useState } from 'react';
import { getBible } from "@/app/api/bible/getBible";

export default function DisplayPassage({ selectedBook, selectedChapter }) {
    
    const [bibleData, setBibleData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
    const fetchData = async () => {
        try {
        setLoading(true);

        const data = await getBible(selectedBook, selectedChapter);
        setBibleData(data.verses || []);
        } catch (error) {
        console.error('Error fetching Bible data:', error);
        setError(error.message || 'An error occurred while fetching data');
        } finally {
        setLoading(false);
        }
    };

    fetchData();
    }, [selectedBook, selectedChapter]);

    if (loading) {
    return <p>Loading...</p>;
    }

    if (error) {
    return <p>Error: {error}</p>;
    }

    return (
    <div>
        <br />
        {bibleData.map((passage, index) => (
        <div key={index}>
            <h2>{passage.reference}</h2>
            <p dangerouslySetInnerHTML={{ __html: passage.text }} />
        </div>
        ))}
        <br />
    </div>
    );
}
