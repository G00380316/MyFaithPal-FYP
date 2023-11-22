import Link from "next/link"
import styles from "@/components/forms/form.module.css"

export default function regForm() {
    return (
        <div className={styles.container}>
            <h1>Register page</h1>
            <Link href='/'><p>Go home</p></Link>
        </div>
    )
}