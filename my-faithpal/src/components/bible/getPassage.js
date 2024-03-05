import { getBible } from "@/app/api/(bible)/bible/getBible";
import { baseUrl, postRequest } from '@/util/service';
import { useSession } from 'next-auth/react';
import { useEffect, useRef, useState } from 'react';
import ReactDOMServer from 'react-dom/server';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Editor, useDomValue } from 'reactjs-editor';
import styles from "./passage.module.css";

export default function DisplayPassage({ selectedBook, selectedChapter, selectedVerse , selectedTranslation, saveClicked }) {
    
    const { dom, setDom } = useDomValue();
    const [bibleData, setBibleData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const editorRef = useRef(null);
    const notify = () => toast("Thanks...Saved!!!", {
    position: "bottom-left",
    style: {
        backgroundColor: "rgb(215, 203, 155)",
        color: "#996515",
        maxWidth: "fit-content",
        padding: 10
    },
    hideProgressBar: false
    });
    
    let PassageRef = selectedBook + " " + selectedChapter;
    let transRef = selectedTranslation;

    const { data: session } = useSession();

    useEffect(() => {
        if (saveClicked) {
            handleSave();
            console.log("Save received")
        }
    }, [saveClicked]);

    const handleSave = async() => {
        const updatedDomValue = {
        key: dom?.key,
        props: dom?.props,
        type: dom?.type,
        ref: PassageRef,
        verse: selectedVerse,
        translation: transRef,
        _id: session?.user?._id,
        };

        let newRef = PassageRef + selectedVerse + selectedTranslation;

        const passageExists = await postRequest(`${baseUrl}bible/save/changes`, JSON.stringify({
            key: updatedDomValue.key, props: updatedDomValue.props, type: updatedDomValue.type, ref: newRef, user: updatedDomValue._id,
        }));

        if (passageExists.error) {
            console.log(passageExists.error);
        }
        else {
            console.log("Yayyy passage was saved successfully",passageExists);
        }
    //let newChange = localStorage.setItem(`dom${PassageRef}${selectedVerse}${selectedTranslation}${session?.user?._id}`, JSON.stringify(updatedDomValue))
    //console.log("Saved",newChange);
    notify()
    }

    useEffect(() => {
        const fetchPassageData = async () => {

            const user = session?.user?._id;
            const ref = PassageRef + selectedVerse + selectedTranslation;
            
            const getPassage = await postRequest(`${baseUrl}bible/get/changes`, JSON.stringify({ ref, user }));

            if (getPassage) {
                //var persistedDom = localStorage.getItem(`dom${PassageRef}${selectedVerse}${selectedTranslation}${session?.user?._id}`)
                const receivedPassage = JSON.stringify(getPassage);
                console.log(receivedPassage);
                setDom(JSON.parse(receivedPassage));
            }
            else {
                setDom(editorRef.current)
            }
        }
        fetchPassageData()
    },  [bibleData])

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

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>Error: {error}</p>;
    }
    
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
            <Editor htmlContent={htmlContent} />
            <ToastContainer/>
        </main>
    );
}
