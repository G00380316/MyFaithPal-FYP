"use client"

import styles from "@/components/forms/form.module.css";
import { Facebook, Google } from "@mui/icons-material";
import { CardContent, Divider, Typography } from "@mui/joy";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginForm() {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const router = useRouter();

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {
            if (!email || !password) return;

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
            //console.log(error);
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
            <Divider sx={{ margin: 1 }} />
                        <button onClick={() => signIn("google")} className ={styles.button}>
                        <CardContent orientation="horizontal" sx={{alignItems: "center", justifyContent: "space-evenly", m: 'auto',}}>
                            <Google sx={{ml: 'auto'}}/>
                            <Typography sx={{m: 'auto'}}>Continue with Google</Typography>
                        </CardContent>
                        </button>
                        <button onClick={() => signIn("facebook")} className ={styles.button}>
                            <CardContent orientation="horizontal" sx={{alignItems: "center", justifyContent: "space-evenly", m: 'auto',}}>
                                <Facebook sx={{ml: 'auto'}}/>
                                <Typography sx={{m: 'auto'}}>Continue with Facebook</Typography>
                            </CardContent>
                        </button>
            <Divider sx={{ margin: 1 }} />
            <div style={{ marginBottom: 5 }}>
                <Link href='/register'><button className={styles.button}>Sign up</button></Link>
            </div>
        </div>
    )
}