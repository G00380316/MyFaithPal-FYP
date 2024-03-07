"use client"

import { SessionProvider } from "next-auth/react"
import { ChatContextProvider } from "@/context/chatContext"

export const Providers = ({ children }) => {
    return(
    <SessionProvider>
        <ChatContextProvider>
                {children}
        </ChatContextProvider>
    </SessionProvider>)
}