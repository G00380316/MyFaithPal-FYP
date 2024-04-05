import { getBible } from "@/app/api/(bible)/bible/getBible";
import { baseUrl, postRequest } from '@/util/service';
import { useSession } from 'next-auth/react';
import { useEffect, useRef, useState } from 'react';
import ReactDOMServer from 'react-dom/server';
import { Editor, useDomValue } from 'reactjs-editor';
import styles from "./passage.module.css";
import { Grid,Stack } from "@mui/joy";
import { LoadingButton } from "@mui/lab";
import { NotifyCustom } from "@/util/notify";
import { Icons } from "react-toastify";

export default function DisplayPassage({ selectedBook, selectedChapter, selectedVerse , selectedTranslation, saveClicked, clearClicked }) {
    
    const { dom, setDom } = useDomValue();
    const [bibleData, setBibleData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const editorRef = useRef(null);
    
    let PassageRef = selectedBook + " " + selectedChapter;
    let transRef = selectedTranslation;

    const { data: session } = useSession();

    useEffect(() => {
        if (saveClicked) {
            handleSave();
            console.log("Save received")
        }
    }, [saveClicked]);

    useEffect(() => {
        if (clearClicked) {
            handleClear();
            console.log("Request to Clear received")
        }
    }, [clearClicked]);

    const handleClear = async () => {
        const updatedDomValue = {
        key: dom?.key,
        props: dom?.props,
        type: dom?.type,
        reference: PassageRef,
        verse: selectedVerse,
        translation: transRef,
        _id: session?.user?._id,
        };

        let newRef = PassageRef + selectedVerse + selectedTranslation;

        const passageExists = await postRequest(`${baseUrl}bible/clear/changes`, JSON.stringify({
            reference: newRef, user: updatedDomValue._id,
        }));

    NotifyCustom({text:`Oh Oh notes in ${PassageRef} have been cleared...Em sorry?!!`, bar: true, icon: Icons.success })
    }

    const handleSave = async() => {
        const updatedDomValue = {
        key: dom?.key,
        props: dom?.props,
        type: dom?.type,
        reference: PassageRef,
        verse: selectedVerse,
        translation: transRef,
        _id: session?.user?._id,
        };

        let newRef = PassageRef + selectedVerse + selectedTranslation;

        const passageExists = await postRequest(`${baseUrl}bible/save/changes`, JSON.stringify({
            key: updatedDomValue.key, props: updatedDomValue.props, type: updatedDomValue.type, reference: newRef, user: updatedDomValue._id,
        }));

        if (passageExists.error) {
            console.log(passageExists.error);
        }

    NotifyCustom({text:`"${PassageRef}", Saved`, bar: false, icon: Icons.success })
    }

    useEffect(() => {
        const fetchPassageData = async () => {

            const user = session?.user?._id;
            const reference = PassageRef + selectedVerse + selectedTranslation;
            
            const getPassage = await postRequest(`${baseUrl}bible/get/changes`, JSON.stringify({ reference, user }));

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
            return <Grid  container direction="row" justifyContent="space-around" alignItems="stretch">
                <Grid>
                </Grid>
                    <Grid>
                        <Stack marginTop="35vh" alignItems="center">
                        <LoadingButton loading variant="none" size='large'/>
                        </Stack>
                    </Grid>
                    <Grid>
                </Grid>
        </Grid>;
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
        </main>
    );
}
