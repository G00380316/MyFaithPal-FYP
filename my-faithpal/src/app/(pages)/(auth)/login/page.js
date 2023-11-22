import LoginForm from "@/components/forms/loginForm"
import styles from "@/app/(pages)/(auth)/login/login.module.css"

export default function login() {
    return (
    <main className={styles.main}>
        <div>
            <LoginForm />
        </div>
    </main>
    )
}
