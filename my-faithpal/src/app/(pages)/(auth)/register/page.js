import RegForm from "@/components/forms/regForm"
import styles from "@/app/(pages)/(auth)/register/reg.module.css"

export default function register() {
    return (
        <main className={styles.main}>
            <div>
                <RegForm />
            </div>
        </main>
    )
}