import React, { useEffect, useState } from 'react';
import { getBible } from "@/app/api/bible/getBible";

export default function DisplayPassage({ selectedBook, selectedChapter , selectedVerse }) {
    
    const [bibleData, setBibleData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
    const fetchData = async () => {
        try {
        setLoading(true);

        const data = await getBible(selectedBook, selectedChapter, selectedVerse);
            setBibleData(data.verses || []);
            console.log("get Passage information",data);
        } catch (error) {
        console.error('Error fetching Bible data:', error);
        setError(error.message || 'An error occurred while fetching data');
        } finally {
        setLoading(false);
        }
    };

    fetchData();
    }, [selectedBook, selectedChapter, selectedVerse]);

    if (loading) {
    return <p>Loading...</p>;
    }

    if (error) {
    return <p>Error: {error}</p>;
    }

    return (
    <div>
        <br />
            <div>
            <h1 dangerouslySetInnerHTML={{__html: bibleData[0].book_name + " " + bibleData[0].chapter }}/>
        </div>
        {bibleData.map((passage, index) => (
        <div key={index}>
                <h6 dangerouslySetInnerHTML={{ __html: passage.verse }} />
            <p dangerouslySetInnerHTML={{ __html: passage.text }} />
        </div>
        ))}
        <br />
    </div>
    );
}
