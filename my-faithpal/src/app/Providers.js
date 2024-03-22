"use client"

import { SessionProvider } from "next-auth/react"
import { ChatContextProvider } from "@/context/chatContext"
import { AIChatContextProvider } from "@/context/aiChatContext"

export const Providers = ({ children }) => {
    return(
    <SessionProvider>
        <ChatContextProvider>
            <AIChatContextProvider>
                    {children}
            </AIChatContextProvider>
        </ChatContextProvider>
    </SessionProvider>)
}