"use client"

import { signOut } from "next-auth/react";

export default function userInfo() {
return (
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
        <button onClick={() => signOut()}>
            Log Out
        </button>
    </section>
    )
}


