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
  

  return (
    <>
    <Navbar/>
      <main className={styles.main}>
        <div className={styles.center}>
          <div style={{ borderWidth: 20, borderColor: 'black' }}>
              <li style={{color: "transparent", maxWidth:2000}}>
                {!passage ? (
                        <>
                          <h1 style={{ color: '#EDEEE9', fontSize: 50 }}>{passage.reference}</h1>
                          <h1 style={{ color: 'white'}}>{passage.text}</h1>
                          <div style={{paddingLeft: 440, paddingTop: 50}}>
                              <Link href='/bible' ><button className={styles.button}>Start Reading</button> </Link>
                          </div>
                        </>
                ) : (
                        <>
                          <h1 style={{ color: '#EDEEE9', fontSize: 50 }}>Genesis 1:1</h1>
                          <h1 style={{ color: 'white' }}>"In the beginning God created the heaven and the earth."</h1>
                          <div style={{paddingLeft: 340,paddingTop: 50}}>
                              <Link href='/bible' ><button className={styles.button}>Start Reading</button> </Link>
                          </div>
                        </>
              )}
            </li>
          </div>
        </div>
      </main>
    <Footer/>
    </>
  );
}
