import Link from "next/link";
import styles from "./page.module.css";
import Navbar from "@/components/navbar/navbar.js";
import Footer from "@/components/footer/footer";

export default function Home() {
  return (
    <>
    <Navbar/>
      <main className={styles.main}>
        <div className={styles.center}>
          <div style={{ borderWidth: 20, borderColor: 'black' }}>
              <li style={{color: "transparent"}}>
              <h1 style={{color: '#EDEEE9',fontSize:50}}>Genesis 1:1</h1>
              <h1 style={{ color: 'white' }}>"In the beginning God created the heaven and the earth."</h1>
              <div style={{paddingLeft: 340,paddingTop: 50}}>
              <Link href='/bible' ><button className={styles.button}>Start Reading</button> </Link>
              </div>
            </li>
          </div>
        </div>
      </main>
    <Footer/>
    </>
  );
}
