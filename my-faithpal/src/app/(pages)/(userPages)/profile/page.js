import styles from "@/app/(pages)/(userPages)/profile/profile.module.css"
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import MyProfile from "@/components/dashboard/profile";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default async function profile() {

    const session = await getServerSession(authOptions);

    if (!session) { redirect("login"); }

    return (
    <main className={styles.main}>
            <MyProfile />
            <ToastContainer/>
    </main>
    )
}
