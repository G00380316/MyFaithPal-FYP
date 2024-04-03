import React from 'react';
import Grid from '@mui/joy/Grid';
import HighlightCard from './highlightBox';

let HighlightArray = [];
let reference;

function findSpans(obj, parentObj = null, parentKey = null) {
    if (typeof obj === 'object' && obj !== null) {
        //Getting Reference once we find it
        if (obj.reference) {
            reference = obj.reference
        }

        if (obj?.props?.children?.[0]?.props?.children?.[1]?.props?.className?.includes("highlight")) {
            if (parentObj && parentKey !== null) {
                
                const child = parentObj?.[1]?.props?.children?.[0].props?.children?.[1]?.props?.children?.[0];
                const verse = parentObj?.[0]?.props?.children?.[0];
                //console.log("higlight verse: ", child);
                
                if (!HighlightArray.some(item => item?.highlight === child)) {
                    //console.log("Found highlight: ", parentObj);
                    HighlightArray.push({ highlight: child , ref: reference, verse});
                    console.log("Found highlight array: ", HighlightArray);
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

export default function Highlights({highlights}) {

    findSpans(highlights);

    return (
        <main style={{marginBottom: 100}}>
            <Grid container spacing={2} marginTop={2} padding={1} overflow={"scroll"}>
                {HighlightArray.slice().reverse().map((highlight, index) => (
                    <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                        <HighlightCard
                            highlight={highlight?.highlight}
                            reference={highlight?.ref}
                            verse={highlight?.verse}
                        />
                    </Grid>
                ))}
            </Grid>
        </main>
    )
}