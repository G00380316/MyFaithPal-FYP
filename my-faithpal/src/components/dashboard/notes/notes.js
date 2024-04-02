import React from 'react';
import Grid from '@mui/joy/Grid';
import NoteCard from './noteBox';

let NotesArray = [];
let reference;

function findSpans(obj, parentObj = null, parentKey = null) {
    if (typeof obj === 'object' && obj !== null) {
        //Getting Reference once we find it
        if (obj.reference) {
            reference = obj.reference
        }

        if (obj?.props?.children?.[0]?.props?.children?.[1]?.props?.className?.includes("comment")) {
            if (parentObj && parentKey !== null) {
                
                const child = parentObj?.[1]?.props?.children?.[0].props?.children?.[1]?.props?.children?.[0];
                const comment = parentObj?.[1]?.props?.children?.[0].props?.children?.[1]?.props?.children?.[1]?.props?.children?.[1];
                const verse = parentObj?.[0]?.props?.children?.[0];
                //console.log("note verse: ", child);
                
                if (!NotesArray.some(item => item?.note === child)) {
                    //console.log("Found note: ", parentObj);
                    NotesArray.push({ note: child , ref: reference, verse , comment});
                    console.log("Found note array: ", NotesArray);
                }
            }
        } else if (Array.isArray(obj)) {
            for (let i = 0; i < obj.length; i++) {
                findSpans(obj[i], obj, i);
            }
        } else {
            for (let key in obj) {
                if (Object.prototype.hasOwnProperty.call(obj, key)) {
                    // Pass the current object and its ancestors as arguments
                    findSpans(obj[key], obj, key, parentObj, parentKey);
                }
            }
        }
    }
}

export default function Notes({notes}) {

    findSpans(notes);

    return (
        <main style={{marginBottom: 100}}>
            <Grid container spacing={2} marginTop={2} padding={1} overflow={"scroll"}>
                {NotesArray.slice().reverse().map((note, index) => (
                    <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                        <NoteCard
                            note={note?.note}
                            reference={note?.ref}
                            verse={note?.verse}
                            comment={note?.comment}
                        />
                    </Grid>
                ))}
            </Grid>
        </main>
    )
}
