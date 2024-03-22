"use client"

import Link from "next/link";
import styles from "./page.module.css";
import Navbar from "@/components/navbar/navbar.js";
import Footer from "@/components/footer/footer";
import { baseUrl, getRequest } from '@/util/service';
import { useEffect, useState } from 'react';

export default function Home() {

  const [passage, setPassage] = useState(null);

  useEffect(() => {
        const fetchPassageData = async () => {

          const getPassage = await getRequest(`${baseUrl}bible/random`);
          setPassage(getPassage);

        }
        fetchPassageData()
  }, [])

  const getReference = () => {
    if (passage && passage.reference) {
      return passage.reference;
    } else {
      return "Genesis 1:1";
    }
  }

  const getPassageText = () => {
    if (passage && passage.text) {
      return passage.text;
    } else {
      return '"In the beginning God created the heaven and the earth."';
    }
  }

  //Text to be added
  //verse of the day
  //Find out more of what the word of God is trying to say to you today
  return (
    <>
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
    <Footer/>
    </>
  );
}
