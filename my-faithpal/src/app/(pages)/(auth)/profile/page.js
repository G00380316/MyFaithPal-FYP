import styles from "@/app/(pages)/(auth)/profile/profile.module.css"
import UserInfo from "@/components/forms/userInfo";

export default function profile() {
    return (
    <main className={styles.main}>
        <UserInfo />
    </main>
    )
}
