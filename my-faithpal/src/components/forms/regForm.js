"use client";

import Link from "next/link"
import styles from "@/components/forms/form.module.css"
import { useState } from "react";

export default function regForm() {

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    console.log(name);
    console.log(email);
    console.log(password);

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!name || !email || !password) {
            setError("All fields are necessary");
            return;
        }
    };

    return (
        <div className={styles.container}>
            <div>
            <h3 className={styles.title}>Sign up</h3>
            <p className={styles.description}>Enter your Full Name, Email Address and Password below</p>
            </div>
            <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.field}>
                    <label htmlFor="name">Full Name</label>
                    <input onChange={(e) => setName(e.target.value)} type="name" id="name"></input>
                </div>
                <div className={styles.field}>
                    <label htmlFor="email">Email</label>
                    <input onChange={(e) => setEmail(e.target.value)} type="email" id="email"></input>
                </div>
                <div className={styles.field}>
                    <label htmlFor="password">Password</label>
                    <input onChange={(e) => setPassword(e.target.value)} type="password" id="password"></input>
                </div>
                <div>
                    <button>Sign up</button>
                    {error &&(
                    <div className={styles.error}>
                        {error}
                    </div>)}
                </div>
            </form>
            <div className ={styles.link}>
                <Link href='/login'><p className={styles.p}>Login</p></Link>
                <Link href='/'><p className={styles.p}>Go Home</p></Link>
            </div>
        </div>
    )
}