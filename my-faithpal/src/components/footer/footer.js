import React from 'react'
import styles from '@/components/footer/footer.module.css'

export default function footer() {
return (
    <footer className={styles.footer}>
    <div style={{display: 'flex', flexWrap: 'wrap-reverse',flexDirection: 'row', flex: 1 ,alignItems: 'flex-start'}}>
        <p className={styles.p}>Hey there, Welcome!!!</p>
        <p className={styles.p}>_______________________________________________________________________________________</p>
    <div style={{ margin: '0', paddingLeft: '0' }}>
        <button className={styles.button}>V</button>
    </div>
    </div>
</footer>
);
}
