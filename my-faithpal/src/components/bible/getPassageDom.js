import React, { useEffect, useState, useRef } from 'react';
import { getBible } from "@/app/api/bible/getBible";
import { Editor, useDomValue } from 'reactjs-editor';
import ReactDOMServer from 'react-dom/server';
import styles from "./passage.module.css";
import { useSession } from 'next-auth/react';

export default function DisplayPassage({ selectedBook, selectedChapter, selectedVerse , selectedTranslation }) {
    
    const { dom, setDom } = useDomValue();
    const [bibleData, setBibleData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const editorRef = useRef(null);

    const { data: session } = useSession();

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);

                const data = await getBible(selectedBook, selectedChapter, selectedVerse , selectedTranslation);
                setBibleData(data.verses || []);
                console.log("get Passage information", data);
            } catch (error) {
                console.error('Error fetching Bible data:', error);
                setError(error.message || 'An error occurred while fetching data');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [selectedBook, selectedChapter, selectedVerse , selectedTranslation]);

    useEffect(() => {
        // Update the DOM value whenever bibleData changes
        setDom(editorRef.current);
    }, [bibleData, setDom]);

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>Error: {error}</p>;
    }

    let PassageRef = selectedBook + " " + selectedChapter;
    let transRef = selectedTranslation;
    
    const updatedDomValue  = {
        props: dom?.props?.children,
        type: dom?.type,
        ref: PassageRef,
        translation: transRef,
        _id: session?.user?._id,
    }

    console.log("This is the updated Dom or Webpage",updatedDomValue);
    
    const htmlContent = ReactDOMServer.renderToString(
    <div style={{ maxWidth: 400, margin: '0 auto', textAlign: 'center' }}>
        <br />
        <div>
            <h1 dangerouslySetInnerHTML={{ __html: bibleData[0]?.book_name + " " + bibleData[0]?.chapter }} />
        </div>
        {bibleData.map((passage, index) => (
            <div key={index} style={{margin: 5}}>
                <h5 dangerouslySetInnerHTML={{ __html: passage.verse }} style={{marginBottom : 10}} />
                <p dangerouslySetInnerHTML={{ __html: passage.text }} style={{ fontSize: 24, fontWeight: 300 }} />
            </div>
        ))}
        <br />
    </div>
    );

    return (
        <main className={styles.main}>
            <Editor htmlContent={htmlContent}/>
        </main>
    );
}
