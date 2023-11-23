import RegForm from "@/components/forms/regForm"
import styles from "@/app/(pages)/(auth)/register/reg.module.css"
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export default async function register() {
    const session = await getServerSession(authOptions);

    if (session) redirect("profile");
    
    return (
        <main className={styles.main}>
            <div>
                <RegForm />
            </div>
        </main>
    )
}