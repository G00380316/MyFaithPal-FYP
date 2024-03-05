"use client"

import Link from "next/link"
import styles from "@/components/forms/form.module.css"
import { useState } from "react";
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation";

export default function LoginForm() {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const res = await signIn("credentials", {
                email, password, redirect: false
            });

            if (res.error) {
                setError("Invalid Credentials");
                return;
            }

            router.replace("/profile");
        }
        catch (error) {
            console.log(error);
        }
    };
    
    return (
        <div className={styles.container}>
            <div>
            <h3 className={styles.title}>Sign in</h3>
            <p className={styles.description}>Enter your email address and password below</p>
            </div>
            <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.field}>
                    <label htmlFor="email">Email</label>
                    <input onChange={(e) => setEmail(e.target.value)} type="email" id="email"></input>
                </div>
                <div className={styles.field}>
                    <label htmlFor="password">Password</label>
                    <input onChange={(e) => setPassword(e.target.value)} type="password" id="password"></input>
                </div>
                <div>
                    <button>Sign in</button>
                    {error &&(
                        <div className={styles.error}>
                            {error}
                        </div>)}
                </div>
            </form>
            <div className={styles.link}>
                <Link href='/register'><p className={styles.p}>Haven't registered yet click here!!!</p></Link>
            </div>
        </div>
    )
}