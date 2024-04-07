"use client"

import { signOut, useSession } from "next-auth/react";
import Link from "next/link";

export default function userInfo() {

    const { data: session } = useSession();

    return (
        <section>
            <div>
            Name:
                <span>
                {session?.user?.name}
                </span>
            </div>
            <div>
            Email:
                <span>
                {session?.user?.email}
                </span>
            </div>
            <div>
            <button onClick={() => signOut({callbackUrl:`${process.env.NEXT_PUBLIC_CLIENT_URL}/login`})}>
                Log Out
            </button >
            <Link href='/' ><button style={{backgroundColor: 'green'}}>Main application</button></Link>
            </div>
            
        </section>
        )
}


