"use client";

import styles from "@/components/forms/form.module.css";
import { Facebook, Google } from "@mui/icons-material";
import { Divider, CardContent, Typography } from "@mui/joy";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";


export default function regForm() {

    const [username, setUsername] = useState("");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const router = useRouter();

    //console.log(name);
    //console.log(email);
    //console.log(password);

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {
            if (!email || !password) return;

            if (!name || !email || !password) {
                setError("All fields are necessary");
                return;
            }

            const resUserExists = await fetch('api/userCheck', {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email }),
            });

            const { user } = await resUserExists.json();

            if (user) {
                setError("User already exists");
                form.reset();
                //console.log(error);
                return;
            }

            const res = await fetch('api/register', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    username, name, email, password
                }),
            });

            if (res.ok) {
                const form = e.target;
                form.reset();
                router.push("/login");
            } else {
                //console.log("Error registraiton failed", error);
            }
        } catch (error) {
            //console.log("Error whilst Registration: ", error);
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
                    <label htmlFor="username">Username</label>
                    <input onChange={(e) => setUsername(e.target.value)} type="username" id="username"></input>
                </div>
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
                <Divider sx={{ margin: 1 }} />
                <p className={styles.description}>Click Sign In to Log in or Sign up with Google</p>
                <div>
                    <Divider sx={{ margin: 1 }} />
                        <button onClick={() => signIn("google")} className ={styles.button}>
                        <CardContent orientation="horizontal" sx={{alignItems: "center", justifyContent: "center", m: 'auto',}}>
                            <Google sx={{ml: 'auto'}}/>
                            <Typography sx={{m: 'auto'}}>Continue with Google</Typography>
                        </CardContent>
                        </button>
                    {/*<button onClick={() => signIn("facebook")} className ={styles.button}>
                            <CardContent orientation="horizontal" sx={{alignItems: "center", justifyContent: "space-evenly", m: 'auto',}}>
                                <Facebook sx={{ml: 'auto'}}/>
                                <Typography sx={{m: 'auto'}}>Continue with Facebook</Typography>
                            </CardContent>
                    </button>*/}
                    <Divider sx={{mt: 1}}/>
                </div>
            </form>
            <div>
                    <Link href='/login'><button className ={styles.button}>Sign in</button></Link>
                    <Link href='/'><button className ={styles.button}>Home</button></Link>
            </div>
        </div>
    )
}