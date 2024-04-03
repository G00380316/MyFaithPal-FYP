"use client"

import React, { useState, useEffect } from "react";
import Dropdown from "@/components/bible/dropdown";
import styles from "@/app/(pages)/(userPages)/bible/bible.module.css";
import DisplayPassage from "@/components/bible/getPassage";
import { Stack } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2/Grid2';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useSession } from 'next-auth/react';
import { NotifyCustom } from "@/util/notify";

const Styles = {
    root: {
        maxHeight: '90vh',
        overflowY: 'scroll',
        '&::-webkit-scrollbar': {
        width: '0.1em'
        },
        '&::-webkit-scrollbar-thumb': {
        backgroundColor: 'rgba(0,0,0,0)',
        borderRadius: '0.25em'
        }
    }
};

export default function Bible() {
    const [selectedBook, setSelectedBook] = useState("Genesis");
    const [selectedChapter, setSelectedChapter] = useState("1");
    const [selectedVerse, setSelectedVerse] = useState("");
    const [selectedTranslation, setSelectedTranslation] = useState("");
    const [saveClicked, setSaveClicked] = useState(false);
    const [clearClicked, setClearClicked] = useState(false);

    const { data: session } = useSession();

    const handleSelectionChange = (book, chapter, verse, translation) => {
        setSelectedBook(book);
        setSelectedChapter(chapter);
        setSelectedVerse(verse);
        setSelectedTranslation(translation);
    };

    const handleSaveButtonClick = () => {
        setSaveClicked(true);
        console.log("Update saveClicked state to: ", saveClicked);
    };

    const handleClearButtonClick = () => {
        setClearClicked(true);
        console.log("Update clearClicked state to: ", clearClicked);
    };

    useEffect(() => {
        if (saveClicked) {
            console.log("Save operation completed.");
            // Reset saveClicked back to false
            setSaveClicked(false);
        }
    }, [saveClicked]);

    useEffect(() => {
        if (clearClicked) {
            console.log("Clear operation completed.");
            // Reset saveClicked back to false
            setClearClicked(false);
        }
    }, [clearClicked]);

    useEffect(() => {
        if (!session?.user) {
            NotifyCustom({text:"Login in to use all features", bar: false});
        }
    }, [session]);


    return (
            <Grid  container direction="column">
                <Stack spacing={1} sx={Styles.root}>
                    <div className={styles.nav}>
                        <Dropdown onSelectionChange={handleSelectionChange} onSaveClick={handleSaveButtonClick} onClearClick={handleClearButtonClick}/>
                    </div>
                        <DisplayPassage selectedBook={selectedBook} selectedChapter={selectedChapter} selectedVerse={selectedVerse} selectedTranslation={selectedTranslation} saveClicked={saveClicked} clearClicked={clearClicked} />
                </Stack>
            <ToastContainer/>
            </Grid>
    );
}
