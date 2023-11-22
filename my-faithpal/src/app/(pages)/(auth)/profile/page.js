import styles from "@/app/(pages)/(auth)/profile/profile.module.css"

export default function profile() {
    return (
    <main className={styles.main}>
        <section>
            <div>
                Name:
                <span>
                Enoch Abiodun
                </span>
            </div>
            <div>
                Email:
                <span>
                enoch@gmail.com
                </span>
            </div>
            <button>
                Log Out
            </button>
        </section>
    </main>
    )
}
