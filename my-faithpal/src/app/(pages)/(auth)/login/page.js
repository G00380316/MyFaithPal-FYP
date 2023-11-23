import LoginForm from "@/components/forms/loginForm"
import styles from "@/app/(pages)/(auth)/login/login.module.css"
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export default async function login() {

    const session = await getServerSession(authOptions);

    if (session) redirect("profile");

    return (
    <main className={styles.main}>
        <div>
            <LoginForm />
        </div>
    </main>
    )
}
