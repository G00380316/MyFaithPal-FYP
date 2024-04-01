import { baseUrl, postRequest } from '@/util/service';
import { useSession } from 'next-auth/react';
import React, { useState, useEffect } from 'react'

let HighlightArray = [];

function findSpans(obj, parentObj = null, parentKey = null) {
    if (typeof obj === 'object' && obj !== null) {
        if (obj.props?.className?.includes("highlight")) {
            if (parentObj && parentKey !== null) {
                const child = parentObj?.[1]?.props?.children?.[0];
                console.log("higlight verse: ", child);
                if (!HighlightArray.some(item => item?.[1]?.props?.children?.[0] === child)) {
                    console.log("Found highlight:", parentObj);
                    HighlightArray.push(parentObj);
                    console.log("Found highlight array:", HighlightArray);
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
                    findSpans(obj[key], obj, key);
                }
            }
        }
    }
}


export default function Highlights() {
    
    const { data: session } = useSession();
    const [highlights, setHighlights] = useState([]);

    useEffect(() => {
        const fetchPassageData = async () => {

            const user = session?.user?._id;
            
            const getPassage = await postRequest(`${baseUrl}bible/get/user/changes`, JSON.stringify({ user }));

            findSpans(getPassage);
            console.log("Highlights: ", HighlightArray);
            setHighlights(JSON.stringify(HighlightArray));
            
        }

        fetchPassageData()

    }, [])
    
    return (
        <div>{highlights}</div>
    )
}
