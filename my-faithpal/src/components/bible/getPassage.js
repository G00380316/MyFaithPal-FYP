import React, { useEffect, useState } from 'react';
import { getBible } from "@/app/api/bible/getBible";

export default function DisplayPassage() {
    const [bibleData, setBibleData] = useState("");

    useEffect(() => {
        const fetchData = async () => {
        const data = await getBible();
        setBibleData(data);
    };

    fetchData();
    }, []);

    const passagesArray = Object.values(bibleData);

    return (
        <div>
        <br></br>
        {passagesArray.map((passage, index) => (
        <div key={index}>
        <h2>{passage.reference}</h2>
        <p dangerouslySetInnerHTML={{ __html: passage.content }} />
        </div>
    ))}
            <br></br>
            <br></br>
            <br></br>
            <br></br>
            <br></br>
            <br></br>
            <br></br>
    </div>
    );
}