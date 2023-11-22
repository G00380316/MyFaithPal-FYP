import Link from "next/link"
import styles from "@/components/forms/form.module.css"

export default function LoginForm() {
    return (
        <div className={styles.container}>
            <div>
            <h3 className={styles.title}>Sign in</h3>
            <p className={styles.description}>Enter your email address and password below</p>
            </div>
            <form className={styles.form}>
                <div className={styles.field}>
                    <label htmlFor="email">Email</label>
                    <input type="email" id="email"></input>
                </div>
                <div className={styles.field}>
                    <label htmlFor="password">Password</label>
                    <input type="password" id="password"></input>
                </div>
                <div>
                    <button>Sign in</button>
                    <div className={styles.error}>
                        Error try again
                    </div>
                </div>
            </form>
            <div className={styles.link}>
                <Link href='/register'><p className={styles.p}>Haven't registered yet click here!!!</p></Link>
            </div>
        </div>
    )
}