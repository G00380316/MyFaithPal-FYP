"use client"

import Navbar from "@/components/navbar/navbar.js";
import { NotifyCustom } from "@/util/notify";
import { baseUrl, getRequest } from '@/util/service';
import { Box } from "@mui/joy";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from 'react';
import styles from "./page.module.css";

export default function Home() {

  const [passage, setPassage] = useState(null);
  const [previousReference, setPreviousReference] = useState(null);
  const [previousText, setPreviousText] = useState(null);
  const [previousValue, isPreviousValue] = useState(null);
  const { data: session } = useSession();

  useEffect(() => {

    const fetchPassageData = async () => {

      const getPassage = await getRequest(`${baseUrl}bible/random`);
      setPassage(getPassage);
      
    }

    fetchPassageData();

  }, []);

  useEffect(() => {

    if (!session) {
      
      NotifyCustom({ text: `What to get to know God...Start reading.`, theme: "dark" });
      
    }

  },[session])

  const getReference = () => {

    if (session) {
      if (passage && passage.reference) {
        if (!previousReference) {

          setPreviousReference(passage.reference);
          NotifyCustom({ text: `What does this verse say to you\n${passage.reference}` });
        }

        return previousReference;

      }
      
      return null;

    } else {

      return "Genesis 1:1";

    };
  }


  const getPassageText = () => {
    
    if (session) {
      if (passage && passage.text) {
        if (!previousText) {

          setPreviousText(passage.text);
        }

        return previousText;
      }

      return null;

    } else {

      return "In the beginning, God created the heavens and the earth.";

    }
    
  };


  return (
    <Box display="flex" flexDirection="column" width="100%" height="100vh">
        <Navbar/>
        <main className={styles.main}>
        <div className={styles.center}>
          <div style={{ borderWidth: 20, borderColor: 'black', display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
              <li style={{color: "transparent", maxWidth:1000, overflow:"auto"}}>
              <h1 style={{ color: '#EDEEE9', fontSize: 50 }}>{getReference()}</h1>
                  <h1 style={{ color: 'white' }}>{getPassageText()}</h1>
              </li>
              <div style={{marginTop: 20}}>
                <Link href='/bible' ><button className={styles.button}>Start Reading</button> </Link>
              </div>
          </div>
        </div>
      </main>
    </Box>
  );
}
