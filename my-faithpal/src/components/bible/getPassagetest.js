import { getBible } from "@/app/api/bible/getBible";
import { useSession } from 'next-auth/react';
import { useEffect, useRef, useState } from 'react';
import ReactDOMServer from 'react-dom/server';
import { Editor, useDomValue } from 'reactjs-editor';
import styles from "./passage.module.css";

export default function DisplayPassage({ selectedBook, selectedChapter, selectedVerse, selectedTranslation }) {

    let foundObjects = JSON.parse(localStorage.getItem('foundObjects')) || [];
    const { dom, setDom } = useDomValue();
    const [bibleData, setBibleData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const passageContainerRef = useRef(null); // Ref for the container div

    const { data: session } = useSession();

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);

                const data = await getBible(selectedBook, selectedChapter, selectedVerse, selectedTranslation);
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
    }, [selectedBook, selectedChapter, selectedVerse, selectedTranslation]);

    useEffect(() => {
        // Update the DOM value whenever bibleData changes
        setDom(passageContainerRef.current);
    }, [bibleData, setDom]);

    useEffect(() => {
    let foundObjects = JSON.parse(localStorage.getItem('foundObjects')) || [];

    // Loop through foundObjects to find a matching object based on the dom.ref
    foundObjects.forEach((foundObj) => {
        if (selectedVerse === 1) {
            // If a matching object is found, update the dom with that object
            setDom(foundObj.obj.props);
        }
    });
    }, [setDom]);

    useEffect(() => {
        localStorage.setItem('foundObjects', JSON.stringify(foundObjects));
        console.log("Saved: ", foundObjects);
    }, [foundObjects]);

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>Error: {error}</p>;
    }

    let PassageRef = selectedBook + " " + selectedChapter;
    let transRef = selectedTranslation;

    const updatedDomValue = {
        props: dom?.props?.children,
        type: dom?.type,
        ref: PassageRef, // Assuming you want the same reference for the 'ref' property of the main object
        verse: selectedVerse,
        translation: transRef,
        _id: session?.user?._id,
    };

    function findSpans(obj, parentObj = null, parentKey = null, grandparentObj = null, grandparentKey = null, greatGrandparentObj = null, greatGrandparentKey = null, greatGreatGrandparentObj = null, greatGreatGrandparentKey = null, greatGreatGreatGrandparentObj = null, greatGreatGreatGrandparentKey = null, greatGreatGreatGreatGrandparentObj = null, greatGreatGreatGreatGrandparentKey = null, ggreatGreatGreatGreatGrandparentObj = null, ggreatGreatGreatGreatGrandparentKey = null, gggreatGreatGreatGreatGrandparentObj = null, gggreatGreatGreatGreatGrandparentKey = null) {
        if (typeof obj === 'object' && obj !== null) {
            if (obj.type === 'span') {
                // If a span is found, push the great-great-great-grandparent object along with its key
                if (gggreatGreatGreatGreatGrandparentKey && gggreatGreatGreatGreatGrandparentObj !== null) {
                    console.log("Found span:", gggreatGreatGreatGreatGrandparentObj);
                    foundObjects.push({ obj: gggreatGreatGreatGreatGrandparentObj });
                }
            } else {
                // Continue traversing if not a span
                for (let key in obj) {
                    if (Object.prototype.hasOwnProperty.call(obj, key)) {
                        // Pass the current object and its ancestors as arguments
                        findSpans(obj[key], obj, key, parentObj, parentKey, grandparentObj, grandparentKey, greatGrandparentObj, greatGrandparentKey, greatGreatGrandparentObj, greatGreatGrandparentKey, greatGreatGreatGrandparentObj, greatGreatGreatGrandparentKey, greatGreatGreatGreatGrandparentObj, greatGreatGreatGreatGrandparentKey, ggreatGreatGreatGreatGrandparentObj, ggreatGreatGreatGreatGrandparentKey, gggreatGreatGreatGreatGrandparentObj, gggreatGreatGreatGreatGrandparentKey);
                    }
                }
            }
        }
    }

    function findElementByKey(obj, key) {
        if (!obj || typeof obj !== 'object') {
            return null;
        }

        // Check if the current object has the specified key
        if (obj.key === key) {
            return obj;
        }

        // Iterate over the object's properties to search recursively
        for (let prop in obj) {
            if (obj.hasOwnProperty(prop)) {
                const result = findElementByKey(obj[prop], key);
                if (result) {
                    return result;
                }
            }
        }

        // If the key is not found, return null
        return null;
    }

    const element = findElementByKey(foundObjects, "1-2");
    console.log("This is the props that matches the key in foundObject: ", element);

    //const element1 = findElementByKey1(updatedDomValue, "1-2");
    //console.log("This is the props from updatedDomValue that matches the key: ", element1);

    findSpans(updatedDomValue);
    console.log("This is the updated Dom or Webpage", updatedDomValue);

    const htmlContent = ReactDOMServer.renderToString(
        <div ref={passageContainerRef} style={{ maxWidth: 400, margin: '0 auto', textAlign: 'center' }}>
            <br />
            <div>
                <h1 dangerouslySetInnerHTML={{ __html: bibleData[0]?.book_name + " " + bibleData[0]?.chapter }} />
            </div>
            {bibleData.map((passage, index) => (
                <div key={index} style={{ margin: 5 }}>
                    <h5 dangerouslySetInnerHTML={{ __html: passage.verse }} style={{ marginBottom: 10 }} />
                    <p dangerouslySetInnerHTML={{ __html: passage.text }} style={{ fontSize: 24, fontWeight: 300 }} />
                </div>
            ))}
            <br />
        </div>
    );

    return (
        <main className={styles.main}>
            <Editor htmlContent={htmlContent} />
        </main>
    );
}
